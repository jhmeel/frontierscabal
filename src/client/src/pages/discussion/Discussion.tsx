import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { DiscussionMessage, USER, Discussion } from "../../types";
import {
  TextField,
  Button,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  Divider,
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
  Delete,
  AttachFile,
  Send,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  InsertLink,
  Code,
  RemoveCircle,
  Download,
  MoreVert,
  Search,
} from "@mui/icons-material";
import styled from "styled-components";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Div100vh from "react-div-100vh";
import { IconArrowLeftfunction } from "../../assets/icons";
import getToken from "../../utils/getToken";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { genRandomColor } from "../../utils";
import SpinLoader from "../../components/loaders/SpinLoader";

const StyledDiscussionRoom = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #ffffff;
  font-size: 14px;
  overflow-x: hidden;
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
  backgroundColor: isDeleted ? "transparent" : "#276168",
  color: isDeleted ? "#888" : `#fff`,
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  marginBottom: "50px",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: isDeleted ? "none" : "1px solid #ededed",
  fontStyle: isDeleted ? "italic" : "normal",
  fontSize: "16px",
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

const StyledLoader = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

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
    maxwidth: 400px;
    padding: 16px;
  }
`;

const ParticipantList = styled(List)`
  .MuiListItem-root {
    padding-left: 0;
    padding-right: 0;
  }
`;

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

    const q = query(
      collection(db, "messages"),
      where("discussionId", "==", discussionId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const messagesData: DiscussionMessage[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
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
          } as DiscussionMessage);
        });

        setMessages(messagesData);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setError("Error fetching messages. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [discussionId, fetchDiscussion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentUser || !currentUser._id) {
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
          discussionId,
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
    message: DiscussionMessage
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
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

  const handleParticipantDrawerToggle = () => {
    setParticipantDrawerOpen((prev) => !prev);
  };

  const [discussionParticipants, setDiscussionParticipants] = useState<USER[]>(
    []
  );

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

  useEffect(() => {
    getParticipants();
  }, []);

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
              ●
              {discussion?.participants.length > 1
                ? ` ${discussion?.participants.length} participants`
                : ` ${discussion?.participants.length} participant`}
            </Typography>
          </Box>
          <IconButton color="#fff" onClick={handleParticipantDrawerToggle}>
            <MoreVert />
          </IconButton>
        </TopBar>
        <MessageList>
          {messages.map((message, index) => {
            const messageDate = message.createdAt.toLocaleDateString();
            const previousMessageDate =
              index > 0
                ? messages[index - 1].createdAt.toLocaleDateString()
                : null;

            const isNewDay = messageDate !== previousMessageDate;

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
                    {new Date(messageDate).toDateString()}
                  </Typography>
                )}
                <div key={message.id}>
                  {!message.isDeleted && (
                    <MessageBubble
                      isCurrentUser={message.senderId === currentUser?._id}
                      isDeleted={message.isDeleted}
                      onDoubleClick={(event) => handleOpenMenu(event, message)}
                    >
                      <UserInfo
                        isCurrentUser={message.senderId === currentUser?._id}
                        isDeleted={message.isDeleted}
                      >
                        <Username variant="caption" color={genRandomColor()}>
                          {message.senderName}
                        </Username>
                      </UserInfo>

                      {message.replyTo && (
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
                      {!message.isDeleted && (
                        <Typography variant="body1" color="#fff" fontSize={16}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            style={{ color: "white !important" }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </Typography>
                      )}
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
                          backgroundColor: genRandomColor(),
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
                    </MessageBubble>
                  )}
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
                borderLeft: `4px solid ${genRandomColor()}`,
              }}
            >
              <Typography variant="caption">
                <h5 style={{ color: genRandomColor() }}>
                  {replyTo.senderName}
                </h5>
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
                      onClick={(event) =>
                        handleOpenMenu(event, participant?._id)
                      }
                    >
                      <MoreVert />
                    </IconButton>
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            ))}
          </ParticipantList>
        </ParticipantDrawer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              borderRadius: "8px",
            },
          }}
        >
          <MenuItem onClick={() => handleMenuAction("reply")} divider>
            Reply
          </MenuItem>
          {selectedMessage?.fileUrl && (
            <MenuItem onClick={() => handleMenuAction("download")} divider>
              Download File
            </MenuItem>
          )}
          {selectedMessage?.senderId === currentUser._id && (
            <MenuItem onClick={() => handleMenuAction("delete")}>
              Delete
            </MenuItem>
          )}
        </Menu>
      </StyledDiscussionRoom>
    </Div100vh>
  );
};

export default DiscussionRoom;
