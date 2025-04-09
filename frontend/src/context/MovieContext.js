import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState(() => {
    // Initialize from localStorage if available
    const savedMovies = localStorage.getItem('movies');
    return savedMovies ? JSON.parse(savedMovies) : [];
  });

  // Save to localStorage whenever movies change
  useEffect(() => {
    localStorage.setItem('movies', JSON.stringify(movies));
  }, [movies]);

  const addMovie = (movie) => {
    const newMovie = {
      id: Date.now(), // Ensure unique ID
      title: movie.title,
      genre: movie.genre,
      description: movie.description || '',
      duration: movie.duration || 120,
      price: Number(movie.price),
      poster_url: movie.image || movie.poster_url,
      image: movie.image || movie.poster_url
    };

    setMovies(prevMovies => [...prevMovies, newMovie]);
  };

  const deleteMovie = (movieTitle) => {
    setMovies(prevMovies => prevMovies.filter(movie => movie.title !== movieTitle));
  };

  const updateMovie = (movieTitle, updatedMovie) => {
    setMovies(prevMovies => prevMovies.map(movie => 
      movie.title === movieTitle 
        ? {
            ...movie,
            ...updatedMovie,
            price: Number(updatedMovie.price),
            poster_url: updatedMovie.image || updatedMovie.poster_url,
            image: updatedMovie.image || updatedMovie.poster_url
          }
        : movie
    ));
  };

  return (
    <MovieContext.Provider value={{
      movies,
      addMovie,
      deleteMovie,
      updateMovie
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
}; 