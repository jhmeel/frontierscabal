import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Stack, 
  Chip, 
  Avatar,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  Button
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Notifications as NotificationIcon, 
  CheckCircleOutline,
  MarkChatReadOutlined,
  FilterList,
  Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistance } from "date-fns";

import MetaData from "../../MetaData";
import Footer from "../../components/footer/Footer";
import { NotificationManager } from "../../lib/notificationManager/NotificationManager";

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const notificationService = NotificationManager.getInstance();

  const loadNotifications = () => {
    const newNotifications = notificationService.getNotifications();
    setNotifications(newNotifications);
    setUnreadCount(notificationService.getUnreadNotificationsCount());
  };

  useEffect(() => {
    loadNotifications();
  }, [notificationService]);

  const filterNotifications = () => {
    switch(activeFilter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'important':
        return notifications.filter(n => n.type === 'important');
      default:
        return notifications;
    }
  };

  const markAllAsRead = () => {
    notificationService.markAllNotificationsAsRead();
    loadNotifications();
  };

  const NotificationCard = ({ notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <StyledNotificationPaper elevation={3}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 1 : 2,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <Avatar 
            src={notification?.avatar || notification?.image} 
            sx={{ 
              bgcolor: notification.type === 'important' ? 'error.main' : 'primary.main',
              width: isMobile ? 40 : 56, 
              height: isMobile ? 40 : 56,
              mb: isMobile ? 1 : 0
            }}
          >
            {!notification?.avatar && notification?.entityname?.charAt(0)}
          </Avatar>
          <Box sx={{ 
            flex: 1, 
            width: '100%',
            textAlign: isMobile ? 'center' : 'left'
          }}>
            <Typography variant={isMobile ? "subtitle2" : "subtitle1"} fontWeight={600}>
              {notification?.entityname}
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary"
              sx={{ 
                width: '100%', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {notification?.message}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {formatDistance(new Date(notification?.date), new Date(), { addSuffix: true })}
            </Typography>
          </Box>
          {notification.type === 'important' && !isMobile && (
            <Chip 
              label="Important" 
              color="error" 
              size="small" 
              sx={{ fontWeight: 600 }} 
            />
          )}
        </Box>
      </StyledNotificationPaper>
    </motion.div>
  );

  const FilterContent = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      gap: 1, 
      p: isMobile ? 2 : 0 
    }}>
      <Chip 
        label="All" 
        variant={activeFilter === 'all' ? 'filled' : 'outlined'}
        color="primary"
        onClick={() => {
          setActiveFilter('all');
          setMobileFilterOpen(false);
        }}
        fullWidth={isMobile}
      />
      <Chip 
        label="Unread" 
        variant={activeFilter === 'unread' ? 'filled' : 'outlined'}
        color="primary"
        onClick={() => {
          setActiveFilter('unread');
          setMobileFilterOpen(false);
        }}
        fullWidth={isMobile}
      />
      <Chip 
        label="Important" 
        variant={activeFilter === 'important' ? 'filled' : 'outlined'}
        color="error"
        onClick={() => {
          setActiveFilter('important');
          setMobileFilterOpen(false);
        }}
        fullWidth={isMobile}
      />
      <IconButton 
        onClick={markAllAsRead} 
        color="primary"
        sx={{ 
          display: isMobile ? 'none' : 'inline-flex' 
        }}
      >
        <MarkChatReadOutlined />
      </IconButton>
    </Box>
  );

  const filteredNotifications = filterNotifications();

  return (
    <>
      <MetaData title="Notifications" />
      <NotificationContainer maxWidth="md">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          flexDirection: 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: '100%',
            justifyContent: 'flex-start'
          }}>
         
            <Typography variant={"h5"} fontWeight={700} display={`flex`} alignItems={`center`}>
            <NotificationIcon sx={{ fontSize: isMobile ? 24 : 32, color: 'primary.main' }} /> Notifications
            </Typography>
          </Box>
          {isMobile ? (
            <Button 
              startIcon={<FilterList />} 
              variant="outlined" 
              onClick={() => setMobileFilterOpen(true)}
            >
              Filters
            </Button>
          ) : (
            <FilterContent />
          )}
        </Box>

        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            <Stack spacing={2}>
              {filteredNotifications.map((notification, index) => (
                <NotificationCard key={index} notification={notification} />
              ))}
            </Stack>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '50vh', 
                  textAlign: 'center' 
                }}
              >
                <CheckCircleOutline 
                  sx={{ 
                    fontSize: isMobile ? 80 : 100, 
                    color: 'text.secondary', 
                    mb: 2 
                  }} 
                />
                <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary">
                  No notifications to show
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  You're all caught up!
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </NotificationContainer>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            p: 2
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography variant="h6">Filter Notifications</Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <FilterContent />
      </Drawer>

      <Footer />
    </>
  );
};

const NotificationContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

const StyledNotificationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5)
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6]
  }
}));

export default NotificationPage;