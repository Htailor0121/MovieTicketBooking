import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, color: 'white' }}>
          About Movie Booking
        </Typography>

        <Typography variant="h6" color="rgba(255, 255, 255, 0.7)" paragraph align="center" sx={{ mb: 6 }}>
          Your one-stop destination for hassle-free movie ticket booking
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 6 }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Our Story
            </Typography>
            <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Movie Booking was founded with a simple mission: to make movie ticket booking as easy and enjoyable as possible. 
              We understand that going to the movies is about creating memories, and we want to ensure that the booking process 
              never gets in the way of that experience.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Our Mission
            </Typography>
            <Typography paragraph sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We strive to provide a seamless, user-friendly platform that connects movie enthusiasts with their favorite films. 
              Our commitment to innovation and customer satisfaction drives us to continuously improve our services and enhance 
              the movie-going experience.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <MovieIcon sx={{ fontSize: 40, color: '#fff', mb: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Wide Selection</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Access to the latest movies and showtimes
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <LocalMoviesIcon sx={{ fontSize: 40, color: '#fff', mb: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Easy Booking</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Simple and quick ticket reservation process
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <ConfirmationNumberIcon sx={{ fontSize: 40, color: '#fff', mb: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Secure Payments</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Safe and reliable payment options
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <SupportAgentIcon sx={{ fontSize: 40, color: '#fff', mb: 1 }} />
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>24/7 Support</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Round-the-clock customer assistance
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUs; 