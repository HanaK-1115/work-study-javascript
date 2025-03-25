import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MainListItems, SecondaryListItems, ThirdListItems } from './ListItems';
import { useAuth } from '../hooks/useAuth';

function AppDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={toggleDrawer}
      >
        <List>{<MainListItems />}</List>
        {isAuthenticated && (
          <>
            <List>{<SecondaryListItems />}</List>
            <List>{<ThirdListItems />}</List>
          </>
        )}
      </Drawer>
    </>
  );
}

export default AppDrawer;
