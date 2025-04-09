import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../../context/MovieContext';
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
  IconButton,
  Box,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const Movies = () => {
  const navigate = useNavigate();
  const { movies, deleteMovie, updateMovie, addMovie } = useMovies();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    description: '',
    duration: '',
    image: '',
    price: ''
  });

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
  }, [navigate]);

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre,
      description: movie.description || '',
      duration: movie.duration || '',
      image: movie.image || movie.poster_url,
      price: movie.price
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMovie(null);
    setFormData({
      title: '',
      genre: '',
      description: '',
      duration: '',
      image: '',
      price: ''
    });
  };

  const handleUpdateMovie = () => {
    try {
      // Validate form data
      if (!formData.title || !formData.genre || !formData.image || !formData.price) {
        setError('Please fill in all required fields');
        return;
      }

      // Format the movie data
      const movieData = {
        title: formData.title.trim(),
        genre: formData.genre.trim(),
        description: formData.description.trim(),
        duration: formData.duration ? Number(formData.duration) : 120,
        price: Number(formData.price),
        image: formData.image.trim(),
        poster_url: formData.image.trim() // Ensure image is set for both fields
      };

      if (selectedMovie) {
        // Update existing movie
        updateMovie(selectedMovie.title, movieData);
        setSuccess('Movie updated successfully');
      } else {
        // Add new movie
        addMovie(movieData);
        setSuccess('Movie added successfully');
      }
      handleCloseDialog();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to save movie');
      console.error('Error saving movie:', err);
    }
  };

  const handleDeleteMovie = (movieTitle) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        deleteMovie(movieTitle);
        setSuccess('Movie deleted successfully');
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('Failed to delete movie');
      }
    }
  };

  const handleAddMovie = () => {
    setSelectedMovie(null);
    setFormData({
      title: '',
      genre: '',
      description: '',
      duration: '',
      image: '',
      price: ''
    });
    setOpenDialog(true);
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
        <Typography sx={{ color: 'white' }}>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontSize: '3rem', fontWeight: 'bold' }}>
          Movie Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon sx={{ fontSize: '2.4rem' }} />}
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
          <Button
            onClick={() => setOpenDialog(true)}
            startIcon={<AddIcon sx={{ fontSize: '2.5rem' }} />}
            variant="contained"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              fontSize: '2.1rem',
              padding: '12px 32px',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            Add Movie
          </Button>
        </Box>
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>Genre</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>Duration</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>Price</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <TableRow key={movie.title}>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '2.1rem' }}>{movie.title}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '2.1rem' }}>{movie.genre}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '2.1rem' }}>{movie.duration} min</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '2.1rem' }}>₹{movie.price}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleEditMovie(movie)}
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                          padding: '12px'
                        }}
                      >
                        <EditIcon sx={{ fontSize: '2.5rem' }} />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteMovie(movie.title)}
                        sx={{ 
                          color: '#f44336',
                          '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
                          padding: '12px'
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: '2.5rem' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '2.1rem' }}>
                  No movies available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontSize: '1.8rem', fontWeight: 'bold' }}>
          {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              InputProps={{
                sx: { color: 'white', fontSize: '1.1rem' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }
              }}
            />
            <TextField
              fullWidth
              label="Genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              required
              InputProps={{
                sx: { color: 'white', fontSize: '1.1rem' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }
              }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={4}
              InputProps={{
                sx: { color: 'white', fontSize: '1.1rem' }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }
              }}
            />
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              InputProps={{
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }
              }}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value, poster_url: e.target.value })}
              required
              InputProps={{
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }
              }}
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              InputProps={{
                sx: {
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }
              }}
              InputLabelProps={{
                sx: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.1rem',
              padding: '8px 24px',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleUpdateMovie}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.title || !formData.genre || !formData.image || !formData.price}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1.1rem',
              padding: '8px 24px',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            {selectedMovie ? 'UPDATE' : 'ADD'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Movies; 