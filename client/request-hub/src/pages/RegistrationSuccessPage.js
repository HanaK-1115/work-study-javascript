import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccessPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
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
        <Typography component="h1" variant="h5">
          登録完了
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          ユーザー登録が成功しました。
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSignIn}
        >
          ログイン
        </Button>
      </Box>
    </Container>
  );
};

export default RegistrationSuccessPage;
