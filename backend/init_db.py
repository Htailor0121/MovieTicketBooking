from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from models import Base, User, Movie, Theater, Screening
from config import DATABASE_URL
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create database engine
engine = create_engine(DATABASE_URL)

# Drop all existing tables
Base.metadata.drop_all(bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

# Create a new session
Session = sessionmaker(bind=engine)
db = Session()

# Create admin user
admin_user = User(
    email="admin@example.com",
    username="admin",
    hashed_password=pwd_context.hash("admin123"),
    is_active=True,
    is_admin=True
)

# Create sample theaters
theaters = [
    Theater(name="Theater 1", total_seats=100),
    Theater(name="Theater 2", total_seats=150),
    Theater(name="Theater 3", total_seats=200)
]

# Create sample movies
movies = [
    # Existing Hollywood movies
    {
        "title": "The Dark Knight",
        "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        "duration": 152,
        "release_date": "2008-07-18",
        "genre": "Action",
        "rating": 9.0,
        "image_url": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
        "title": "Inception",
        "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        "duration": 148,
        "release_date": "2010-07-16",
        "genre": "Sci-Fi",
        "rating": 8.8,
        "image_url": "https://image.tmdb.org/t/p/w500/8IB2e4r4oVhHnANbnm7O3Tj4dYz.jpg"
    },
    {
        "title": "Pulp Fiction",
        "description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        "duration": 154,
        "release_date": "1994-10-14",
        "genre": "Crime",
        "rating": 8.9,
        "image_url": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
    },
    {
        "title": "The Matrix",
        "description": "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free from the system.",
        "duration": 136,
        "release_date": "1999-03-31",
        "genre": "Sci-Fi",
        "rating": 8.7,
        "image_url": "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
    },
    {
        "title": "Forrest Gump",
        "description": "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
        "duration": 142,
        "release_date": "1994-07-06",
        "genre": "Drama",
        "rating": 8.8,
        "image_url": "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"
    },
    {
        "title": "The Godfather",
        "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        "duration": 175,
        "release_date": "1972-03-14",
        "genre": "Crime",
        "rating": 9.2,
        "image_url": "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
    },
    {
        "title": "Interstellar",
        "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        "duration": 169,
        "release_date": "2014-11-07",
        "genre": "Sci-Fi",
        "rating": 8.6,
        "image_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
        "title": "The Shawshank Redemption",
        "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        "duration": 142,
        "release_date": "1994-09-23",
        "genre": "Drama",
        "rating": 9.3,
        "image_url": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
    },
    {
        "title": "Gladiator",
        "description": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
        "duration": 155,
        "release_date": "2000-05-05",
        "genre": "Action",
        "rating": 8.5,
        "image_url": "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"
    },
    {
        "title": "Jurassic Park",
        "description": "A pragmatic paleontologist visiting an almost complete theme park is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
        "duration": 127,
        "release_date": "1993-06-11",
        "genre": "Adventure",
        "rating": 8.1,
        "image_url": "https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg"
    },
    # Bollywood movies
    {
        "title": "3 Idiots",
        "description": "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
        "duration": 170,
        "release_date": "2009-12-25",
        "genre": "Comedy",
        "rating": 8.4,
        "image_url": "https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg"
    },
    {
        "title": "PK",
        "description": "An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion on its people.",
        "duration": 153,
        "release_date": "2014-12-19",
        "genre": "Comedy",
        "rating": 8.1,
        "image_url": "https://m.media-amazon.com/images/M/MV5BMTYzOTE2NjkxN15BMl5BanBnXkFtZTgwMDgzMTg0MzE@._V1_.jpg"
    },
    {
        "title": "Dangal",
        "description": "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to become India's first world-class female wrestlers.",
        "duration": 161,
        "release_date": "2016-12-23",
        "genre": "Drama",
        "rating": 8.4,
        "image_url": "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NjY5Mg@@._V1_.jpg"
    },
    {
        "title": "Lagaan",
        "description": "The people of a small village in Victorian India stake their future on a game of cricket against their ruthless British rulers.",
        "duration": 224,
        "release_date": "2001-06-15",
        "genre": "Drama",
        "rating": 8.1,
        "image_url": "https://m.media-amazon.com/images/M/MV5BMjRjNTY3MjUyNV5BMl5BanBnXkFtZTgwNjc4NjI2MzE@._V1_.jpg"
    },
    {
        "title": "Andhadhun",
        "description": "A series of mysterious events change the life of a blind pianist, who must now report a crime that he never actually witnessed.",
        "duration": 139,
        "release_date": "2018-10-05",
        "genre": "Thriller",
        "rating": 8.2,
        "image_url": "https://m.media-amazon.com/images/M/MV5BZWZhMjhhZmYtOTIzZi00YTY4LTgzODctODMyMmM5N2YzZjM5XkEyXkFqcGdeQXVyNTE1NjY5Mg@@._V1_.jpg"
    }
]

# Add admin user
db.add(admin_user)

# Add theaters
for theater in theaters:
    db.add(theater)

# Add movies
for movie_data in movies:
    movie = Movie(**movie_data)
    db.add(movie)

# Commit changes
db.commit()

print("Database initialized successfully!") 