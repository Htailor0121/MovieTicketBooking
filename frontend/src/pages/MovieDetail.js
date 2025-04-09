import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  Chip,
  CardMedia,
} from '@mui/material';
import { WeekendOutlined as SeatIcon } from '@mui/icons-material';
import axios from 'axios';
import WeekendIcon from '@mui/icons-material/Weekend';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TheatersIcon from '@mui/icons-material/Theaters';
import StarIcon from '@mui/icons-material/Star';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieResponse, screeningsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/movies/${id}`),
          axios.get(`http://localhost:8000/movies/${id}/screenings`),
        ]);

        setMovie(movieResponse.data);
        setScreenings(screeningsResponse.data);

        // Get unique dates from screenings
        const uniqueDates = [...new Set(screeningsResponse.data.map(screening => 
          new Date(screening.screening_time).toLocaleDateString()
        ))].sort();
        setDates(uniqueDates);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleDateChange = (event, newValue) => {
    setSelectedDate(newValue);
    setSelectedScreening(null);
    setSelectedSeats([]);
  };

  const handleScreeningSelect = (screening) => {
    setSelectedScreening(screening);
    setSelectedSeats([]);
    navigate(`/seat-selection`, {
      state: {
        movieId: movie.id,
        screeningId: screening.id,
        movieTitle: movie.title,
        showTime: screening.screening_time,
        showDate: new Date(screening.screening_time).toLocaleDateString(),
        price: movie.price
      }
    });
  };

  const handleSeatToggle = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 10) { // Maximum 10 seats per booking
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const handleBooking = () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    
    navigate('/payment', {
      state: {
        movieId: movie.id,
        movieTitle: movie.title,
        showTime: selectedShow.screening_time,
        showId: selectedShow.id,
        selectedSeats,
        seatCount: selectedSeats.length,
        totalAmount: selectedSeats.length * selectedShow.price,
        theaterName: selectedShow.theater.name,
        seatType: selectedShow.seat_type || 'Standard'
      }
    });
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 10) { // Maximum 10 seats per booking
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  const handleContinue = () => {
    navigate('/seat-selection', {
      state: {
        movie,
        selectedShow
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Typography variant="h5" color="error">Movie not found</Typography>
      </Container>
    );
  }

  const filteredScreenings = screenings.filter(
    screening => new Date(screening.screening_time).toLocaleDateString() === dates[selectedDate]
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
      <Grid container spacing={4}>
        {/* Movie Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <CardMedia
              component="img"
              height="500"
              image={movie.image_url || 'https://via.placeholder.com/300x450'}
              alt={movie.title}
            />
          </Card>
        </Grid>

        {/* Movie Info */}
        <Grid item xs={12} md={8}>
          <Box sx={{ color: 'white' }}>
            <Typography variant="h3" gutterBottom>
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip
                icon={<TheatersIcon />}
                label={movie.genre}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Chip
                icon={<AccessTimeIcon />}
                label={`${movie.duration} min`}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                }}
              />
              <Chip
                icon={<StarIcon />}
                label={`${movie.rating}/10`}
                sx={{ 
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </Box>

            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              {movie.description}
            </Typography>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Select Showtime
            </Typography>

            <Grid container spacing={2}>
              {screenings.map((screening) => (
                <Grid item xs={12} sm={6} md={4} key={screening.id}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleScreeningSelect(screening)}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      p: 2,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="h6">
                        {new Date(screening.screening_time).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="body2">
                        {new Date(screening.screening_time).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                        {screening.availableSeats} seats available
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetail; 