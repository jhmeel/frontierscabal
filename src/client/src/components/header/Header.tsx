<<<<<<< HEAD
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
=======

import styled from "styled-components";
import fcabal from "../../assets/logos/fcabal.png";
import SearchBar from "../searchbar/SearchBar";
import { NotificationManager } from "../../lib/notificationManager/NotificationManager";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "react-tooltip/dist/react-tooltip.css";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import getToken from "../../utils/getToken";
import { RoughNotation } from "react-rough-notation";
import emptyAvatar from "../../assets/images/empty_avatar.png";
import {
  IconNotifications,
  IconHamburgerMenu,
  IconHouse,
  Icon010Blog,
  IconHelp,
  IconSquareInstagram,
  IconSquareTwitter,
  Icon402Facebook2,
  Icon458Linkedin,
  IconCalendarEventFill,
  IconMinutemailer,
  IconBookshelf,
  IconBxsBookmarks,
  IconLinkAdd,
  IconAddOutline,
  IconDateAdd,
  IconProfile,
  IconVideoTwentyFour,
} from "../../assets/icons";
import { genRandomColor, genUniqueShortname } from "../../utils";
import Config from "../../config/Config";
import { RootState } from "../../store";

const Header: React.FC = () => {
  const [isOpened, setIsOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [shortname, setShortName] = useState<string | undefined>(undefined);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const { user } = useSelector((state: RootState) => state.user);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationService = NotificationManager.getInstance();

  useEffect(() => {
    const setToken = async () => {
      const t: string = await getToken();
      setAuthToken(t);
    };
    setToken();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpened);
  };
  useEffect(() => {
    if (user && user?.email) {
      setShortName(genUniqueShortname(user.email));
    }
  }, []);

  useEffect(() => {
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    const count = notificationService.getUnreadNotificationsCount();
    setNotificationCount(count);
  }, [notificationService]);

<<<<<<< HEAD
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
=======
  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const referralUrl = `https://${window.location.hostname}/#/signup/${user?.referralCode}`;
  const handleInvite = () => {
    toggleMenu();
    if (navigator.share) {
      navigator
        .share({
          title: "Friend Invite",
          text: "Please click on the link below to signup for frontierscabal",
          url: referralUrl,
        })
        .then(() => {
          toast.success("Invitation shared successfully!");
        })
        .catch(() => {
          toast.error("Error sharing invitation.");
        });
    }
  };

  return (
    <>

        <MainHeader>
          <div className="h-logo-holder">
            <Link to="/">
              <img
                className="h-logo"
                data-tip="FrontiersCabal"
                src={fcabal}
                alt="frontiersCabal"
              />
            </Link>
          </div>
          <div className="lg-search">
            <SearchBar />
          </div>
          <nav className="h-nav">
            <Link to="/notifications">
              <div className="notification" title="Notification">
                <IconNotifications className="notification-icon" />
                {notificationCount > 0 && (
                  <span className="notification-count">
                    {notificationCount >= 10 ? "9+" : notificationCount}
                  </span>
                )}
              </div>
            </Link>
            <div
              ref={menuRef}
              className="hamburger"
              title="Main Menu"
              onClick={toggleMenu}
            >
              <IconHamburgerMenu className="hamburger-icon" />
            </div>
            {isOpened && (
              <div className="h-menu">
                {!user?.username && (
                  <AuthButtonsRenderer>
                    <Link to="/login">
                      <button className="login-btn" title="Login">
                        Login
                      </button>
                    </Link>
                    <Link to="/signup">
                      <span className="signup-txt">
                        New to Frontierscabal?{" "}
                        <u style={{ color: "#fff" }} title="Signup">
                          Signup
                        </u>
                      </span>
                    </Link>
                  </AuthButtonsRenderer>
                )}
                {user?.username && (
                  <UserAvatar>
                    <div className="avatar">
                      <img
                        loading="lazy"
                        src={user?.avatar?.url || emptyAvatar}
                      />
                    </div>
                    <div className="username-holder">
                      <RoughNotation
                        padding={0}
                        color={genRandomColor()}
                        type="underline"
                        show={true}
                      >
                        <h3>{user?.username}</h3>
                      </RoughNotation>
                      <span>{shortname}</span>
                    </div>
                  </UserAvatar>
                )}

                <ul className="h-menu-items">
                  <Link to="/">
                    <li title="Home" onClick={toggleMenu}>
                      <IconHouse className="h-menu-icon" /> &nbsp; &nbsp; Home
                    </li>
                  </Link>
                  {
                    <Link to={`/study-materials`}>
                      <li title="Study Materials" onClick={toggleMenu}>
                        <IconBookshelf className="h-menu-icon" /> &nbsp; &nbsp;
                        Study Materials
                      </li>
                    </Link>
                  }
                  {
                    <Link to={`/modules`}>
                      <li title="Modules" onClick={toggleMenu}>
                        <IconVideoTwentyFour className="h-menu-icon" /> &nbsp;
                        &nbsp; Modules
                      </li>
                    </Link>
                  }
                  <Link to="/blog">
                    {" "}
                    <li title="Blog" onClick={toggleMenu}>
                      <Icon010Blog className="h-menu-icon" /> &nbsp; &nbsp; Blog
                    </li>
                  </Link>
                  <Link to="/events">
                    <li title="Events" onClick={toggleMenu}>
                      <IconCalendarEventFill className="h-menu-icon" /> &nbsp;
                      &nbsp; Events
                    </li>
                  </Link>
                  {user?.username && authToken !== undefined && (
                    <Link to={`/profile/${user?.username}`}>
                      <li title="Profile" onClick={toggleMenu}>
                        <IconProfile className="h-menu-icon" /> &nbsp; &nbsp;
                        Profile
                      </li>
                    </Link>
                  )}
                  {user?.username && authToken !== undefined && (
                    <Link to="/blog/article/new">
                      <li title="Write" onClick={toggleMenu}>
                        <IconAddOutline className="h-menu-icon" /> &nbsp; &nbsp;
                        Write
                      </li>
                    </Link>
                  )}
                  {user?.username && authToken !== undefined && (
                    <Link to="/event/new">
                      <li title="New Event" onClick={toggleMenu}>
                        <IconDateAdd className="h-menu-icon" /> &nbsp; &nbsp;
                        New Event
                      </li>
                    </Link>
                  )}
                  {user?.role &&
                    ["FC:SUPER:ADMIN", "FC:ADMIN"].includes(user?.role) &&
                    authToken !== undefined && (
                      <Link to="/study-material/new">
                        <li title="New study Material" onClick={toggleMenu}>
                          <IconAddOutline className="h-menu-icon" /> &nbsp;
                          &nbsp;Upload Study Material
                        </li>
                      </Link>
                    )}
                  {user?.username && authToken !== undefined && (
                    <Link to="/bookmarks">
                      <li title="Bookmarked" onClick={toggleMenu}>
                        <IconBxsBookmarks className="h-menu-icon" /> &nbsp;
                        &nbsp; Bookmarks
                      </li>
                    </Link>
                  )}
                  {user?.username && authToken !== undefined && (
                    <li title="Invite a friend" onClick={handleInvite}>
                      <IconLinkAdd className="h-menu-icon" /> &nbsp; &nbsp;
                      Invite a friend
                    </li>
                  )}
                  <Link to="/contact-us">
                    <li title="Contact  us" onClick={toggleMenu}>
                      <IconMinutemailer className="h-menu-icon" /> &nbsp; &nbsp;
                      Contact us
                    </li>
                  </Link>
                  <Link to="/help">
                    <li title="Help" onClick={toggleMenu}>
                      <IconHelp className="h-menu-icon-help" /> &nbsp; &nbsp;
                      Help
                    </li>
                  </Link>
                  <span className="seperator"></span>
                  <br />
                </ul>
                <div className="socials">
                  <span>Follow us on</span>
                  <ul>
                    <li title="Instagram" onClick={toggleMenu}>
                      <Link to={Config.SOCIALS.instagram.url}>
                        <IconSquareInstagram className="h-socials-icon" />
                      </Link>
                    </li>
                    <li title="Twitter" onClick={toggleMenu}>
                      <Link to={Config.SOCIALS.twitter.url}>
                        <IconSquareTwitter className="h-socials-icon" />
                      </Link>
                    </li>
                    <li title="Facebook" onClick={toggleMenu}>
                      <Link to={Config.SOCIALS.facebook.url}>
                        <Icon402Facebook2 className="h-socials-icon" />
                      </Link>
                    </li>
                    <li title="Linkedin" onClick={toggleMenu}>
                      <Link to={Config.SOCIALS.linkedIn.url}>
                        <Icon458Linkedin className="h-socials-icon" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </nav>
        </MainHeader>
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
    </>
  );
};

<<<<<<< HEAD
export default Header;
=======
export default Header;

const AuthButtonsRenderer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;

  .login-btn {
    padding: 8px 16px;
    border: 1px solid gray;
    border-radius: 4px;
    background-color: transparent;
    color: #fff;
    cursor: pointer;
  }
  .signup-txt {
    font-size: 12px;
    color: #fff;
    padding: 2px 4px;
  }
`;
const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px;
  gap: 10px;
  width: 100%;
  margin-bottom: 5px;

  .avatar {
    width: 50px;
    height: 50px;
    position: relative;
    cursor: pointer;
    border-radius: 30%;
    border: 1px solid ${() => genRandomColor()};
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar img {
    position: absolute;
    border-radius: 30%;
    width: 48px;
    height: 48px;
    z-index: 5;
  }
  .username-holder {
    flex-direction: row;
    justify-content: center;
    padding: 5px 0px 5px;
    overflow: hidden;
    gap: 5px;
  }
  .username-holder h3 {
    color: lightgrey;
  }
  .username-holder span {
    font-size: 12px;
    color: #808080;
    cursor: pointer;
  }
`;
const MainHeader = styled.header`
  max-width: 100%;
  height: 70px;
  position: sticky;
  display: flex;
  flex-direction: row;
  flex: auto;
  z-index: 999;
  background: rgba(251, 251, 251, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
 border-bottom:1px solid #ededed;
  transform: 0.5s;
  top: 0px;
  left: 0;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s ease-out;

  .h-logo {
    height: 80px;
    cursor: pointer;
    width: 80px;
    outline: none;
  }
  .h-nav {
    margin-right: 5px;
    display: flex;
    padding: 10px;
    position: relative;
  }

  .notification,
  .hamburger,
  .sx-search {
    border: 1px solid #ededed;
    padding: 4px 8px;
    background-color: #fff;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .hamburger {
    margin-left: 8px;
  }

  .notification-icon {
    height: 25px;
    width: 20px;
  }
  .hamburger-icon,
  .sx-search-icon {
    height: 20px;
    width: 20px;
  }
  .h-menu {
    position: absolute;
    height: fit-content;
    width: fit-content;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    -moz-backdrop-filter: blur(10px);
    -o-backdrop-filter: blur(10px);
    box-shadow: 0 0px 3px rgba(0, 0, 0, 0.2);
    transform: 0.5s;
    border-radius: 5px;
    background-color: #032c3b;
    z-index: 999;
    padding-right: 40px;
    top: 80%;
    right: 10px;
  }

  .h-menu .h-menu-items li {
    padding: 8px 16px;
    transition: 0.25s ease-in-out;
    color: #ccc;
    font-size: 12px;
    display: flex;
    align-items: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }

  .h-menu .h-menu-items li:hover {
    background-color: grey;
    color: lightgrey;
  }
  .h-menu .h-menu-items li:first-child:hover {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  .h-menu .h-menu-items li .h-menu-icon,
  .h-menu-icon-help {
    height: 20px;
    width: 20px;
    fill: gray;
  }

  .h-menu .h-menu-items li:hover .h-menu-icon {
    fill: #176984;
    stroke: #176984;
  }
  .h-menu .h-menu-items li:hover .h-menu-icon-help {
    stroke: #176984;
  }

  .h-menu .h-menu-items li:hover a {
    color: lightgrey;
  }
  .h-menu .h-menu-items li a {
    text-decoration: none;
    color: lightgrey;
    font-weight: 600;
    font-size: 12px;
  }
  .socials {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 25px;
  }
  .socials span {
    color: #ccc;
    font-size: 13px;
  }
  .socials ul {
    list-style: none;
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .socials ul li {
    padding: 5px 10px;
  }

  .notification-count {
    content: "";
    position: absolute;
    height: 18px;
    width: 20px;
    border-radius: 12px;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #176984;
    top: -2px;
    left: 18px;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-weight: 500;
    border: 1px solid white;
  }

  .h-socials-icon {
    height: 24px;
    width: 24px;
    transition: 0.3s ease-out;
    fill: gray;
  }
  .h-socials-icon:hover {
    fill: #176984;
  }
  @media (max-width: 767px) {
    .notification-count {
      height: 16px;
      width: 18px;
      font-size: 8px;
    }
    .h-menu {
      top: 100%;
    }
  }
`;
>>>>>>> 832ce1e54523d6df4550e5927e27d5ea4093fd7e
