import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      
      // Clear any previous tokens/user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Login attempt using OAuth2 password flow
      const loginResponse = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username: formData.username,
        password: formData.password,
        grant_type: 'password'
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      if (loginResponse.data.access_token) {
        // Store the token
        const token = loginResponse.data.access_token;
        localStorage.setItem('token', token);
        
        try {
          // Get user details
          const userResponse = await axios.get('http://localhost:8000/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const userData = userResponse.data;
          
          // Check if user is admin
          if (!userData.is_admin) {
            setError('Access denied. Admin privileges required.');
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }
          
          // Store user info
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Clear form and error
          setFormData({ username: '', password: '' });
          setError('');
          setLoading(false);
          
          // Navigate to admin dashboard
          navigate('/admin');
        } catch (userError) {
          console.error('Error fetching user details:', userError);
          setError('Failed to get user details. Please try again.');
          localStorage.removeItem('token');
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid admin credentials');
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
            Admin Login
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                backdropFilter: 'blur(10px)',
                color: '#f44336',
                '& .MuiAlert-icon': {
                  color: '#f44336'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Admin Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                backgroundColor: 'rgba(25, 118, 210, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.9)'
                }
              }}
            >
              Sign In as Admin
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin; 