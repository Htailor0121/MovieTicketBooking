import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { useMovies } from '../context/MovieContext';

const Movie = () => {
  const navigate = useNavigate();
  const { movies } = useMovies();

  // Add debug logging
  console.log('Movies in user view:', movies);

  const handleBookNow = (movie) => {
    console.log('Booking movie:', movie);
    // Navigate to seat selection with movie details
    navigate('/seat-selection', {
      state: {
        movieId: movie.id,
        movieTitle: movie.title,
        price: movie.price,
        description: movie.description,
        duration: movie.duration,
        genre: movie.genre,
        poster_url: movie.poster_url
      },
    });
  };

  // Add debug message if no movies
  if (!movies || movies.length === 0) {
    console.log('No movies available');
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 4 }}>
          Now Showing
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          No movies available at the moment.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 4, fontSize: '2.5rem', fontWeight: 'bold' }}>
        Now Showing
      </Typography>

      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'transform 0.2s',
              minWidth: { sm: '400px', md: '500px' },
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}>
              <CardMedia
                component="img"
                height="400"
                image={movie.poster_url}
                alt={movie.title}
                sx={{
                  objectFit: 'cover',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  width: '100%'
                }}
              />
              <CardContent sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                p: 4,
                gap: 2
              }}>
                <Typography variant="h6" sx={{ color: 'white', fontSize: '2.5rem', fontWeight: 'bold' }}>
                  {movie.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '2.1rem' }}>
                  {movie.genre}
                </Typography>
                <Typography 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '2rem',
                    lineHeight: '1.5',
                    flex: 1
                  }}
                >
                  {movie.description || 'No description available'}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '2rem' }}>
                  Duration: {movie.duration} minutes
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 'auto',
                  pt: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'primary.main', fontSize: '2.5rem', fontWeight: 'bold' }}>
                    ₹{movie.price}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleBookNow(movie)}
                    sx={{
                      bgcolor: 'rgba(25, 118, 210, 0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 1)',
                      },
                      fontSize: '2.1rem',
                      padding: '12px 32px'
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Movie; 