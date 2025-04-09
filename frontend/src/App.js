import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movie from './pages/Movie';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import AboutUs from "./pages/AboutUs";
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Booking from './pages/Booking';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';
import AdminMovies from './pages/admin/Movies';
import AdminUsers from './pages/admin/Users';
import AdminBookings from './pages/admin/Bookings';
import AddMovie from './pages/admin/AddMovie';
import BookingConfirmation from './pages/BookingConfirmation';
import { MovieProvider } from './context/MovieContext';
import Profile from './pages/Profile';
import Users from './pages/admin/Users';
import Contact from './pages/Contact';
import AddUser from './pages/admin/AddUser';
// import EditMovie from './pages/admin/EditMovie';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '4.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '4rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '3.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '3rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '2.75rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '2.25rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '2.1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '2.1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '2rem',
      fontWeight: 400,
    },
    button: {
      fontSize: '2.1rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '1.9rem',
      fontWeight: 400,
    },
    overline: {
      fontSize: '1.9rem',
      fontWeight: 400,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MovieProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movie />} />
            <Route path="/seat-selection" element={<SeatSelection />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/movies" element={<AdminMovies />} />
            <Route path="/admin/add-movie" element={<AddMovie />} />
            
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/add" element={<AddUser />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </MovieProvider>
    </ThemeProvider>
  );
}

export default App;
