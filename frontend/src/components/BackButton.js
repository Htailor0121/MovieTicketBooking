import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ to = '/admin' }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Go Back">
      <IconButton
        onClick={() => navigate(to)}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackButton; 