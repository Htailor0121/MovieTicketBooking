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
  Grid,
} from '@mui/material';
import axios from 'axios';
import BackButton from '../../components/BackButton';

const AddMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    release_date: '',
    poster_url: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.duration || !formData.genre || !formData.release_date || !formData.price) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add movies');
        setLoading(false);
        return;
      }

      const movieData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
      };

      console.log('Sending movie data:', movieData);

      const response = await axios.post('http://localhost:8000/movies', movieData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);

      setSuccess('Movie added successfully!');
      setTimeout(() => {
        navigate('/admin/movies');
      }, 1500);
    } catch (err) {
      console.error('Error adding movie:', err);
      if (err.response?.status === 404) {
        setError('API endpoint not found. Please check if the server is running.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to add movie');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 8, position: 'relative' }}>
      <BackButton to="/admin/movies" />
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 4 }}>
          Add New Movie
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Date"
                name="release_date"
                type="date"
                value={formData.release_date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: '₹',
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Poster URL"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/movies')}
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: '#4CAF50',
                    '&:hover': {
                      bgcolor: '#45a049',
                    },
                  }}
                >
                  {loading ? 'Adding...' : 'Add Movie'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddMovie; 