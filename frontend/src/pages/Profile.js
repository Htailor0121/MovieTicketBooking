import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
} from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userData);
    setUser(user);

    // Get user-specific bookings
    const userBookings = JSON.parse(localStorage.getItem(`bookings_${user.email}`) || '[]');
    setBookings(userBookings);
  }, [navigate]);

  // Function to get user's first letter for Avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Typography sx={{ color: 'white' }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Box sx={{ 
        p: 3, 
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            bgcolor: 'primary.main',
            fontSize: '2rem'
          }}
        >
          {getInitial(user.username)}
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
            {user.username}
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Booking History
      </Typography>

      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <Paper 
            key={index}
            sx={{
              p: 3,
              mb: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
              {booking.movieTitle}
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              <Typography>
                Booking ID: {booking.bookingId}
              </Typography>
              <Typography>
                Seats: {booking.selectedSeats.join(', ')}
              </Typography>
              <Typography>
                Amount: ₹{booking.totalAmount || booking.totalPrice || 0}
              </Typography>
              <Typography>
                Booked on: {formatDate(booking.bookingDate)}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Paper 
          sx={{ 
            p: 3,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            No booking history available.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Profile; 