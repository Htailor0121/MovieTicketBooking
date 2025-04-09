import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmBooking = () => {
    try {
      setIsProcessing(true);
      const user = JSON.parse(sessionStorage.getItem('user'));
      const newBookingId = `BK${Date.now()}`;
      setBookingId(newBookingId);
      
      const bookingData = {
        bookingId: newBookingId,
        username: user.name,
        userEmail: user.email,
        movieTitle: location.state.movieTitle,
        selectedSeats: location.state.selectedSeats,
        totalPrice: location.state.totalPrice,
        bookingDate: new Date().toISOString(),
        status: 'Confirmed'
      };

      // Store in user's bookings
      const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.email}`) || '[]');
      userBookings.push(bookingData);
      localStorage.setItem(`bookings_${user.email}`, JSON.stringify(userBookings));

      // Store in all bookings for admin
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      allBookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(allBookings));

      setIsConfirmed(true);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error confirming booking:', error);
      setError('Failed to confirm booking. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4, mt: 8 }}>
      <Box sx={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        p: 4,
      }}>
        {isConfirmed ? (
          <>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Booking Confirmed!
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Thank you for booking with us
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Confirm Your Booking
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
              Please review your booking details
            </Typography>
          </>
        )}

        <Box sx={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          p: 3,
          mb: 3,
        }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            {bookingDetails.movieTitle}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Selected Seats: {bookingDetails.selectedSeats.join(', ')}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Total Amount: ₹{bookingDetails.totalPrice}
          </Typography>
          {isConfirmed && (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Booking ID: {bookingId}
            </Typography>
          )}
        </Box>

        {error && (
          <Typography sx={{ color: '#f44336', mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          {!isConfirmed ? (
            <>
              <Button
                variant="contained"
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 1)',
                  },
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Confirm Booking'
                )}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={isProcessing}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'white',
                  },
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={() => navigate('/profile')}
                sx={{
                  bgcolor: 'rgba(76, 175, 80, 0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 1)',
                  },
                }}
              >
                View My Bookings
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: 'white',
                  },
                }}
              >
                Book Another Movie
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default BookingConfirmation; 