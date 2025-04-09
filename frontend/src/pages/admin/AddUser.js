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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import BackButton from '../../components/BackButton';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Create user data object without confirmPassword
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        is_admin: formData.role === 'Admin'  // Convert role to is_admin boolean
      };

      console.log('Attempting to add user with data:', { ...userData, password: '***' });

      // Using the correct registration endpoint from backend
      const response = await axios.post('http://localhost:8000/register', userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.access_token) {
        setError('');
        setSuccess('User added successfully!');
        // Navigate back to users list after a short delay
        setTimeout(() => {
          navigate('/admin/users');
        }, 1500);
      }
    } catch (err) {
      console.error('Full error object:', err);
      
      if (err.response?.status === 405) {
        setError('This operation is not allowed. Please check your permissions.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check server configuration.');
      } else if (err.response?.status === 409) {
        setError('User with this email or username already exists');
      } else if (err.response?.status === 401) {
        setError('You are not authorized. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to add user. Please check console for details.');
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/users');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8, position: 'relative' }}>
      <BackButton to="/admin/users" />
      <Paper 
        component="form" 
        onSubmit={handleSubmit}
        sx={{ 
          p: 4,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
          Add New User
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#f44336',
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              color: '#4caf50',
            }}
          >
            {success}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
            fullWidth
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
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
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
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
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
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            fullWidth
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

          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '.MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              bgcolor: 'rgba(25, 118, 210, 0.8)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.9)',
              },
            }}
          >
            {loading ? 'Adding User...' : 'Add User'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddUser; 