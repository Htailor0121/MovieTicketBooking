import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 4 }}>
        My Bookings
      </Typography>
      <TableContainer component={Paper} sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Booking ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Movie</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Seats</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{booking.id}</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{booking.movie_title}</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{booking.seats.join(', ')}</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>₹{booking.total_amount}</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Bookings; 