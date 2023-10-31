import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar as MuiAvatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';

import { useAppSelector } from '../../hooks';

const userMenuOptions = [
  {
    name: 'Logout',
    url: '/logout'
  }
];

const stringToHslColor = (str: string, saturation: number, lightness: number): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const stringAvatar = (name: string): object => {
  return {
    sx: {
      bgcolor: stringToHslColor(name, 30, 60)
    },
    children: name[0].toUpperCase(),
    alt: name
  };
};

const Avatar = (): React.JSX.Element => {
  const navigate = useNavigate();
  const user = useAppSelector(store => store.user);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    if (user.id === 0) {
      navigate('/login');
    }
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        {user.id !== 0 ? <MuiAvatar {...stringAvatar(user.username)} /> : <MuiAvatar />}
      </IconButton>
      {Boolean(user.id) && (
        <Menu
          sx={{
            mt: '45px'
          }}
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem>
            <Typography textAlign="center">{user.username}</Typography>
          </MenuItem>
          <Divider />
          {userMenuOptions.map(option => (
            <MenuItem key={option.url} onClick={() => { navigate(option.url); }}>
              <Typography textAlign="center">{option.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default Avatar;
