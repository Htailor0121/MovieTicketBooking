from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from config import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    bookings = relationship("Booking", back_populates="user")

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(String(1000))
    duration = Column(Integer)  # in minutes
    release_date = Column(DateTime)
    genre = Column(String(100))
    rating = Column(Float)
    image_url = Column(String(255))
    screenings = relationship("Screening", back_populates="movie")

class Theater(Base):
    __tablename__ = "theaters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    total_seats = Column(Integer)
    screenings = relationship("Screening", back_populates="theater")

class Screening(Base):
    __tablename__ = "screenings"

    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"))
    theater_id = Column(Integer, ForeignKey("theaters.id"))
    screening_time = Column(DateTime)
    price = Column(Float)
    available_seats = Column(Integer)
    movie = relationship("Movie", back_populates="screenings")
    theater = relationship("Theater", back_populates="screenings")
    bookings = relationship("Booking", back_populates="screening")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    screening_id = Column(Integer, ForeignKey("screenings.id"))
    num_seats = Column(Integer)
    total_amount = Column(Float)
    booking_time = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50))  # confirmed, cancelled, pending
    user = relationship("User", back_populates="bookings")
    screening = relationship("Screening", back_populates="bookings") 