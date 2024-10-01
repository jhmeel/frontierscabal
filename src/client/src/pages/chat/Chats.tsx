import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TuneIcon from '@mui/icons-material/Tune';
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Footer from "../../components/footer/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { app as firebaseApp } from "../../firebase";

const ChatPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const BackIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const OnlineUsersTray = styled(Paper)(({ theme }) => ({
  display: "flex",
  overflowX: "auto",
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: theme.shape.borderRadius,
  },
}));

const RecentChatsContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const OnlineUserBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  marginRight: theme.spacing(2),
}));

const AvatarWithBadge = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(6),
  height: theme.spacing(6),
}));

interface ChatData {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSender: string;
}

interface UserData {
  _id: string;
  username: string;
  avatar?: {
    url: string;
  };
}

const RecentChats = ({ chats, users, currentUserId }: { chats: ChatData[], users: { [key: string]: UserData }, currentUserId: string }) => {
  const navigate = useNavigate();
  
  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const getOtherParticipant = (participants: string[]) => {
    return participants.find(id => id !== currentUserId) || '';
  };

  return (
    <List>
      {chats.map((chat) => {
        const otherParticipantId = getOtherParticipant(chat.participants);
        const otherUser = users[otherParticipantId];
        return (
          <StyledListItem key={chat.id} button onClick={() => handleChatClick(chat.id)}>
            <ListItemAvatar>
              <Badge
                color="success"
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <AvatarWithBadge src={otherUser?.avatar?.url}>
                  {otherUser?.username.charAt(0)}
                </AvatarWithBadge>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle1">{otherUser?.username}</Typography>}
              secondary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary" noWrap sx={{ maxWidth: '70%' }}>
                    {chat.lastMessageSender === currentUserId ? 'You: ' : ''}{chat.lastMessage}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDistanceToNow(chat.lastMessageTime)} ago
                  </Typography>
                </Box>
              }
            />
          </StyledListItem>
        );
      })}
    </List>
  );
};

const Chats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState<ChatData[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    const db = getFirestore(firebaseApp);
    const chatroomsRef = collection(db, "chatrooms");
    const q = query(
      chatroomsRef,
      where("participants", "array-contains", user._id),
      orderBy("lastMessageTime", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newChats: ChatData[] = [];
      const newUsers: { [key: string]: string } = {};

      snapshot.forEach((doc) => {
        const data = doc.data() as ChatData;
        newChats.push({
          id: doc.id,
          ...data,
          lastMessageTime: data.lastMessageTime.toDate(),
        });

        // Collect unique user IDs
        data.participants.forEach((userId) => {
          if (userId !== user._id) {
            newUsers[userId] = userId;
          }
        });
      });

      setChats(newChats);

      // Fetch user details for all participants
      const usersRef = collection(db, "users");
      const userIds = Object.keys(newUsers);
      const userQueries = userIds.map((userId) =>
        query(usersRef, where("_id", "==", userId))
      );

      userQueries.forEach((q) => {
        onSnapshot(q, (snapshot) => {
          snapshot.forEach((doc) => {
            const userData = doc.data() as UserData;
            setUsers((prevUsers) => ({
              ...prevUsers,
              [userData._id]: userData,
            }));
          });
        });
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?._id]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const goBack = () => {
    navigate(-1);
  };

  const filteredChats = chats.filter((chat) => {
    const otherParticipantId = chat.participants.find(id => id !== user?._id) || '';
    const otherUser = users[otherParticipantId];
    return otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <ChatPageContainer>
        <HeaderContainer>
          
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search chats..."
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <TuneIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
        </HeaderContainer>

        <OnlineUsersTray>
          {Object.values(users).map((user) => (
            <OnlineUserBox key={user._id}>
              <Badge
                color="success"
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <AvatarWithBadge src={user.avatar?.url}>
                  {user.username.charAt(0)}
                </AvatarWithBadge>
              </Badge>
              <Typography variant="caption" sx={{ display: "block", marginTop: 0.5 }}>
                {user.username}
              </Typography>
            </OnlineUserBox>
          ))}
        </OnlineUsersTray>

        <RecentChatsContainer>
          <Typography variant="h6" gutterBottom>
            Recent Chats
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <RecentChats chats={filteredChats} users={users} currentUserId={user?._id || ''} />
          )}
        </RecentChatsContainer>
      </ChatPageContainer>
      <Footer />
    </>
  );
};

export default Chats;