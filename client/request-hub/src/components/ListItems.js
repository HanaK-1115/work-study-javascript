import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrainIcon from '@mui/icons-material/Train';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate } from 'react-router-dom';

export const MainListItems = () => {
  const navigate = useNavigate();

  const handlePaidLeaveClick = () => {
    navigate('/applications-Overview');
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={handlePaidLeaveClick}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="申請一覧" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  const navigate = useNavigate();

  const handlePaidLeaveClick = () => {
    navigate('/paid-leave-request');
  };

  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        勤怠申請
      </ListSubheader>
      <ListItemButton onClick={handlePaidLeaveClick}>
        <ListItemIcon>
          <InsertInvitationIcon />
        </ListItemIcon>
        <ListItemText primary="有給休暇" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <EventRepeatIcon />
        </ListItemIcon>
        <ListItemText primary="振替休暇" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <WorkIcon />
        </ListItemIcon>
        <ListItemText primary="休日出勤" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DarkModeIcon />
        </ListItemIcon>
        <ListItemText primary="残業" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const ThirdListItems = () => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      経費申請(未実装)
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <TrainIcon />
      </ListItemIcon>
      <ListItemText primary="通勤費" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AccountBalanceWalletIcon />
      </ListItemIcon>
      <ListItemText primary="会議費" />
    </ListItemButton>
  </React.Fragment>
);
