import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Admin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState(null);

  const sections = [
    {
      title: 'Movies',
      description: 'Manage movies, add new ones, and update existing ones',
      icon: <MovieIcon sx={{ fontSize: 60 }} />,
      path: '/admin/movies',
    },
    {
      title: 'Users',
      description: 'View and manage user accounts',
      icon: <PeopleIcon sx={{ fontSize: 60 }} />,
      path: '/admin/users',
    },
    {
      title: 'Bookings',
      description: 'View and manage all bookings',
      icon: <ConfirmationNumberIcon sx={{ fontSize: 60 }} />,
      path: '/admin/bookings',
    },
  ];

  const handleSectionClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <BackButton />
      <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
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
            Admin Dashboard
          </Typography>

          <Grid container spacing={3}>
            {sections.map((section) => (
              <Grid item xs={12} md={4} key={section.title}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                  onClick={() => handleSectionClick(section.path)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: 'white', mb: 2 }}>
                      {section.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ color: 'white' }}>
                      {section.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {section.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Admin; 