import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  IconButton
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        minHeight: '100vh',
        py: 12, // Add padding top and bottom
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto' // Make container scrollable
      }}
    >
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          mb: 6, 
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '3.75rem'
        }}
      >
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={5}>
          <Box 
            sx={{ 
              p: 4,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography variant="h5" sx={{ mb: 4, color: 'white', fontSize: '2.75rem' }}>
              Get in Touch
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', color: 'white' }}>
              <LocationOnIcon sx={{ mr: 2, fontSize: '2.5rem' }} />
              <Typography sx={{ fontSize: '2.1rem' }}>
                123 Movie Street, Cinema City, 12345
              </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', color: 'white' }}>
              <PhoneIcon sx={{ mr: 2, fontSize: '2.5rem' }} />
              <Typography sx={{ fontSize: '2.1rem' }}>
                +1 (555) 123-4567
              </Typography>
            </Box>

            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', color: 'white' }}>
              <EmailIcon sx={{ mr: 2, fontSize: '2.5rem', flexShrink: 0 }} />
              <Typography 
                sx={{ 
                  fontSize: '2.1rem',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
              >
                admin@movie.com
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontSize: '2.5rem' }}>
              Follow Us
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton sx={{ color: 'white' }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <TwitterIcon />
              </IconButton>
              <IconButton sx={{ color: 'white' }}>
                <InstagramIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Box 
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Name"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontSize: '2.1rem',
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
                      fontSize: '2.1rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontSize: '2.1rem',
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
                      fontSize: '2.1rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="subject"
                  label="Subject"
                  required
                  fullWidth
                  value={formData.subject}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontSize: '2.1rem',
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
                      fontSize: '2.1rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="message"
                  label="Message"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontSize: '2.1rem',
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
                      fontSize: '2.1rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.5,
                    bgcolor: 'primary.main',
                    fontSize: '2.2rem',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  SEND MESSAGE
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact; 