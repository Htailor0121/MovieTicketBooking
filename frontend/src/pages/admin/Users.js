import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import axios from 'axios';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_admin: false
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

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Fetching users...');
      const response = await axios.get('http://localhost:8000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Users data received:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.error('Received non-array data:', response.data);
        setError('Invalid data format received from server');
        setUsers([]);
      } else {
        setUsers(response.data);
        setError('');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error details:', {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
        error: err
      });

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view users.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Failed to fetch users. Please try again.');
      }
      setUsers([]);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`http://localhost:8000/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccess('User deleted successfully');
        fetchUsers();
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        console.error('Error deleting user:', err);
        if (err.response?.status === 401) {
          setError('You are not authorized. Please log in again.');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else if (err.response?.status === 403) {
          setError('You do not have permission to delete users.');
        } else {
          setError('Failed to delete user. Please try again.');
        }
      }
    }
  };

  const handleEditUser = (user) => {
    if (user.username === 'admin') {
      setError('Cannot edit admin user');
      return;
    }
    console.log('Editing user:', user);
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '', // Empty for security
      is_admin: Boolean(user.is_admin)
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      is_admin: false
    });
  };

  const handleUpdateUser = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please login again.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }

      if (!selectedUser || !selectedUser.id) {
        setError('No user selected for update');
        return;
      }

      // Create update data object
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        is_admin: Boolean(formData.is_admin)
      };

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password;
      }

      console.log('Selected user ID:', selectedUser.id);
      console.log('Updating user with data:', { 
        ...updateData, 
        password: updateData.password ? '[REDACTED]' : undefined 
      });

      const response = await axios.put(
        `http://localhost:8000/users/${selectedUser.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);

      if (response.data) {
        setSuccess('User updated successfully');
        handleCloseDialog();
        await fetchUsers(); // Refresh the list
        
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating user:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        selectedUserId: selectedUser?.id,
        formData: { ...formData, password: formData.password ? '[REDACTED]' : undefined }
      });

      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 1500);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to update users.');
        setTimeout(() => navigate('/'), 1500);
      } else if (err.response?.status === 404) {
        setError('User not found. Please refresh the page and try again.');
        handleCloseDialog();
        await fetchUsers();
      } else if (err.response?.status === 400) {
        const errorMessage = err.response.data.detail || 'Invalid input. Please check your data.';
        setError(`Update failed: ${errorMessage}`);
      } else {
        const errorMessage = err.response?.data?.detail || err.message || 'Failed to update user';
        setError(`Update failed: ${errorMessage}. Please try again.`);
      }
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  const handleAddUser = () => {
    navigate('/admin/users/add');
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
      <Button
        onClick={handleBack}
        startIcon={<ArrowBackIcon sx={{ fontSize: '2.4rem' }} />}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'white',
          fontSize: '1.8rem',
          padding: '12px 24px',
          zIndex: 1,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        Back
      </Button>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
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
            mb: 2,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#4caf50',
          }}
        >
          {success}
        </Alert>
      )}

      <Box sx={{ 
        mb: 4,
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              color: 'white',
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            ADD USER
          </Button>
        </Box>
      </Box>

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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user.id}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user.username}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: user.is_admin ? 'rgba(25, 118, 210, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {user.is_admin ? 'Admin' : 'User'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {user.username !== 'admin' && (
                        <IconButton
                          onClick={() => handleEditUser(user)}
                          sx={{ 
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDeleteUser(user.id)}
                        sx={{ 
                          color: '#f44336',
                          '&:hover': {
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                          }
                        }}
                        disabled={user.username === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
                  No users available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
            <TextField
              fullWidth
              label="New Password (optional)"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                sx: { color: 'rgba(255, 255, 255, 0.7)' }
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Role</InputLabel>
              <Select
                value={formData.is_admin}
                onChange={(e) => setFormData({ ...formData, is_admin: e.target.value })}
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              >
                <MenuItem value={false}>User</MenuItem>
                <MenuItem value={true}>Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            CANCEL
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            UPDATE
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users; 