import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

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
  IconMinutemailer,
  IconBookshelf,
  IconBxsBookmarks,
  IconAddOutline,
  IconProfile,
  IconVideoTwentyFour,
  IconBxSearchAlt,
} from '../../assets/icons';
import { Assistant } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { genRandomColor, genUniqueShortname } from '../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import emptyAvatar from '../../assets/images/empty_avatar.png';
import { RoughNotation } from 'react-rough-notation';
import Config from '../../config/Config';
import fcabal from "../../assets/logos/fcabal.png";
import getToken from '../../utils/getToken';

const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [shortname, setShortName] = useState<string | undefined>(undefined);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const setToken = async () => {
      const t: string = await getToken();
      setAuthToken(t);
    };
    setToken();
    if (user && user?.email) {
      setShortName(genUniqueShortname(user.email));
    }
  }, [user]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSearch = () => {
    navigate('/search');
  };

  return (
    <StyledAppBar position="sticky">
      <Toolbar style={{background:"#f4f4f4"}}>
        <Link to="/">
          <img src={fcabal} alt="frontiersCabal" className="logo" />
        </Link>

        <div className="right-icons">
          <IconButton
            edge="end"
            color="inherit"
            aria-label="search"
            onClick={handleSearch}
            sx={{
              border: '1px solid #ededed',
              borderRadius: '5px',
              padding: '4px 8px',
              marginRight: '8px',
            }}
          >
            <IconBxSearchAlt />
          </IconButton>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="notifications"
            component={Link}
            to="/notifications"
            sx={{
              border: '1px solid #ededed',
              borderRadius: '5px',
              padding: '4px 8px',
              marginRight: '8px',
            }}
          >
            <IconNotifications />
            {notificationCount > 0 && (
              <NotificationBadge>{notificationCount >= 10 ? '9+' : notificationCount}</NotificationBadge>
            )}
          </IconButton>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{
              border: '1px solid #ededed',
              borderRadius: '5px',
              padding: '4px 8px',
            }}
          >
            <IconHamburgerMenu />
          </IconButton>
        </div>

        <Drawer  anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
          {!user?.username && (
            <AuthButtons>
              <Link to="/login">
                <button className="login-btn">Login</button>
              </Link>
              <Link to="/signup">
                <span className="signup-txt">
                  New to Frontierscabal? <u>Signup</u>
                </span>
              </Link>
            </AuthButtons>
          )}

          {user?.username && (
            <UserAvatar>
              <div className="avatar">
                <img loading="lazy" src={user?.avatar?.url || emptyAvatar} />
              </div>
              <div className="username-holder">
                <RoughNotation padding={0} color={genRandomColor()} type="underline" show={true}>
                  <h3>{user?.username}</h3>
                </RoughNotation>
                <span>{shortname}</span>
              </div>
            </UserAvatar>
          )}

          <List>
            <ListItem disablePadding component={Link} to="/">
              <ListItemButton>
                <ListItemIcon>
                  <IconHouse fontSize={20}/>
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/study-materials">
              <ListItemButton>
                <ListItemIcon>
                  <IconBookshelf fontSize={20}/>
                </ListItemIcon>
                <ListItemText primary="Study Materials" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/modules">
              <ListItemButton>
                <ListItemIcon>
                  <IconVideoTwentyFour fontSize={20}/>
                </ListItemIcon>
                <ListItemText primary="Modules" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/blog">
              <ListItemButton>
                <ListItemIcon>
                  <Icon010Blog fontSize={20}/>
                </ListItemIcon>
                <ListItemText primary="Blog" />
              </ListItemButton>
            </ListItem>
          
            {user?.username && authToken !== undefined && (
              <ListItem disablePadding component={Link} to={`/profile/${user?.username}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <IconProfile fontSize={20}/>
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
            )}
           
            {user?.role && ['FC:SUPER:ADMIN', 'FC:ADMIN'].includes(user?.role) && authToken !== undefined && (
              <ListItem disablePadding component={Link} to="/study-material/new">
                <ListItemButton>
                  <ListItemIcon>
                    <IconAddOutline fontSize={20}/>
                  </ListItemIcon>
                  <ListItemText primary="Upload Study Material" />
                </ListItemButton>
              </ListItem>
            )}
            {user?.username && authToken !== undefined && (
              <ListItem disablePadding component={Link} to="/bookmarks">
                <ListItemButton>
                  <ListItemIcon>
                    <IconBxsBookmarks fontSize={20}/>
                  </ListItemIcon>
                  <ListItemText primary="Bookmarks" />
                </ListItemButton>
              </ListItem>
            )}
            
            <ListItem disablePadding component={Link} to="/contact-us">
              <ListItemButton>
                <ListItemIcon>
                  <Assistant />
                </ListItemIcon>
                <ListItemText primary="Contact us" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/help">
              <ListItemButton>
                <ListItemIcon>
                  <IconHelp fontSize={20}/>
                </ListItemIcon>
                <ListItemText primary="Help" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <div className="socials">
            <span>Follow us on</span>
            <div className="social-links">
              <Link to={Config.SOCIALS.instagram.url}>
                <IconSquareInstagram fontSize={26}/>
              </Link>
              <Link to={Config.SOCIALS.twitter.url}>
                <IconSquareTwitter fontSize={26}/>
              </Link>
              <Link to={Config.SOCIALS.facebook.url}>
                <Icon402Facebook2 fontSize={26}/>
              </Link>
              <Link to={Config.SOCIALS.linkedIn.url}>
                <Icon458Linkedin fontSize={26}/>
              </Link>
            </div>
          </div>
        </Drawer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;

const StyledAppBar = styled(AppBar)`
  background: rgba(251, 251, 251, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  border-bottom: 1px solid #ededed;

  .logo {
    height: 80px;
    cursor: pointer;
    width: 80px;
    outline: none;
  }

  .right-icons {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;

  .login-btn {
    padding: 8px 16px;
    border: 1px solid gray;
    border-radius: 4px;
    background-color: transparent;
    color: #000000;
    cursor: pointer;
  }
  .signup-txt {
    font-size: 14px;
    color: #000000;
    padding: 2px 4px;
  }
`;

const UserAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  padding: 16px;
  gap: 16px;
  width: 100%;
  margin-bottom: 8px;

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
    gap: 8px;
  }
  .username-holder h3 {
    color:  #808080;
  }
  .username-holder span {
    font-size: 14px;
    color: #808080;
    cursor: pointer;
  }
`;

const NotificationBadge = styled.span`
  content: '';
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
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  font-weight: 500;
  border: 1px solid white;
`;