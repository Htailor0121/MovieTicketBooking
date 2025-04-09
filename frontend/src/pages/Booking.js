import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import axios from 'axios';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movieId, screeningId } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/movies/${movieId}`);
        setMovie(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load movie details');
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/bookings',
        {
          screening_id: screeningId,
          seats: selectedSeats,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        navigate('/profile', {
          state: {
            bookingId: response.data.id,
            success: true,
          },
        });
      }
    } catch (error) {
      setError('Booking failed. Please try again.');
    }
  };

  useEffect(() => {
    setTotalAmount(selectedSeats.length * (movie?.price || 0));
  }, [selectedSeats, movie?.price]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Paper
        sx={{
          p: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
          Book Tickets
        </Typography>

        <Grid container spacing={4}>
          {/* Movie Details */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                {movie.title}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Genre: {movie.genre}
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Duration: {movie.duration} minutes
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                Price per seat: ₹{movie.price}
              </Typography>
              <Typography variant="h6" sx={{ color: '#4CAF50', mt: 2 }}>
                Total Amount: ₹{totalAmount}
              </Typography>
            </Paper>
          </Grid>

          {/* Seat Selection */}
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Select Seats
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {Array.from({ length: 50 }, (_, i) => i + 1).map((seat) => (
                  <Button
                    key={seat}
                    variant={selectedSeats.includes(seat) ? 'contained' : 'outlined'}
                    onClick={() => handleSeatClick(seat)}
                    sx={{
                      minWidth: '40px',
                      height: '40px',
                      borderRadius: '4px',
                      borderColor: selectedSeats.includes(seat) ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)',
                      color: selectedSeats.includes(seat) ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      bgcolor: selectedSeats.includes(seat) ? '#4CAF50' : 'transparent',
                      '&:hover': {
                        borderColor: '#4CAF50',
                        bgcolor: selectedSeats.includes(seat) ? '#45a049' : 'rgba(76, 175, 80, 0.1)',
                      },
                    }}
                  >
                    {seat}
                  </Button>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleBooking}
                  disabled={selectedSeats.length === 0}
                  sx={{
                    bgcolor: '#4CAF50',
                    '&:hover': {
                      bgcolor: '#45a049',
                    },
                    minWidth: '200px',
                    height: '48px',
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Booking; 