import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from '../hooks';

import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const pages = [
  {
    name: 'Decks',
    url: '/decks'
  },
  {
    name: 'Community',
    url: '/community'
  }
];

const userMenuOptions = [
  {
    name: 'Profile',
    url: '/profile'
  },
  {
    name: 'Account',
    url: '/account'
  },
  {
    name: 'Logout',
    url: '/logout'
  }
];

const stringToHslColor = (str: string, saturation: number, lightness: number) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToHslColor(name, 30, 60),
    },
    children: name[0].toUpperCase(),
    alt: name
  }
}

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useAppSelector(store => store.user);
  const [showNavMenu, setShowNavMenu] = useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const toggleNavMenu = (value: boolean) => () => {
    setShowNavMenu(value);
  };

  const handleNavMenuNavigate = (url: string) => () => {
    setShowNavMenu(false);
    setTimeout(() => navigate(url), theme.transitions.duration.leavingScreen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container disableGutters maxWidth={false}>
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={toggleNavMenu(true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={showNavMenu}
              onClose={toggleNavMenu(false)}
            >
              <Box
                sx={{
                  width: 250
                }}
                role="presentation"
                onClick={toggleNavMenu(false)}
                onKeyDown={toggleNavMenu(false)}
              >
                <List>
                  {pages.map(page => (
                    <ListItem key={page.url} disablePadding>
                      <ListItemButton onClick={handleNavMenuNavigate(page.url)}>
                        <ListItemText primary={page.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </Box>

          <Box sx={{display: 'flex'}}>
            <Button
              onClick={() => navigate('/')}
              sx={{ color: 'white' }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              >
                CardMaster
              </Typography>
            </Button>

            <Box sx={{
              display: { xs: 'none', md: 'flex' }
            }}>
              {pages.map(page => (
                <Button
                  key={page.url}
                  onClick={() => {navigate(page.url)}}
                  sx={{ color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {user.id && <Avatar {...stringAvatar(user.username)} /> || <Avatar />}
            </IconButton>
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
              {userMenuOptions.map(option => (
                <MenuItem key={option.url} onClick={() => navigate(option.url)}>
                  <Typography textAlign="center">{option.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
};

export default Navbar;
