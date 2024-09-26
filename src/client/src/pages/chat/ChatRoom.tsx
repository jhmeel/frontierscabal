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
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  DeleteOutline as DeleteIcon,
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
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import getToken from "../../utils/getToken";
import { useParams, useNavigate } from "react-router-dom";
import { clearErrors, getUserDetails } from "../../actions/user";
import { motion, AnimatePresence } from "framer-motion";
import { app as firebaseApp } from "../../firebase";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
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
  borderRadius: "20px",
  backgroundColor: isCurrentUser
    ? theme.palette.primary.main
    : theme.palette.grey[200],
  color: isCurrentUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1),
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease",
  boxShadow: theme.shadows[1],
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
  left:"0",
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

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isEditingMessage, setIsEditingMessage] = useState<any>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  
  const [referencedMessage, setReferencedMessage] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const {
    loading: selectedUserLoading,
    user: selectedUser,
    error: selectedUserError,
  } = useSelector((state: RootState) => state.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    const authToken = (await getToken()) as string;
    let username = param?.username as string;
    username &&
      dispatch<any>(
        await getUserDetails(username, authToken || user.accessToken)
      );
  }, [dispatch, param?.username]);

  useEffect(() => {
    if (selectedUserError) {
      setErrorMessage(selectedUserError);
      dispatch<any>(clearErrors());
    }
    fetchUser();
  }, [dispatch, fetchUser]);

  useEffect(() => {
    if (selectedUser) {
      const messagesRef = collection(
        getFirestore(firebaseApp),
        "chatrooms",
        `RID:${user?._id}|${selectedUser?._id}`,
        "messages"
      );
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
      return unsubscribe;
    }
  }, [selectedUser, user?._id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    try{

    if (newMessage.trim() || attachedFiles.length > 0) {
      const newMessageRef = await addDoc(
        collection(
          getFirestore(firebaseApp),
          "chatrooms",
          `RID:${user?._id}|${selectedUser?._id}`,
          "messages"
        ),
        {
          text: newMessage.trim(),
          attachments: attachedFiles.map((file) => ({
            name: file.name,
            url: "",
          })),
          sender: {
            _id: user?._id,
            name: user?.username,
            avatar: user?.avatar.url,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isRead: false,
          referencedMessage: referencedMessage,
        }
      );

      setNewMessage("");
      setAttachedFiles([]);
      setReferencedMessage(null);

      for (const file of attachedFiles) {
        const fileRef = ref(
          getStorage(firebaseApp),
          `chatroom/${newMessageRef.id}/${file.name}`
        );
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        await updateDoc(newMessageRef, {
          "attachments.$[].url": downloadURL,
        });
      }
    }
  }
  catch(err:any){
    setErrorMessage(err.message)
  }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    await updateDoc(
      doc(
        getFirestore(firebaseApp),
        "chatrooms",
        `RID:${user?._id}|${selectedUser?._id}`,
        "messages",
        messageId
      ),
      {
        text: newText,
        updatedAt: new Date(),
      }
    );
    setIsEditingMessage(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteDoc(
      doc(
        getFirestore(firebaseApp),
        "chatrooms",
        `RID:${user?._id}|${selectedUser?._id}`,
        "messages",
        messageId
      )
    );
    setDeletingMessageId(null);
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
      setAttachedFiles([...attachedFiles, ...Array.from(event.target.files)]);
    }
  };

  const handleShareMessage = (message: any) => {
  
    setErrorMessage("Sharing message:", message);
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
    message: any
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

  const handleMessageSwipe = (message: any) => {
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
            <ArrowBack />
          </IconButton>
          <Box display="flex" alignItems="center">
            <Avatar src={selectedUser?.avatar?.url} />
            <Typography variant="h6" sx={{ ml: 2 }}>
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
              isReferenced={referencedMessage?.id === message.id}
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
              <Typography>{message.text}</Typography>
              {message.attachments.map((attachment: any, index: number) => (
                <div key={index}>
                  {attachment.url ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      width="200"
                    />
                  ) : (
                    <Typography>{attachment.name}</Typography>
                  )}
                </div>
              ))}
              <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            
                {new Date(message.createdAt.toDate()).toLocaleString()}
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
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Replying to: {referencedMessage.text}
                  </Typography>
                  <IconButton size="small" onClick={handleRemoveReference}>
                    <CloseIcon />
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
                        <Typography variant="caption">{file.name}</Typography>
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
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            variant="outlined"
            size="small"
            fullWidth
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
              <IconButton component="span">
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          </label>
          <Tooltip title="Send">
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </StyledInputContainer>

      <Popover
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
              <ListItem
                button
                onClick={() => {
                  setIsEditingMessage(selectedMessage.id);
                  handleClosePopover();
                }}
              >
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setDeletingMessageId(selectedMessage.id);
                  handleClosePopover();
                }}
              >
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItem>
            </>
          )}
          <ListItem
            button
            onClick={() => {
              handleShareMessage(selectedMessage);
              handleClosePopover();
            }}
          >
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="Share" />
          </ListItem>
        </List>
      </Popover>

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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
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
