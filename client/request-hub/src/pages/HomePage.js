import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth(); // user情報を取得
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" sx={{ mt: 2 }}>
            ようこそ　{user?.lastName}  {user?.firstName}さん
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleLogout}
        >
          ログアウト
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
