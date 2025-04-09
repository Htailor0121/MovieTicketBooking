import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';

// MovieList component for displaying available movies
const MovieList = () => {
  const navigate = useNavigate();
  const { movies } = useMovies();

  const handleBookNow = (movie) => {
    navigate(`/seat-selection/${movie.id}`, {
      state: { movie },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 4 }}>
        Available Movies
      </Typography>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
                  <CardMedia
                    component="img"
                height="400"
                    image={movie.image}
                    alt={movie.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" sx={{ color: 'white' }}>
                  {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  {movie.genre}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    ₹{movie.price}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleBookNow(movie)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)'
                      }
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

export default MovieList; 