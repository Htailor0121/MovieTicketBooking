from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None

class User(UserBase):
    id: int
    is_admin: bool
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class TheaterBase(BaseModel):
    name: str
    total_seats: int

class TheaterCreate(TheaterBase):
    pass

class Theater(TheaterBase):
    id: int

    class Config:
        from_attributes = True

class MovieBase(BaseModel):
    title: str
    description: str
    duration: int
    release_date: datetime
    genre: str
    rating: float
    image_url: Optional[str] = None

class MovieCreate(BaseModel):
    title: str
    description: str
    duration: int
    release_date: datetime
    genre: str
    rating: float
    image_url: str
    price: Optional[float] = 300.00

class Movie(MovieBase):
    id: int
    screenings: List["Screening"] = []

    class Config:
        from_attributes = True

class ScreeningBase(BaseModel):
    movie_id: int
    theater_id: int
    screening_time: datetime
    price: float
    available_seats: int

class ScreeningCreate(ScreeningBase):
    pass

class Screening(ScreeningBase):
    id: int
    movie: Movie
    theater: Theater
    bookings: List["Booking"] = []

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    screening_id: int
    seats: List[int]

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    user_id: int
    total_amount: float
    booking_time: datetime
    status: str
    screening: Screening

    class Config:
        from_attributes = True

class MovieList(BaseModel):
    movies: List[Movie]
    total: int
    total_pages: int 