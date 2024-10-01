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
} from "@mui/material";
import {
  Delete,
  Reply,
  AttachFile,
  Send,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  InsertLink,
  Code,
  ArrowBack,
} from "@mui/icons-material";
import styled from "styled-components";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const StyledDiscussionRoom = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #f0f4f8;
  font-size: 14px;
`;

const MessageList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
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

const MessageBubble = styled(motion.div)(({ isCurrentUser }) => ({
  maxWidth: "60%",
  width: "fit-content",
  padding: "10px",
  borderTopRightRadius: "20px",
  borderTopLeftRadius: "20px",
  borderBottomRightRadius: isCurrentUser ? "0" : "20px",
  borderBottomLeftRadius: isCurrentUser ? "20px" : "0",
  backgroundColor: isCurrentUser ? "#3498db" : "#f0f0f0",
  color: isCurrentUser ? "white" : "#333",
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  marginBottom: "14px",
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "1px solid #ededed",
}));

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const Username = styled(Typography)`
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
`;

const Time = styled(Typography)`
  font-size: 10px;
  color: #888888;
`;

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

  const formatTimestamp = (timestamp: Timestamp | null | undefined) => {
    if (timestamp instanceof Timestamp) {
      return new Date(timestamp.toMillis()).toLocaleString();
    }
    return "Unknown Date";
  };

  const fetchDiscussion = useCallback(async () => {
    try {
      const docRef = doc(db, "discussions", discussionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const discussionData = docSnap.data();
        setDiscussion({
          id: docSnap.id,
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
        if (file) {
          const storageRef = ref(storage, `files/${discussionId}/${file.name}`);
          await uploadBytes(storageRef, file);
          fileUrl = await getDownloadURL(storageRef);
        }

        const messageData: DiscussionMessage = {
          discussionId,
          senderId: currentUser._id,
          senderName: currentUser.username,
          content: newMessage.trim(),
          fileUrl,
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
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await updateDoc(doc(db, "messages", messageId), {
        content: "This message has been deleted",
        updatedAt: serverTimestamp(),
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

  if (loading) {
    return <StyledLoader size={40} />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          style={{ marginTop: "20px" }}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <StyledDiscussionRoom>
      <TopBar>
        <IconButton onClick={() => navigate(-1)} color="inherit">
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h6"
          style={{
            marginLeft: 16,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {discussion?.title || "Discussion"}
        </Typography>
      </TopBar>
      <MessageList>
        {messages.map((message) => (
          <div>
            <MessageBubble
              key={message.id}
              isCurrentUser={message.senderId === currentUser._id}
            >
              {message.replyTo && (
                <Typography
                  variant="caption"
                  style={{ marginBottom: 4, display: "block", color: "#666" }}
                >
                  Replying to:{" "}
                  {messages
                    .find((m) => m.id === message.replyTo)
                    ?.content.substring(0, 30)}
                  ...
                </Typography>
              )}
              <Typography variant="body2">
                {" "}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </Typography>
              {message.fileUrl && (
                <Button
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  style={{ marginTop: 4, padding: 0 }}
                >
                  View Attachment
                </Button>
              )}
              <div style={{ marginTop: 4 }}>
                <IconButton size="small" onClick={() => setReplyTo(message)}>
                  <Reply fontSize="small" />
                </IconButton>
                {message.senderId === currentUser._id && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </div>
            </MessageBubble>
            <UserInfo>
              <Avatar
                sx={{ width: 24, height: 24, fontSize: 12, marginRight: 1 }}
              >
                {message.senderName ? message.senderName[0].toUpperCase() : 'U'}
              </Avatar>
            
              <Time variant="caption">
                {new Date(message.createdAt).toLocaleTimeString()}
              </Time>
            </UserInfo>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <MessageInput>
        {replyTo && (
          <div
            style={{
              padding: 8,
              marginBottom: 8,
              backgroundColor: "#f0f4f8",
              borderRadius: 4,
            }}
          >
            <Typography variant="caption">
              Replying to:{" "}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {replyTo.content.substring(0, 30)}
              </ReactMarkdown>
              ...
            </Typography>
            <IconButton size="small" onClick={() => setReplyTo(null)}>
              <Delete fontSize="small" />
            </IconButton>
          </div>
        )}
        <Toolbar>
          <IconButton size="small" onClick={() => handleFormatText("bold")}>
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleFormatText("italic")}>
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleFormatText("underline")}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleFormatText("link")}>
            <InsertLink fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => handleFormatText("code")}>
            <Code fontSize="small" />
          </IconButton>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <IconButton
            size="small"
            onClick={() => fileInputRef.current?.click()}
          >
            <AttachFile fontSize="small" />
          </IconButton>
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
    </StyledDiscussionRoom>
  );
};

export default DiscussionRoom;
