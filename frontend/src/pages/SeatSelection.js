import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Predefined booked seats
  const bookedSeats = ['A-7', 'C-1', 'C-3', 'C-4', 'C-6', 'E-7', 'G-1', 'G-6', 'G-7', 'G-8', 'I-15', 'I-16'];

  useEffect(() => {
    // Check if movie details are present
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (location.state && location.state.price) {
      setTotalPrice(selectedSeats.length * location.state.price);
    }
  }, [selectedSeats, location.state]);

  if (!location.state || !location.state.movieId || !location.state.movieTitle || !location.state.price) {
    return null;
  }

  const { movieId, movieTitle, price } = location.state;

  // Convert number to letter (0 = A, 1 = B, etc.)
  const getRowLetter = (row) => String.fromCharCode(65 + row);

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
      setError('');
    } else {
      if (selectedSeats.length >= 6) {
        setError('Maximum 6 seats allowed per booking');
        setTimeout(() => setError(''), 3000);
        return;
      }
      setSelectedSeats(prev => [...prev, seatId]);
      setError('');
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      setTimeout(() => setError(''), 3000);
      return;
    }

    navigate('/payment', {
      state: {
        movieId,
        movieTitle,
        selectedSeats,
        totalPrice,
      }
    });
  };

  const getSeatColor = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'rgb(230, 14, 14)';
    if (selectedSeats.includes(seatId)) return 'rgba(15, 211, 57, 0.9)';
    return 'rgba(255, 255, 255, 0.2)';
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const columns = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
      <Box
        sx={{
          p: 6,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h4" align="center" sx={{ color: 'white', mb: 4, fontSize: '2.5rem' }}>
          Select Your Seats (Max 6)
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff8a80',
              fontSize: '1.8rem',
              '& .MuiAlert-icon': {
                color: '#ff8a80',
                fontSize: '2rem'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Screen */}
        <Box
          sx={{
            width: '100%',
            height: '50px',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(4px)',
            borderRadius: '8px',
            mb: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1.8rem',
            letterSpacing: '2px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          SCREEN
        </Box>

        {/* Seat Numbers */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ width: '50px' }} /> {/* Space for row letters */}
          {Array.from({ length: 12 }, (_, i) => (
            <Typography
              key={i}
              sx={{
                width: '60px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.8rem',
              }}
            >
              {i + 1}
            </Typography>
          ))}
        </Box>

        {/* Seats Grid */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            p: 4,
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {rows.map((row) => (
            <Box key={row} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  width: '50px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'center',
                  fontSize: '1.8rem',
                }}
              >
                {row}
              </Typography>
              {columns.map((col) => {
                const seatId = `${row}-${col}`;
                const isSelected = selectedSeats.includes(seatId);
                const isBooked = bookedSeats.includes(seatId);

                return (
                  <Box
                    key={`${row}${col}`}
                    onClick={() => handleSeatClick(seatId)}
                    sx={{
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isBooked ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: isBooked ? 'none' : 'scale(1.1)',
                      },
                    }}
                  >
                    <WeekendIcon 
                      sx={{ 
                        fontSize: '3rem',
                        color: getSeatColor(seatId),
                        opacity: isBooked ? 0.5 : 1,
                      }} 
                    />
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* Seat Legend */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          mt: 4,
          mb: 4,
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WeekendIcon sx={{ color: 'rgba(255, 255, 255, 0.2)', fontSize: '2.5rem' }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.8rem' }}>Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WeekendIcon sx={{ color: 'rgba(8, 157, 33, 0.9)', fontSize: '2.5rem' }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.8rem' }}>Selected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WeekendIcon sx={{ color: 'rgba(255, 255, 255, 0.1)', opacity: 0.5, fontSize: '2.5rem' }} />
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.8rem' }}>Booked</Typography>
          </Box>
        </Box>

        {/* Price and Proceed Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 4,
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h5" sx={{ color: 'white', fontSize: '2.2rem' }}>
            Total: ₹{totalPrice}
          </Typography>
          <Button
            variant="contained"
            onClick={handleProceedToPayment}
            disabled={selectedSeats.length === 0}
            sx={{
              bgcolor: 'rgba(25, 118, 210, 0.9)',
              fontSize: '2rem',
              py: 2,
              px: 6,
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 1)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SeatSelection;