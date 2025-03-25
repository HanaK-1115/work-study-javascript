import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AppDrawer from './AppDrawer';
import { useAuth } from '../hooks/useAuth'; // 正しいパスを指定してインポート
import { Link } from 'react-router-dom';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // user情報を取得

  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="static">
        <Toolbar>
          <AppDrawer />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TDS Hub
          </Typography>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={logout} component={Link} to="/login">
                ログアウト
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                ログイン
              </Button>
              <Button color="inherit" component={Link} to="/register">
                登録
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
