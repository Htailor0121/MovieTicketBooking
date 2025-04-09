import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography, Box } from '@mui/material';

const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setError(error.message);
    } else {
      setError(null);
      setSuccess(true);
      console.log('Payment successful!', paymentIntent);
      // Send booking confirmation notification
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Box mt={2}>
        <Button type="submit" variant="contained" disabled={!stripe}>
          Pay
        </Button>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">Payment successful!</Typography>}
    </form>
  );
};

const PaymentForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default PaymentForm; 