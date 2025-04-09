import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status whenever component mounts, updates, or route changes
    const checkAuth = () => {
      const token = sessionStorage.getItem('token');
      const userData = sessionStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && typeof parsedUser === 'object') {
            setIsAuthenticated(true);
            setUser(parsedUser);
          } else {
            throw new Error('Invalid user data format');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, [location.pathname]); // Re-run when route changes

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear session data
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(18, 18, 18, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              color: '#90caf9',
            },
          }}
        >
          Movie Booking
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/movies"
            sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            MOVIES
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/about"
            sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            ABOUT US
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/contact"
            sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            CONTACT
          </Button>
          
          {isAuthenticated && user ? (
            <>
              {user.is_admin && (
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/admin"
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              <IconButton
                onClick={handleMenu}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(18, 18, 18, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <MenuItem 
                  component={RouterLink} 
                  to="/profile"
                  onClick={handleClose}
                  sx={{ color: 'white' }}
                >
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                  sx={{ color: 'white' }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                REGISTER
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                LOGIN
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 