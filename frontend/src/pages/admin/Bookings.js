import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if user is logged in and is admin
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');
    
    if (!token || !user) {
      navigate('/login');
      return;
    }

    if (!user.is_admin) {
      navigate('/');
      return;
    }

    // Get all bookings from localStorage
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(allBookings);
  }, [navigate]);

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const updatedBookings = bookings.filter(booking => booking.bookingId !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        setBookings(updatedBookings);
        setSuccess('Booking deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Error deleting booking:', error);
        setError('Failed to delete booking');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8, position: 'relative' }}>
      <Box sx={{ 
        mb: 4,
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Typography variant="h4" sx={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
          Booking Management
        </Typography>
        <Button
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: 'white',
            fontSize: '1.8rem',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Back
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.1)',
            color: '#f44336',
            fontSize: '2rem'
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#4caf50',
            fontSize: '2rem'
          }}
        >
          {success}
        </Alert>
      )}

      <TableContainer 
        component={Paper}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>Booking ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>User</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>Movie</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>Seats</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>Total Amount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.8rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.bookingId}>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.6rem' }}>
                    {booking.bookingId}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      <Typography sx={{ fontSize: '1.6rem' }}>{booking.username}</Typography>
                      <Typography sx={{ fontSize: '1.4rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        {booking.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.6rem' }}>
                    {booking.movieTitle}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.6rem' }}>
                    {booking.selectedSeats.join(', ')}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.6rem' }}>
                    ₹{booking.totalPrice}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4caf50',
                        py: 1,
                        px: 2,
                        borderRadius: 1,
                        display: 'inline-block',
                        fontSize: '1.4rem',
                        fontWeight: 'bold'
                      }}
                    >
                      Confirmed
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleDeleteBooking(booking.bookingId)}
                      sx={{ 
                        color: '#f44336',
                        '&:hover': {
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                        },
                        padding: '12px'
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '2.4rem' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={7} 
                  sx={{ 
                    textAlign: 'center', 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '1.8rem',
                    py: 4
                  }}
                >
                  No bookings available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Bookings; 