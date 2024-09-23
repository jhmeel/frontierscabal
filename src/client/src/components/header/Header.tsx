import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Book as BookIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Bookmark as BookmarkIcon,
  Add as AddIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { NotificationManager } from '../../lib/notificationManager/NotificationManager';
import { genUniqueShortname } from '../../utils';
import logo from '../../assets/logos/fcabal.png'
const GlassmorphicAppBar = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const Logo = styled('img')({
  width: 80,
  marginRight: 5,
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const LeftSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const RightSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, link: '/' },
  { text: 'Study Materials', icon: <BookIcon />, link: '/study-materials' },
  { text: 'Events', icon: <EventIcon />, link: '/events' },
  { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  { text: 'Bookmarks', icon: <BookmarkIcon />, link: '/bookmarks' },
  { text: 'Write', icon: <AddIcon />, link: '/blog/article/new' },
  { text: 'Help', icon: <HelpIcon />, link: '/help' },
];

const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const notificationService = NotificationManager.getInstance();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  React.useEffect(() => {
    const count = notificationService.getUnreadNotificationsCount();
    setNotificationCount(count);
  }, [notificationService]);

  const handleDrawerToggle = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSearchClick = useCallback(() => {
    navigate('/search');
  }, [navigate]);

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ ml: 2 }}>
          Menu
        </Typography>
      </DrawerHeader>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <GlassmorphicAppBar position="sticky">
        <StyledToolbar>
          <LeftSection>
            <Logo src={logo} alt="FrontiersCabal Logo" onClick={()=>navigate('/')}/>
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              FrontiersCabal
            </Typography>
          </LeftSection>
          <RightSection>
            <IconButton color="inherit" onClick={handleSearchClick}>
              <SearchIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component={Link}
              to="/notifications"
            >
              <Badge badgeContent={notificationCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Tooltip title={user?.username || 'User menu'}>
              <IconButton
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar 
                  alt={user?.username} 
                  src={user?.avatar?.url}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    background: user?.avatar?.url ? 'transparent' : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  }}
                >
                  {!user?.avatar?.url && genUniqueShortname(user?.email || '')}
                </Avatar>
              </IconButton>
            </Tooltip>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </RightSection>
        </StyledToolbar>
      </GlassmorphicAppBar>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to={`/profile/${user?.username}`}>Profile</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/settings">Settings</MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/logout">Logout</MenuItem>
      </Menu>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;