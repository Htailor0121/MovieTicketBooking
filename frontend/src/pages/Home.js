import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://png.pngtree.com/background/20230618/original/pngtree-blank-movie-ticket-with-popcorn-bucket-filmstrip-clapperboard-and-camera-in-picture-image_3709549.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '60vh',
          p: 3,
        }}
      >
        <Box
          sx={{
            p: 6,
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            Welcome to Movie Booking
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            Book your favorite movies with ease
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => navigate('/movies')}
            sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.8)',
              backdropFilter: 'blur(10px)',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.9)',
              },
            }}
          >
            Book Now
          </Button>
        </Box>
      </Box>

      {/* Contact Section */}
      <Box
        sx={{
          py: 6,
          background: 'rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 3,
                    fontWeight: 'bold',
                  }}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 2,
                  }}
                >
                  Movie Booking is your one-stop destination for booking movie tickets online. We provide a seamless experience for movie enthusiasts to book their favorite movies with just a few clicks.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  height: '100%',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 3,
                    fontWeight: 'bold',
                  }}
                >
                  Contact Info
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ color: 'white', mr: 1 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    123 Movie Street, Cinema City, 12345
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ color: 'white', mr: 1 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ color: 'white', mr: 1 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    support@moviebooking.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.01)',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    mb: 3,
                    fontWeight: 'bold',
                  }}
                >
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    <InstagramIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.03)' }} />
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
            }}
          >
            © 2024 Movie Booking. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 