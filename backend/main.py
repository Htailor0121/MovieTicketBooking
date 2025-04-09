from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta
from typing import List, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import models
import schemas
from config import engine, get_db, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SessionLocal

# Create database tables if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Movie Booking API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Create admin user
def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin exists using optimized query
        admin = db.query(models.User.id).filter(models.User.username == "admin").first()
        if not admin:
            admin = models.User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
                is_admin=True,
                created_at=datetime.utcnow()
            )
            db.add(admin)
            db.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

# Create admin user on startup
@app.on_event("startup")
async def startup_event():
    create_admin_user()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

class LoginRequest(BaseModel):
    username: str
    password: str

# Authentication routes
@app.post("/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # Optimize query to only select necessary fields
    user = db.query(models.User).filter(
        models.User.username == login_data.username
    ).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Return both token and user data
    return {
        "token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin,
            "is_active": user.is_active
        }
    }

@app.post("/register", response_model=schemas.Token)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the password
    hashed_password = get_password_hash(user.password)
    
    # Create new user
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_active=True,
        is_admin=False,
        created_at=datetime.utcnow()
    )
    
    # Add user to database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# User routes
@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/users", response_model=List[schemas.User])
async def read_all_users(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to view all users")
    users = db.query(models.User).all()
    return users

@app.put("/users/{user_id}", response_model=schemas.User)
async def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update users")
    
    # Find the user to update
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent updating admin username if it's the admin account
    if db_user.username == "admin" and user_update.username and user_update.username != "admin":
        raise HTTPException(status_code=400, detail="Cannot change admin username")
    
    # Update user fields
    if user_update.username is not None:
        # Check if username is taken by another user
        existing_user = db.query(models.User).filter(
            models.User.username == user_update.username,
            models.User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already taken")
        db_user.username = user_update.username
    
    if user_update.email is not None:
        # Check if email is taken by another user
        existing_user = db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already taken")
        db_user.email = user_update.email
    
    if user_update.password:
        db_user.hashed_password = get_password_hash(user_update.password)
    
    if user_update.is_admin is not None:
        # Prevent removing admin status from the main admin account
        if db_user.username == "admin" and not user_update.is_admin:
            raise HTTPException(status_code=400, detail="Cannot remove admin status from main admin account")
        db_user.is_admin = user_update.is_admin
    
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if user is admin
    if current_user.username != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete users")
    
    # Prevent deleting the admin account
    if user_id == 1:  # Assuming admin has ID 1, adjust if needed
        raise HTTPException(status_code=400, detail="Cannot delete admin user")
    
    # Find the user
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete the user
    db.delete(db_user)
    db.commit()
    
    return None

@app.get("/users/me/bookings", response_model=List[schemas.Booking])
async def read_user_bookings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(models.Booking)
        .filter(models.Booking.user_id == current_user.id)
        .join(models.Screening)
        .join(models.Movie)
        .options(
            joinedload(models.Booking.screening)
            .joinedload(models.Screening.movie)
        )
        .all()
    )

# Movie routes
@app.get("/movies", response_model=schemas.MovieList)
async def read_movies(
    skip: int = 0,
    limit: int = 10,
    genre: Optional[str] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "title",
    db: Session = Depends(get_db)
):
    query = db.query(models.Movie)
    
    if genre:
        query = query.filter(models.Movie.genre == genre)
    if search:
        query = query.filter(models.Movie.title.ilike(f"%{search}%"))
    
    if sort == "rating":
        query = query.order_by(models.Movie.rating.desc())
    elif sort == "release_date":
        query = query.order_by(models.Movie.release_date.desc())
    else:
        query = query.order_by(models.Movie.title)
    
    total = query.count()
    movies = query.offset(skip).limit(limit).all()
    
    return {
        "movies": movies,
        "total": total,
        "total_pages": (total + limit - 1) // limit
    }

@app.get("/movies/featured", response_model=List[schemas.Movie])
async def read_featured_movies(db: Session = Depends(get_db)):
    return db.query(models.Movie).order_by(models.Movie.rating.desc()).limit(6).all()

@app.get("/movies/{movie_id}", response_model=schemas.Movie)
async def read_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(models.Movie).filter(models.Movie.id == movie_id).first()
    if movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return movie

@app.get("/movies/{movie_id}/screenings", response_model=List[schemas.Screening])
async def read_movie_screenings(movie_id: int, db: Session = Depends(get_db)):
    return db.query(models.Screening).filter(models.Screening.movie_id == movie_id).all()

# Screening routes
@app.get("/screenings/{screening_id}", response_model=schemas.Screening)
async def read_screening(screening_id: int, db: Session = Depends(get_db)):
    screening = db.query(models.Screening).filter(models.Screening.id == screening_id).first()
    if screening is None:
        raise HTTPException(status_code=404, detail="Screening not found")
    return screening

@app.get("/bookings", response_model=List[schemas.Booking])
async def get_all_bookings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to view all bookings")
    
    bookings = (
        db.query(models.Booking)
        .options(
            joinedload(models.Booking.user),
            joinedload(models.Booking.screening).joinedload(models.Screening.movie)
        )
        .order_by(models.Booking.booking_time.desc())
        .all()
    )
    return bookings

@app.post("/bookings", response_model=schemas.Booking)
async def create_booking(
    booking: schemas.BookingCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify screening exists
    screening = db.query(models.Screening).filter(models.Screening.id == booking.screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    # Verify seats are available
    if len(booking.seats) > screening.available_seats:
        raise HTTPException(status_code=400, detail="Not enough seats available")

    # Calculate total amount
    total_amount = screening.price * len(booking.seats)

    # Create booking
    db_booking = models.Booking(
        user_id=current_user.id,
        screening_id=booking.screening_id,
        seats=booking.seats,
        total_amount=total_amount,
        booking_time=datetime.utcnow(),
        status="confirmed"
    )

    # Update available seats
    screening.available_seats -= len(booking.seats)

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    return db_booking

@app.delete("/bookings/{booking_id}", status_code=204)
async def delete_booking(
    booking_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to delete bookings")

    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Return seats to available pool
    screening = db.query(models.Screening).filter(models.Screening.id == booking.screening_id).first()
    if screening:
        screening.available_seats += len(booking.seats)

    db.delete(booking)
    db.commit()

    return None

@app.post("/movies/add", response_model=schemas.Movie)
async def add_movie(
    movie: schemas.MovieCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to add movies")
    
    db_movie = models.Movie(**movie.dict())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)