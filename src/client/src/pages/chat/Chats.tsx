import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Paper,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
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
import { RootState } from "../../store";
import toast from "react-hot-toast";

const ChatsPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  background:`transparent`
}));

const RecentChatsContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));
const SearchBar = styled(TextField)`
  flex-grow: 1;
  margin-right: 16px;
`;

const NoChatsPlaceholder = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
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

const Chats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState<ChatData[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      toast.error("No user ID found. Skipping chat fetch.");
      setLoading(false);
      return;
    }


    const db = getFirestore(firebaseApp);
    const chatroomsRef = collection(db, "chatrooms");
    const q = query(
      chatroomsRef,
      where("participants", "array-contains", user._id),
      orderBy("lastMessageTime", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(
          "Received snapshot with",
          snapshot.docs.length,
          "documents"
        );
        const newChats: ChatData[] = [];
        const newUsers: { [key: string]: string } = {};

        snapshot.forEach((doc) => {
          const data = doc.data() as ChatData;

          if (data.lastMessageTime) {
            newChats.push({
              id: doc.id,
              ...data,
              lastMessageTime: data.lastMessageTime,
            });

            data.participants.forEach((userId) => {
              if (userId !== user._id) {
                newUsers[userId] = userId;
              }
            });
          } else {
            console.warn("Chat", doc.id, "has no lastMessageTime. Skipping.");
          }
        });

        setChats(newChats);

        const usersRef = collection(db, "users");
        const userIds = Object.keys(newUsers);
        console.log("Fetching details for users:", userIds);

        userIds.forEach((userId) => {
          const userQuery = query(usersRef, where("_id", "==", userId));
          onSnapshot(userQuery, (userSnapshot) => {
            userSnapshot.forEach((userDoc) => {
              const userData = userDoc.data() as UserData;
              setUsers((prevUsers) => ({
                ...prevUsers,
                [userData._id]: userData,
              }));
            });
          });
        });

        setLoading(false);
      },
      (err) => {
        setError("Failed to load chats. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?._id]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  const handleFindSomeoneClick = () => {
    navigate("/search");
  };

  const filteredChats = chats.filter((chat) => {
    const otherParticipantId =
      chat.participants.find((id) => id !== user?._id) || "";
    const otherUser = users[otherParticipantId];
    return otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOtherParticipant = (participants: string[]) => {
    return participants.find((id) => id !== user?._id) || "";
  };

  return (
    <ChatsPageContainer>
      <SearchContainer elevation={0}>
      <SearchBar
            label="Search chats..."
            variant="outlined"
            size="small"
            value={searchTerm}
          onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
      </SearchContainer>

      <RecentChatsContainer>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Recent Chats</Typography>
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={handleFindSomeoneClick}
          >
            <AddIcon color="action" />
          </Button>
        </Box>

        {!loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flex={1}
          >
            <CircularProgress />
          </Box>
        ) : filteredChats.length === 0 ? (
          <NoChatsPlaceholder>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No chats yet
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Start a conversation or search for someone to chat with!
            </Typography>
          </NoChatsPlaceholder>
        ) : (
          <List>
            {filteredChats.map((chat) => {
              const otherParticipantId = getOtherParticipant(chat.participants);
              const otherUser = users[otherParticipantId];
              return (
                <StyledListItem
                  key={chat.id}
                  button
                  onClick={() => handleChatClick(chat.id)}
                >
                  <ListItemAvatar>
                    <Avatar src={otherUser?.avatar?.url}>
                      {otherUser?.username.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {otherUser?.username}
                      </Typography>
                    }
                    secondary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          noWrap
                          sx={{ maxWidth: "70%" }}
                        >
                          {chat.lastMessageSender === user?._id ? "You: " : ""}
                          {chat.lastMessage}
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
        )}
      </RecentChatsContainer>
    </ChatsPageContainer>
  );
};

export default Chats;
