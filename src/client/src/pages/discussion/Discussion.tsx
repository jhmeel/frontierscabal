import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  DiscussionMessage,
  USER,
  Discussion,
  EmojiReaction,
  EMOJI_REACTIONS,
} from "../../types";
import {
  ClickAwayListener,
  TextField,
  Button,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  InputAdornment,
} from "@mui/material";

import {
  AttachFile,
  Send,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  InsertLink,
  Code,
  RemoveCircle,
  MoreVert,
  Search,
} from "@mui/icons-material";
import styled from "styled-components";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Div100vh from "react-div-100vh";
import {
  IconArrowLeftfunction,
  IconDotsVertical,
  IconPin,
} from "../../assets/icons";
import getToken from "../../utils/getToken";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import SpinLoader from "../../components/loaders/SpinLoader";

const StyledDiscussionRoom = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #ffffff;
  font-size: 14px;
  overflow-x: hidden;
  position: relative;
`;

const EmojiSelector = styled.div<{
  isCurrentUser: boolean;
  contextMenuPosition?: { x: number; y: number };
}>`
  position: relative;
  top: 20px;
  right: ${(props) => (props.isCurrentUser ? "-10px" : "auto")};
  left: ${(props) => (props.isCurrentUser ? "auto" : "-10px")};
  background-color: transparent;
  width: 100%;
  flex-wrap: wrap;
  padding: 16px;
  border-left: ${(props) =>
    props.isCurrentUser ? "none" : "4px solid #031e2e"};
  border-right: ${(props) =>
    props.isCurrentUser ? "4px solid #031e2e" : "none"};
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 1000;
`;

const ReactionBar = styled.div<{
  isCurrentUser: boolean;
  contextMenuPosition?: { x: number; y: number };
}>`
  display: flex;
  gap: 4px;
  position: ${(props) => (props.contextMenuPosition ? "fixed" : "absolute")};
  top: ${(props) =>
    props.contextMenuPosition ? `${props.contextMenuPosition.y}px` : "-30px"};
  right: ${(props) =>
    props.isCurrentUser && !props.contextMenuPosition ? "0" : "auto"};
  left: ${(props) =>
    props.isCurrentUser || props.contextMenuPosition ? "auto" : "0"};
  background-color: #f0f0f0;
  border-radius: 12px;
  padding: 2px 6px;
  z-index: 1000;
`;

const ReactionButton = styled.button<{
  isCurrentUserReaction?: boolean;
  index?: number;
}>`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: ${(props) => (props.isCurrentUserReaction ? 1 : 0.7)};
  animation: ${(props) =>
    props.index !== undefined ? `scaleEffect 1s infinite ease-in-out` : "none"};
  animation-delay: ${(props) =>
    props.index !== undefined ? `${props.index * 0.3}s` : "0s"};
  transform-origin: center;
  transition: opacity 0.2s;
  cursor:pointer;

  &:hover {
    opacity: 1;
  }

  @keyframes scaleEffect {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
  }
`;
const ReactionCount = styled.span`
  font-size: 10px;
  color: #888;
  margin-left: 4px;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 30px 0 30px;
  display: flex;
  flex-direction: column;
`;

const MessageInput = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #ededed;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const MessageBubble = styled(motion.div)(({ isCurrentUser, isDeleted }) => ({
  maxWidth: "60%",
  position: "relative",
  width: "fit-content",
  padding: "5px 20px 20px 10px",
  borderTopRightRadius: "20px",
  borderTopLeftRadius: "20px",
  borderBottomRightRadius: isCurrentUser ? "0" : "20px",
  borderBottomLeftRadius: isCurrentUser ? "20px" : "0",
  backgroundColor: isDeleted ? "transparent" : "#77a7b7",
  color: isDeleted ? "#888" : `#fff`,
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  marginBottom: "50px",
  cursor: "pointer",
  transition: "all 0.3s ease",

  fontStyle: isDeleted ? "italic" : "normal",
  fontSize: isDeleted ? `10px` : "14px",
  marginLeft: isCurrentUser ? "auto" : "0",
}));

const UserInfo = styled(motion.div)(({ isCurrentUser, isDeleted }) => ({
  maxWidth: "100%",
  position: "relative",
  width: "fit-content",
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  marginBottom: "5px",
  cursor: "pointer",
  display: isDeleted ? "none" : "block",
  transition: "all 0.3s ease",
  fontStyle: isDeleted ? "italic" : "normal",
  marginLeft: isCurrentUser ? "auto" : "0",
}));

const Username = styled(Typography)`
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
`;

const Time = styled(Typography)(({ isCurrentUser }) => ({
  position: "absolute",
  right: isCurrentUser ? "5px" : `-100`,
  bottom: "5",
  color: "#888888",
}));

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #3498db;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f0f4f8;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #c4c4c4;
  border-radius: 4px;
  margin-right: 8px;
`;

const ParticipantDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 100%;
    max-width: 400px;
    padding: 16px;
  }
`;

const ParticipantList = styled(List)`
  .MuiListItem-root {
    padding-left: 0;
    padding-right: 0;
  }
`;

const PinnedMessagesContainer = styled.div`
  background-color:transparent;
  border-radius: 8px;
  display:flex;
  flex-direction:column;
  width:100%;
  margin-top:4px;
`;

const PinnedMessage = styled.div<{ expanded: boolean }>`
  display: flex;
  width:100%;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border: 1px solid #dfe3e6;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  background-color: ${({ expanded }) => (expanded ? "#e3f2fd" : "#ffffff")};
`;

const MessageContent = styled.div<{ expanded: boolean }>`
  max-height: ${({ expanded }) => (expanded ? "500px" : "0px")};
  overflow: auto;
  transition: max-height 0.5s ease, opacity 0.3s ease-in-out;
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  margin-top: ${({ expanded }) => (expanded ? "8px" : "0")};
`;

const MessageReactions: React.FC<{
  message: DiscussionMessage;
  currentUser: USER;
  contextMenuPosition?: { x: number; y: number };
  isEmojiActive: boolean;
}> = ({ message, currentUser, isEmojiActive }) => {
  const [reactions, setReactions] = useState<EmojiReaction[]>(
    message.reactions || []
  );

  const [showEmojiSelector, setShowEmojiSelector] = useState(isEmojiActive);

  useEffect(() => {
    setShowEmojiSelector(isEmojiActive);
  }, [isEmojiActive]);

  const userCurrentReaction = useMemo(() => {
    return reactions.find((r) => r.users.includes(currentUser._id));
  }, [reactions, currentUser._id]);

  const handleReactionClick = async (emoji: string) => {
    try {
      const messageRef = doc(db, "messages", message.id);

      // If user already has a reaction, remove it
      if (userCurrentReaction) {
        await updateDoc(messageRef, {
          reactions: arrayRemove({
            emoji: userCurrentReaction.emoji,
            users: [currentUser._id],
          }),
        });

        setReactions((prev) =>
          prev
            .map((r) =>
              r.emoji === userCurrentReaction.emoji
                ? {
                    ...r,
                    users: r.users.filter((id) => id !== currentUser._id),
                  }
                : r
            )
            .filter((r) => r.users.length > 0)
        );

        if (userCurrentReaction.emoji === emoji) {
          setShowEmojiSelector(false);
          return;
        }
      }

      await updateDoc(messageRef, {
        reactions: arrayUnion({
          emoji,
          users: [currentUser._id],
        }),
      });

      setReactions((prev) => {
        const filteredReactions = prev
          .map((r) => ({
            ...r,
            users: r.users.filter((id) => id !== currentUser._id),
          }))
          .filter((r) => r.users.length > 0);

        const existingIndex = filteredReactions.findIndex(
          (r) => r.emoji === emoji
        );
        if (existingIndex !== -1) {
          filteredReactions[existingIndex].users.push(currentUser._id);
          return filteredReactions;
        }
        return [...filteredReactions, { emoji, users: [currentUser._id] }];
      });

      setShowEmojiSelector(false);
    } catch (error) {
      console.error("Error updating reactions:", error);
    }
  };

  const renderReactionTooltip = (reaction: EmojiReaction) => {
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Reacted with {reaction.emoji}
        </Typography>
        {reaction.users.map((userId) => {
          const user = message.participants?.find((p) => p._id === userId);
          return (
            <Typography key={userId} variant="body2">
              {user?._id === currentUser._id ? "You" : user?.username}
            </Typography>
          );
        })}
      </Box>
    );
  };

  const toggleEmojiSelector = () => {
    if (!message.isDeleted) {
      setShowEmojiSelector((prev) => !prev);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setShowEmojiSelector(false)}>
      <div>
        {reactions.length > 0 && (
          <ReactionBar isCurrentUser={message.senderId === currentUser._id}>
            {reactions.map((reaction) => (
              <Tooltip
                key={reaction.emoji}
                title={renderReactionTooltip(reaction)}
                placement="top"
              >
                <ReactionButton
                  onClick={toggleEmojiSelector}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleEmojiSelector();
                  }}
                  isCurrentUserReaction={reaction.users.includes(
                    currentUser._id
                  )}
                >
                  {reaction.emoji}
                  <ReactionCount>{reaction.users.length}</ReactionCount>
                </ReactionButton>
              </Tooltip>
            ))}
          </ReactionBar>
        )}

        {showEmojiSelector && (
          <EmojiSelector isCurrentUser={message.senderId === currentUser._id}>
            {EMOJI_REACTIONS.map((emoji, index) => (
              <ReactionButton
                index={index}
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
              >
                {emoji}
              </ReactionButton>
            ))}
          </EmojiSelector>
        )}
      </div>
    </ClickAwayListener>
  );
};

const DiscussionRoom: React.FC<{ currentUser: USER }> = ({ currentUser }) => {
  const { discussionId } = useParams<{ discussionId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<DiscussionMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] =
    useState<DiscussionMessage | null>(null);
  const [participantDrawerOpen, setParticipantDrawerOpen] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<USER | null>(
    null
  );
  const [isEmojiActive, setIsEmojiActive] = useState(false);
  const [discussionParticipants, setDiscussionParticipants] = useState<USER[]>(
    []
  );
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<string[]>([]);

  const fetchDiscussion = useCallback(async () => {
    try {
      const docRef = doc(db, "discussions", discussionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const discussionData = docSnap.data();
        setDiscussion({
          id: docRef.id,
          ...discussionData,
          lastActivityAt:
            discussionData.lastActivityAt instanceof Timestamp
              ? discussionData.lastActivityAt.toDate()
              : new Date(),
        } as Discussion);
      } else {
        setError("Discussion not found");
      }
    } catch (error) {
      setError("Error fetching discussion");
    }
  }, [discussionId]);

  useEffect(() => {
    fetchDiscussion();
  }, [discussionId, fetchDiscussion]);

  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(
        collection(db, "messages"),
        where("discussionId", "==", discussionId),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        async (querySnapshot) => {
          const messagesData: DiscussionMessage[] = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data() as DiscussionMessage;
            const messageWithId = {
              id: doc.id,
              ...data,
              createdAt:
                data.createdAt instanceof Timestamp
                  ? data.createdAt.toDate()
                  : new Date(),
              updatedAt:
                data.updatedAt instanceof Timestamp
                  ? data.updatedAt.toDate()
                  : new Date(),
              unreadBy: data.unreadBy || [],
            };
            messagesData.push(messageWithId);
          });

          // Track unread messages for current user
          const currentUserUnreadMessages = messagesData
            .filter((msg) => msg.unreadBy?.includes(currentUser._id))
            .map((msg) => msg.id);

          setUnreadMessages(currentUserUnreadMessages);
          setMessages(messagesData);

          // Mark messages as read when entering the discussion
          await Promise.all(
            currentUserUnreadMessages.map((messageId) =>
              markMessageAsRead(discussionId, messageId, currentUser._id)
            )
          );

          setLoading(false);
        },
        (error) => {
          console.log(error);
          setError("Error fetching messages. Please try again later.");
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchMessages();
  }, [discussionId, currentUser._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentUser || !currentUser?._id) {
      setError(
        "User information is not available. Please try logging in again."
      );
      return;
    }

    if (newMessage.trim() || file) {
      try {
        let fileUrl = "";
        let fileType = "";
        let fileName = "";
        if (file) {
          const storageRef = ref(storage, `files/${discussionId}/${file.name}`);
          await uploadBytes(storageRef, file);
          fileUrl = await getDownloadURL(storageRef);
          fileType = file.type;
          fileName = file.name;
        }

        const messageData: DiscussionMessage = {
          discussionId: discussionId,
          senderId: currentUser._id,
          senderAvatar: currentUser.avatar?.url,
          senderName: currentUser.username,
          content: newMessage.trim(),
          fileUrl,
          fileType,
          fileName,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          replyTo: replyTo ? replyTo.id : "",
          unreadBy:
            discussion?.participants.filter((id) => id !== currentUser._id) ||
            [],
        };

        await addDoc(collection(db, "messages"), messageData);
        await updateDoc(doc(db, "discussions", discussionId), {
          lastActivityAt: serverTimestamp(),
        });

        setNewMessage("");
        setFile(null);
        setReplyTo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.log(error);
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        content: "This message has been deleted",
        updatedAt: serverTimestamp(),
        isDeleted: true,
      });
    } catch (error) {
      setError("Failed to delete message. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormatText = (format: string) => {
    const textarea = document.getElementById(
      "message-input"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = newMessage.substring(start, end);
    let formattedText = "";

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        break;
      case "code":
        formattedText = `\`${selectedText}\``;
        break;
      default:
        return;
    }

    const newContent =
      newMessage.substring(0, start) +
      formattedText +
      newMessage.substring(end);
    setNewMessage(newContent);
    textarea.focus();
    textarea.setSelectionRange(
      start + formattedText.length,
      start + formattedText.length
    );
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    message: DiscussionMessage | USER | any
  ) => {
    if (message?.isDeleted) return;
    setAnchorEl(event.currentTarget);

    if ("senderId" in message) {
      setSelectedMessage(message);
      setSelectedParticipant(null);
    } else {
      setSelectedParticipant(message);
      setSelectedMessage(null);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleMenuAction = (action: string) => {
    if (selectedMessage) {
      switch (action) {
        case "reply":
          setReplyTo(selectedMessage);
          break;
        case "delete":
          handleDeleteMessage(selectedMessage.id);
          break;
        case "download":
          window.open(selectedMessage.fileUrl, "_blank");
          break;
        default:
          break;
      }
    }
    handleCloseMenu();
  };

  const handleParticipantMenuAction = (action: string) => {
    if (selectedParticipant) {
      switch (action) {
        case "removeParticipant":
          removeParticipant(selectedParticipant._id);
          break;
        default:
          break;
      }
    }
    handleCloseMenu();
  };
  const removeParticipant = async (participantId: string) => {
    try {
      if (!discussion?.id) {
        toast.error("Discussion not found");
        return;
      }

      const updatedParticipants = discussion.participants.filter(
        (id) => id !== participantId
      );

      await updateDoc(doc(db, "discussions", discussion.id), {
        participants: updatedParticipants,
      });

      toast.success("Participant removed");

      getParticipants();
    } catch (error) {
      console.error("Error removing participant:", error);
      toast.error("Failed to remove participant");
    }
  };
  
  const handleParticipantDrawerToggle = () => {
    setParticipantDrawerOpen((prev) => !prev);
  };

 

  const getParticipants = async () => {
    try {
      const authToken = await getToken();
      const participantPromises: Promise<USER>[] = [];

      if (discussion?.participants) {
        for (const participantId of discussion.participants) {
          if (participantId !== currentUser?._id) {
            const { data } = await axiosInstance(authToken).get(
              `/api/v1/userdetails/${participantId}`
            );
            participantPromises.push(data.user);
          }
        }
      }

      const participants = await Promise.all(participantPromises);

      setDiscussionParticipants(participants);
    } catch (err) {
      console.error(err);
    }
  };

  const [contextMenuPosition, setContextMenuPosition] = useState<
    { x: number; y: number } | undefined
  >();

  const handleContextMenu = (
    event: React.MouseEvent,
    message: DiscussionMessage
  ) => {
    event.preventDefault();

    const contextMenuPosition = {
      x: event.clientX,
      y: event.clientY,
    };

    setSelectedMessage(message);
    setIsEmojiActive(!isEmojiActive);
    setContextMenuPosition(contextMenuPosition);
  };

  useEffect(() => {
    getParticipants();
  }, [discussionParticipants]);

 // Define the state outside of renderPinnedMessages
const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

const toggleExpand = (id: string) => {
  setExpandedMessageId((prev) => (prev === id ? null : id));
};

const renderPinnedMessages = () => {
  const pinnedMsgs = messages.filter((msg) => msg.isPinned);

  return pinnedMsgs.length > 0 ? (
    <PinnedMessagesContainer>
      {pinnedMsgs.map((pinnedMsg) => {
        const isExpanded = expandedMessageId === pinnedMsg.id;

        return (
          <PinnedMessage
            key={pinnedMsg.id}
            expanded={isExpanded}
            onClick={() => toggleExpand(pinnedMsg.id)}
            onDoubleClick={()=>toggleMessagePin(pinnedMsg.id)}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {pinnedMsg.content.slice(0, 20)}... 
            </Typography>
           
            <MessageContent expanded={isExpanded}>
              <Typography variant="body2">{pinnedMsg.content}</Typography>
            </MessageContent>
          </PinnedMessage>
        );
      })}
    </PinnedMessagesContainer>
  ) : null;
};


  if (loading) {
    return <SpinLoader />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate(-1)}
          style={{ marginTop: "20px" }}
        >
          Go Back
        </Button>
      </div>
    );
  }
  const markMessageAsRead = async (
    messageId: string,
    userId: string
  ) => {
    try {
      const messageRef = doc(db, "messages", messageId);
      await updateDoc(messageRef, {
        unreadBy: arrayRemove(userId),
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };
  const toggleMessagePin = async (messageId: string) => {
    try {
      const discussionRef = doc(db, "discussions", discussionId);

      if (discussion.creatorId !== currentUser._id) {
        return;
      }

      const messageRef = doc(db, "messages", messageId);

      const messageSnap = await getDoc(messageRef);
      const messageData = messageSnap.data() as DiscussionMessage;

      if (messageData.isPinned) {
        await updateDoc(discussionRef, {
          pinnedMessages: arrayRemove(messageId),
        });
        await updateDoc(messageRef, {
          isPinned: false,
        });
        handleCloseMenu()
      } else {
        await updateDoc(discussionRef, {
          pinnedMessages: arrayUnion(messageId),
        });
        await updateDoc(messageRef, {
          isPinned: true,
        });
        handleCloseMenu()
      }
    } catch (error) {
      console.error("Error toggling message pin:", error);
    }
    
  };
  const rCl1 = `#456`;
  const rCl2 = `#978500`;
  return (
    <Div100vh>
      <StyledDiscussionRoom>
        <TopBar style={{ height: 65 }}>
          <IconButton color="#fff" onClick={() => navigate(-1)}>
            <IconArrowLeftfunction fill="#fff" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: `column`,
              flexGrow: 1,
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <Typography
              variant="h6"
              style={{
                marginLeft: 16,
                overflow: "hidden",
                color: "#fff",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {discussion?.title}
            </Typography>

            <Typography variant="caption" color="#ededed">
              {discussion?.participants?.length > 1
                ? ` ${discussion?.participants.length} participants`
                : ` ${discussion?.participants.length} participant`}
            </Typography>
          </Box>
          <IconButton onClick={handleParticipantDrawerToggle}>
            <IconDotsVertical color="#fff" />
          </IconButton>
        </TopBar>
        <MessageList>
        {renderPinnedMessages()}
          {messages.map((message, index) => {
            const messageDate = message.createdAt
              ? new Date(message.createdAt).toLocaleDateString()
              : null;

            const previousMessageDate =
              index > 0 && messages[index - 1].createdAt
                ? new Date(messages[index - 1].createdAt).toLocaleDateString()
                : null;

            const isNewDay = messageDate && messageDate !== previousMessageDate;
            return (
              <>
                {isNewDay && (
                  <Typography
                    variant="subtitle2"
                    style={{
                      color: "#888",
                      margin: "10px 0",
                      textAlign: "center",
                    }}
                  >
                    {messageDate
                      ? new Date(message.createdAt).toDateString()
                      : new Date().toDateString()}
                  </Typography>
                )}
                <div key={message.id}>
                  {
                    <MessageBubble
                      isCurrentUser={message.senderId === currentUser?._id}
                      isDeleted={message.isDeleted}
                      onDoubleClick={(event) => {
                        if (!message.isDeleted) {
                          handleOpenMenu(event, message);

                          handleContextMenu(event, message);
                        }
                      }}
                      onContextMenu={(event) =>
                        handleContextMenu(event, message)
                      }
                    >
                      <UserInfo
                        isCurrentUser={message.senderId === currentUser?._id}
                        isDeleted={message.isDeleted}
                      >
                        <Username variant="caption" color={rCl1}>
                          {message.senderName}
                        </Username>
                      </UserInfo>

                      {message.replyTo && !message.isDeleted && (
                        <Typography
                          variant="caption"
                          style={{
                            borderLeft: `2px solid #a0a6b3`,
                            background: `#324b55`,
                            borderRadius: 10,
                            padding: `10px`,
                            marginBottom: 4,
                            display: "block",
                            color: "#8c8c8c",
                          }}
                        >
                          Replying to:{" "}
                          {messages
                            .find((m) => m.id === message.replyTo)
                            ?.content.substring(0, 30)}
                        </Typography>
                      )}
                      {
                        <Typography
                          variant="body1"
                          color="#fff"
                          fontSize={message.isDeleted ? 10 : 14}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            style={{ color: "white !important" }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </Typography>
                      }
                      {message.fileUrl && !message.isDeleted && (
                        <div>
                          {message?.fileType?.startsWith("image/") ? (
                            <img
                              src={message?.fileUrl}
                              alt={message?.fileName}
                              style={{
                                maxWidth: "200px",
                                height: "auto",
                                borderRadius: "8px",
                                marginTop: 8,
                              }}
                            />
                          ) : (
                            <FilePreview>
                              <FileIcon>
                                <AttachFile />
                              </FileIcon>
                              <div
                                style={{
                                  display: `flex`,
                                  flexDirection: `column`,
                                }}
                              >
                                <Typography variant="caption">
                                  {message?.fileName}
                                </Typography>
                                <Typography variant="caption">
                                  {message?.fileType}
                                </Typography>
                              </div>
                            </FilePreview>
                          )}
                        </div>
                      )}

                      <Time
                        variant="caption"
                        fontSize={9}
                        isCurrentUser={message.senderId === currentUser?._id}
                      >
                        {new Date(message.createdAt).toTimeString().slice(0, 5)}
                      </Time>

                      <Avatar
                        src={message.senderAvatar}
                        sx={{
                          width: 28,
                          backgroundColor: rCl2,
                          height: 28,
                          fontSize: 12,
                          marginRight: 4,
                          position: `absolute`,
                          left:
                            message.senderId === currentUser?._id ? `99%` : -28,
                          bottom: -23,
                        }}
                      >
                        {message.senderName
                          ? message.senderName[0].toUpperCase()
                          : "U"}
                      </Avatar>

                      {!message.isDeleted && (
                        <MessageReactions
                          message={message}
                          isEmojiActive={
                            message.id == selectedMessage?.id && isEmojiActive
                          }
                          currentUser={currentUser}
                          contextMenuPosition={contextMenuPosition}
                        />
                      )}
                    </MessageBubble>
                  }
                </div>
              </>
            );
          })}
          <div ref={messagesEndRef} />
        </MessageList>
        <MessageInput>
          {replyTo && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: 8,
                marginBottom: 8,
                backgroundColor: "#f0f4f8",
                borderRadius: 4,
                borderLeft: `4px solid ${rCl1}`,
              }}
            >
              <Typography variant="caption">
                <h5 style={{ color: rCl1 }}>{replyTo.senderName}</h5>
                {replyTo?.fileType?.startsWith("image/") ? (
                  <img
                    src={replyTo?.fileUrl}
                    alt={replyTo?.fileName}
                    style={{
                      maxWidth: "20px",
                      height: "auto",
                      borderRadius: "8px",
                      marginTop: 8,
                    }}
                  />
                ) : (
                  <div style={{ display: `flex` }}>
                    {replyTo?.fileType && (
                      <FileIcon>
                        <AttachFile />
                      </FileIcon>
                    )}
                    <div>
                      <Typography variant="subtitle2">
                        {replyTo?.fileName}
                      </Typography>
                      <Typography variant="caption">
                        {replyTo?.fileType}
                      </Typography>
                    </div>
                  </div>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {replyTo.content.substring(0, 30)}
                </ReactMarkdown>
              </Typography>
              <IconButton size="small" onClick={() => setReplyTo(null)}>
                <RemoveCircle fontSize="small" />
              </IconButton>
            </div>
          )}
          {file && (
            <FilePreview>
              <FileIcon>
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <AttachFile />
                )}
              </FileIcon>
              <div>
                <Typography variant="subtitle2">{file.name}</Typography>
                <Typography variant="caption">{file.type}</Typography>
              </div>
              <Tooltip title="Remove" placement="bottom">
                <IconButton
                  size="small"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <RemoveCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            </FilePreview>
          )}
          <Toolbar>
            <Tooltip title="Bold" placement="bottom">
              <IconButton size="small" onClick={() => handleFormatText("bold")}>
                <FormatBold fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="italic" placement="bottom">
              <IconButton
                size="small"
                onClick={() => handleFormatText("italic")}
              >
                <FormatItalic fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="underline" placement="bottom">
              <IconButton
                size="small"
                onClick={() => handleFormatText("underline")}
              >
                <FormatUnderlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="link" placement="bottom">
              <IconButton size="small" onClick={() => handleFormatText("link")}>
                <InsertLink fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="code" placement="bottom">
              <IconButton size="small" onClick={() => handleFormatText("code")}>
                <Code fontSize="small" />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              ref={fileInputRef}
              accept="image/*"
            />
            <Tooltip title="file" placement="bottom">
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                <AttachFile fontSize="small" />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <div style={{ display: "flex" }}>
            <TextField
              id="message-input"
              fullWidth
              variant="outlined"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              multiline
              rows={2}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<Send />}
              onClick={handleSendMessage}
              style={{ marginLeft: 8, alignSelf: "flex-end" }}
            >
              Send
            </Button>
          </div>
        </MessageInput>
        <ParticipantDrawer
          anchor="bottom"
          open={participantDrawerOpen}
          onClose={handleParticipantDrawerToggle}
        >
          <Typography variant="h6" style={{ marginBottom: 16 }}>
            Participants
          </Typography>
          <TextField
            fullWidth
            placeholder="Search participants..."
            value={participantSearch}
            onChange={(e) => setParticipantSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            style={{ marginBottom: 16 }}
          />
          <ParticipantList>
            {discussionParticipants.map((participant) => (
              <ListItem key={participant?._id} disableGutters>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar src={participant?.avatar?.url}>
                      {participant?.username[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={participant?.username}
                    secondary={
                      participant?._id === currentUser._id ? "You" : null
                    }
                  />
                  <ListItemIcon>
                    <IconButton
                      size="small"
                      onClick={(event) => handleOpenMenu(event, participant)}
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </ParticipantList>
        </ParticipantDrawer>

        <>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedMessage !== null}
            onClose={handleCloseMenu}
            elevation={1}
            PaperProps={{
              style: {
                borderRadius: "8px",
              },
            }}
          >
            {selectedMessage?.senderId === discussion?.creatorId && (
              <MenuItem
                onClick={() => toggleMessagePin(selectedMessage.id)}
                divider={
                  selectedMessage?.fileUrl ||
                  selectedMessage?.senderId === currentUser._id
                }
              >
                {discussion?.pinnedMessages?.includes(selectedMessage?.id)
                  ? `Unpin`
                  : `Pin`}
              </MenuItem>
            )}
            <MenuItem
              onClick={() => handleMenuAction("reply")}
              divider={
                selectedMessage?.fileUrl ||
                selectedMessage?.senderId === currentUser._id
              }
            >
              Reply
            </MenuItem>
            {selectedMessage?.fileUrl && (
              <MenuItem onClick={() => handleMenuAction("download")} divider>
                Download
              </MenuItem>
            )}
            {selectedMessage?.senderId === currentUser._id && (
              <MenuItem onClick={() => handleMenuAction("delete")}>
                Delete
              </MenuItem>
            )}
          </Menu>

          {/* Participant Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedParticipant !== null}
            onClose={handleCloseMenu}
            PaperProps={{
              style: {
                borderRadius: "8px",
              },
            }}
          >
            {/* Only show remove if the current user is the discussion creator */}
            {discussion?.creatorId === currentUser._id && (
              <MenuItem
                onClick={() => handleParticipantMenuAction("removeParticipant")}
                style={{ color: "red" }}
              >
                Remove Participant
              </MenuItem>
            )}
          </Menu>
        </>
      </StyledDiscussionRoom>
    </Div100vh>
  );
};

export default DiscussionRoom;
