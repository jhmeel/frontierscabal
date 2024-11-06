import React, { useState, useEffect, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Avatar,
  Box,
  Popover,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Call as CallIcon,
  ArrowBack,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import getToken from "../../utils/getToken";
import { useParams, useNavigate } from "react-router-dom";
import { clearErrors, getUserDetails } from "../../actions/user";
import { motion, AnimatePresence } from "framer-motion";
import { app as firebaseApp } from "../../firebase";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#3498db",
  color: theme.palette.primary.contrastText,
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const StyledMessageContainer = styled(motion.div)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  overflowY: "auto",
  height: "calc(100vh - 64px - 120px)",
}));

const StyledMessageBubble = styled(motion.div)(({ theme, isCurrentUser }) => ({
  maxWidth: "60%",
  width: "fit-content",
  padding: theme.spacing(2),
  borderTopRightRadius: "20px",
  borderTopLeftRadius: "20px",
  borderBottomRightRadius: isCurrentUser ? "0" : "20px",
  borderBottomLeftRadius: isCurrentUser ? "20px" : "0",
  backgroundColor: isCurrentUser ? "#3498db" : "#f0f0f0",
  color: isCurrentUser ? "white" : "#333",
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1),
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "1px solid #ededed",
  fontSize: "16px",
  "&:hover": {
    boxShadow: theme.shadows[3],
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "85%",
  },
}));

const StyledInputContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const StyledPreviewContainer = styled(motion.div)(({ theme }) => ({
  position: "absolute",
  bottom: "100%",
  left: "0",
  width: "100%",
  padding: theme.spacing(1),
}));

const StyledAttachment = styled(motion.div)(({ theme }) => ({
  position: "relative",
  width: 60,
  height: 60,
  margin: theme.spacing(0, 1, 1, 0),
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[1],
}));

const StyledAttachmentPreview = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const StyledAttachmentRemoveButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  padding: 4,
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledMenuPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPopover-paper": {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
}));

const StyledMenuItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledMenuItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiTypography-root": {
    fontSize: "0.875rem",
  },
}));

const MAX_FILE_COUNT = 3;
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = [
  "image/*",
  ".pdf",
  ".doc",
  ".docx",
  ".mp3",
  ".txt",
  "video/*",
];

interface Message {
  id: string;
  text: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: any;
  updatedAt: any;
  attachments?: { name: string; url: string }[];
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isEditingMessage, setIsEditingMessage] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [referencedMessage, setReferencedMessage] = useState<Message | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatroomId, setChatroomId] = useState<string | null>(null);

  const { user } = useSelector((state: RootState) => state.user);
  const {
    loading: selectedUserLoading,
    user: selectedUser,
    error: selectedUserError,
  } = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    if (username) {
      const authToken = (await getToken()) as string;
      dispatch<any>(
        await getUserDetails(username, authToken || user.accessToken)
      );
    }
  }, [dispatch, username, user?.accessToken]);

  useEffect(() => {
    if (selectedUserError) {
      setErrorMessage(selectedUserError);
      dispatch<any>(clearErrors());
    }
    fetchUser();
  }, [dispatch, fetchUser, selectedUserError]);

  useEffect(() => {
    const getChatroomId = async () => {
      if (user && selectedUser) {
        const db = getFirestore(firebaseApp);
        const chatRoomsRef = collection(db, "chatrooms");
        const q = query(
          chatRoomsRef,
          where("participants", "array-contains", user._id)
        );
        const querySnapshot = await getDocs(q);
        let foundChatroomId = null;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.participants.includes(selectedUser._id)) {
            foundChatroomId = doc.id;
          }
        });
        if (!foundChatroomId) {
          foundChatroomId = [user._id, selectedUser._id].sort().join("|");
        }
        setChatroomId(foundChatroomId);
      }
    };
    getChatroomId();
  }, [user, selectedUser]);

  useEffect(() => {
    if (chatroomId) {
      const messagesRef = collection(
        getFirestore(firebaseApp),
        "chatrooms",
        chatroomId,
        "messages"
      );
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Message)
          )
        );
      });
      return unsubscribe;
    }
  }, [chatroomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    try {
      if ((newMessage.trim() || attachedFiles.length > 0) && chatroomId) {
        setIsLoading(true);
        const messageData: Partial<Message> = {
          text: newMessage.trim(),
          attachments: [],
          sender: {
            _id: user?._id,
            name: user?.username,
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const chatroomRef = doc(
          getFirestore(firebaseApp),
          "chatrooms",
          chatroomId
        );
        const messagesRef = collection(chatroomRef, "messages");

        const newMessageRef = await addDoc(messagesRef, messageData);

        setNewMessage("");

        if (attachedFiles.length) {
          for (const file of attachedFiles) {
            const fileRef = ref(
              getStorage(firebaseApp),
              `chatroom/${chatroomId}/${newMessageRef.id}/${file.name}`
            );
            await uploadBytesResumable(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            messageData.attachments?.push({
              name: file.name,
              url: downloadURL,
            });
          }
          await updateDoc(newMessageRef, {
            attachments: messageData.attachments,
          });
        }

        await updateDoc(chatroomRef, {
          lastMessage: newMessage.trim(),
          lastMessageTimestamp: serverTimestamp(),
          participants: [user?._id, selectedUser?._id],
        });

        setAttachedFiles([]);
        setReferencedMessage(null);
        setIsLoading(false);

        await addDoc(collection(getFirestore(firebaseApp), "notifications"), {
          recipientId: selectedUser?._id,
          senderId: user?._id,
          senderName: user?.username,
          type: "new_message",
          message: newMessage.trim(),
          createdAt: serverTimestamp(),
          isRead: false,
        });
      }
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    if (chatroomId) {
      await updateDoc(
        doc(
          getFirestore(firebaseApp),
          "chatrooms",
          chatroomId,
          "messages",
          messageId
        ),
        {
          text: newText,
          updatedAt: serverTimestamp(),
        }
      );
      setIsEditingMessage(null);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (chatroomId) {
      await deleteDoc(
        doc(
          getFirestore(firebaseApp),
          "chatrooms",
          chatroomId,
          "messages",
          messageId
        )
      );
      setDeletingMessageId(null);
    }
  };

  const handleAttachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      const validFiles = files.filter(
        (file) =>
          ACCEPTED_FILE_TYPES.includes(file.type) &&
          file.size <= MAX_FILE_SIZE_MB * 1024 * 1024
      );

      if (validFiles.length + attachedFiles.length <= MAX_FILE_COUNT) {
        setAttachedFiles([...attachedFiles, ...validFiles]);
      } else {
        setErrorMessage(
          `You can only upload a maximum of ${MAX_FILE_COUNT} files.`
        );
      }
    }
  };

  const handleShareMessage = (message: Message) => {
    setErrorMessage("Sharing message functionality not implemented yet.");
  };

  const handleCall = async () => {
    try {
      const url = `tel:${selectedUser?.phonenumber}`;
      window.location.href = url;
    } catch (error) {
      setErrorMessage("Failed to initiate call. Please try again later.");
    }
  };

  const handleMessageLongPress = (
    event: React.MouseEvent<HTMLDivElement>,
    message: Message
  ) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachedFiles = [...attachedFiles];
    newAttachedFiles.splice(index, 1);
    setAttachedFiles(newAttachedFiles);
  };

  const handleMessageSwipe = (message: Message) => {
    setReferencedMessage(message);
  };

  const handleRemoveReference = () => {
    setReferencedMessage(null);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  return (
    <div>
      <StyledAppBar position="static">
        <StyledToolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack color="#fff" />
          </IconButton>
          <Box
            display="flex"
            alignItems="center"
            onClick={() => navigate(`/profile/${selectedUser?.username}`)}
          >
            <Avatar
              src={selectedUser?.avatar?.url}
              style={{ width: "35px", height: "35px" }}
            />
            <Typography variant="body1" sx={{ ml: 2 }}>
              {selectedUser?.username}
            </Typography>
          </Box>
          <Tooltip title="Call">
            <IconButton color="inherit" onClick={handleCall}>
              <CallIcon />
            </IconButton>
          </Tooltip>
        </StyledToolbar>
      </StyledAppBar>

      <StyledMessageContainer>
        <AnimatePresence>
          {messages.map((message) => (
            <StyledMessageBubble
              key={message.id}
              isCurrentUser={message.sender._id === user?._id}
              onContextMenu={(e) => handleMessageLongPress(e, message)}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -50) {
                  handleMessageSwipe(message);
                }
              }}
            >
              <Typography variant="body1" fontSize={16}>{message.text}</Typography>
              {message.attachments &&
                message.attachments.map((attachment, index) => (
                  <Box key={index} mt={1}>
                    {attachment.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        size="small"
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.name}
                      </Button>
                    )}
                  </Box>
                ))}
              <Typography
                variant="caption"
                sx={{ mt: 1, display: "block", fontSize: "0.7rem" }}
              >
                {message.createdAt &&
                  new Date(message.createdAt)
                    .toUTCString()
                    .slice(3)
                    .replace(`GMT`, ``)
                    .slice(0, -3)}
              </Typography>
            </StyledMessageBubble>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </StyledMessageContainer>

      <StyledInputContainer>
        <AnimatePresence>
          {(attachedFiles.length > 0 || referencedMessage) && (
            <StyledPreviewContainer
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              {referencedMessage && (
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, fontSize: "0.8rem" }}
                  >
                    Replying to: {referencedMessage.text}
                  </Typography>
                  <IconButton size="small" onClick={handleRemoveReference}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              <Box display="flex" flexWrap="wrap">
                {attachedFiles.map((file, index) => (
                  <StyledAttachment
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {file.type.startsWith("image/") ? (
                      <StyledAttachmentPreview
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    ) : (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        bgcolor="grey.200"
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontSize: "0.7rem" }}
                        >
                          {file.name}
                        </Typography>
                      </Box>
                    )}
                    <StyledAttachmentRemoveButton
                      size="small"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </StyledAttachmentRemoveButton>
                  </StyledAttachment>
                ))}
              </Box>
            </StyledPreviewContainer>
          )}
        </AnimatePresence>
        <Box display="flex" alignItems="center">
          <TextField
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            variant="outlined"
            size="small"
            fullWidth
            multiline
            maxRows={4}
            sx={{ mr: 1 }}
          />
          <label htmlFor="attach-file">
            <input
              id="attach-file"
              type="file"
              accept={ACCEPTED_FILE_TYPES.join(", ")}
              multiple
              style={{ display: "none" }}
              onChange={handleAttachFile}
            />
            <Tooltip title="Attach file">
              <IconButton component="span" disabled={isLoading}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          </label>
          <Tooltip title="Send">
            <IconButton onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </StyledInputContainer>

      <StyledMenuPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          {selectedMessage?.sender._id === user?._id && (
            <>
              <StyledMenuItem
                button
                onClick={() => {
                  setIsEditingMessage(selectedMessage.id);
                  handleClosePopover();
                }}
              >
                <StyledMenuItemText primary="Edit" />
              </StyledMenuItem>
              <StyledMenuItem
                button
                onClick={() => {
                  setDeletingMessageId(selectedMessage.id);
                  handleClosePopover();
                }}
              >
                <StyledMenuItemText primary="Delete" />
              </StyledMenuItem>
            </>
          )}
          <StyledMenuItem
            button
            onClick={() => {
              handleShareMessage(selectedMessage!);
              handleClosePopover();
            }}
          >
            <StyledMenuItemText primary="Share" />
          </StyledMenuItem>
        </List>
      </StyledMenuPopover>

      <Dialog
        open={isEditingMessage !== null}
        onClose={() => setIsEditingMessage(null)}
      >
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={4}
            value={messages.find((m) => m.id === isEditingMessage)?.text || ""}
            onChange={(e) => {
              const updatedMessages = messages.map((m) =>
                m.id === isEditingMessage ? { ...m, text: e.target.value } : m
              );
              setMessages(updatedMessages);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditingMessage(null)}>Cancel</Button>
          <Button
            onClick={() => {
              const messageToEdit = messages.find(
                (m) => m.id === isEditingMessage
              );
              if (messageToEdit) {
                handleEditMessage(messageToEdit.id, messageToEdit.text);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deletingMessageId !== null}
        onClose={() => setDeletingMessageId(null)}
      >
        <DialogTitle>Delete Message</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this message?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingMessageId(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={() =>
              deletingMessageId && handleDeleteMessage(deletingMessageId)
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setErrorMessage("")}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ChatRoom;
