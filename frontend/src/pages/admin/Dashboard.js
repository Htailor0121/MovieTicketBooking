import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Movies',
      icon: <MovieIcon sx={{ fontSize: 40 }} />,
      description: 'Manage movies, add new ones, or remove existing ones',
      path: '/admin/movies'
    },
    {
      title: 'Users',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      description: 'View and manage registered users',
      path: '/admin/users'
    },
    {
      title: 'Bookings',
      icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} />,
      description: 'View all bookings and their details',
      path: '/admin/bookings'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', mb: 4 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {card.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography sx={{ mb: 3 }}>
                  {card.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate(card.path)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  Manage {card.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard; 