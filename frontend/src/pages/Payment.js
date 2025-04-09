import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  Paper,
} from '@mui/material';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state || !location.state.movieTitle || !location.state.selectedSeats || !location.state.totalPrice) {
      navigate('/movies');
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setError('');
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
        setError('Please fill in all card details');
        return false;
      }
      if (formData.cardNumber.length !== 16) {
        setError('Invalid card number');
        return false;
      }
      if (formData.cvv.length !== 3) {
        setError('Invalid CVV');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId) {
        setError('Please enter UPI ID');
        return false;
      }
      if (!formData.upiId.includes('@')) {
        setError('Invalid UPI ID');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate payment processing
    setTimeout(() => {
      navigate('/booking-confirmation', {
        state: {
          ...location.state,
          paymentMethod,
        }
      });
    }, 1500);
  };

  if (!location.state) return null;

  const { movieTitle, selectedSeats, totalPrice } = location.state;

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      <Box
        sx={{
          p: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, color: 'white', textAlign: 'center' }}>
          Payment Details
        </Typography>

        {/* Booking Summary */}
        <Box sx={{ mb: 4, p: 2, background: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Booking Summary</Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Movie: {movieTitle}</Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Seats: {selectedSeats.join(', ')}
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mt: 1 }}>
            Total Amount: ₹{totalPrice}
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff8a80',
              '& .MuiAlert-icon': {
                color: '#ff8a80'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <FormLabel sx={{ color: 'white', mb: 1 }}>Payment Method</FormLabel>
          <RadioGroup
            row
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <FormControlLabel 
              value="card" 
              control={<Radio sx={{ color: 'white' }} />} 
              label="Card Payment" 
              sx={{ color: 'white' }}
            />
            <FormControlLabel 
              value="upi" 
              control={<Radio sx={{ color: 'white' }} />} 
              label="UPI Payment" 
              sx={{ color: 'white' }}
            />
          </RadioGroup>
        </FormControl>

        <Box component="form" onSubmit={handleSubmit}>
          {paymentMethod === 'card' ? (
            <>
              <TextField
                fullWidth
                label="Card Number"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: 'white' }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <TextField
                fullWidth
                label="Card Holder Name"
                name="cardHolder"
                value={formData.cardHolder}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: 'white' }
                }}
                InputLabelProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label="Expiry Date"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  sx={{ flex: 1 }}
                  InputProps={{
                    sx: { color: 'white' }
                  }}
                  InputLabelProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
                <TextField
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  sx={{ flex: 1 }}
                  InputProps={{
                    sx: { color: 'white' }
                  }}
                  InputLabelProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                />
              </Box>
            </>
          ) : (
            <TextField
              fullWidth
              label="UPI ID"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { color: 'white' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: 'rgba(76, 175, 80, 0.9)',
              '&:hover': {
                bgcolor: 'rgba(76, 175, 80, 1)',
              },
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Pay ₹{totalPrice}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Payment;
