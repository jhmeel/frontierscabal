import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { DiscussionMessage, USER, Discussion } from '../../types';
import { 
  TextField, Button, List, ListItem, IconButton, Typography, Paper, Avatar, 
  CircularProgress, Divider, Chip, Dialog, DialogTitle, DialogContent, 
  DialogActions, Menu, MenuItem, Tooltip
} from '@mui/material';
import { 
  Delete, Reply, AttachFile, Send, ArrowBack, MoreVert, 
  ThumbUp, ThumbDown, EmojiEmotions
} from '@mui/icons-material';
import styled from 'styled-components';
import { format } from 'date-fns';

const StyledDiscussionRoom = styled(Paper)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 100%;
  margin: 0 auto;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
`;

const MessageList = styled(List)`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #ffffff;
`;

const MessageInput = styled.div`
  display: flex;
  padding: 16px;
  background-color: #f5f5f5;
  align-items: center;
`;

const StyledMessage = styled(ListItem)<{ isCurrentUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isCurrentUser ? 'flex-end' : 'flex-start')};
  margin-bottom: 16px;
`;

const MessageContent = styled(Paper)<{ isCurrentUser: boolean }>`
  padding: 12px 16px;
  background-color: ${props => (props.isCurrentUser ? '#e3f2fd' : '#f5f5f5')};
  border-radius: 16px;
  max-width: 70%;
`;

const MessageActions = styled.div`
  display: flex;
  margin-top: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Username = styled(Typography)`
  margin-left: 8px;
  font-weight: bold;
`;

const Time = styled(Typography)`
  margin-left: 8px;
  color: #757575;
`;

const StyledLoader = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

interface DiscussionRoomProps {
  currentUser: USER;
}

const DiscussionRoom: React.FC<DiscussionRoomProps> = ({ currentUser }) => {
  const { discussionId } = useParams<{ discussionId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<DiscussionMessage | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportedMessage, setReportedMessage] = useState<DiscussionMessage | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<DiscussionMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);


  const formatTimestamp = (timestamp: Timestamp | null | undefined) => {
    if (timestamp instanceof Timestamp) {
      return format(timestamp.toDate(), 'MMM d, yyyy HH:mm');
    }
    return 'Unknown Date';
  };

 const fetchDiscussion = useCallback(async () => {
    try {
      const docRef = doc(db, 'discussions', discussionId);  
      const docSnap = await getDoc(docRef); 
  
      if (docSnap.exists()) {
        const discussionData = docSnap.data();
        setDiscussion({ 
          id: docSnap.id, 
          ...discussionData, 
          lastActivityAt: discussionData.lastActivityAt instanceof Timestamp 
            ? discussionData.lastActivityAt.toDate() 
            : new Date()
        } as Discussion); 
      } else {
        console.error('Discussion not found');
      }
    } catch (error) {
      console.error('Error fetching discussion:', error);  
    }
  }, [discussionId]);
  
  useEffect(() => {
    fetchDiscussion();
    
    const q = query(
      collection(db, 'messages'),
      where('discussionId', '==', discussionId),
      orderBy('createdAt')
    );
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: DiscussionMessage[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        messagesData.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
        } as DiscussionMessage);
      });
  
      setMessages(messagesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [discussionId, fetchDiscussion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentUser || !currentUser._id) {
      setError("User information is not available. Please try logging in again.");
      return;
    }

    if (newMessage.trim() || file) {
      try {
        let fileUrl = '';
        if (file) {
          const storageRef = ref(storage, `files/${discussionId}/${file.name}`);
          await uploadBytes(storageRef, file);
          fileUrl = await getDownloadURL(storageRef);
        }

        const messageData = {
          discussionId,
          senderId: currentUser._id,
          content: newMessage.trim(),
          fileUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          reactions: {},
          replyTo: replyTo ? replyTo.id : null,
        };

        await addDoc(collection(db, 'messages'), messageData);
        await updateDoc(doc(db, 'discussions', discussionId), {
          lastActivityAt: serverTimestamp(),
        });

        setNewMessage('');
        setFile(null);
        setReplyTo(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    await updateDoc(doc(db, 'messages', messageId), { 
      content: 'This message has been deleted',
      updatedAt: serverTimestamp(),
    });
    handleMenuClose();
  };

  const handleReportMessage = (message: DiscussionMessage) => {
    setReportedMessage(message);
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleSubmitReport = async () => {
    if (reportedMessage && reportReason) {
      await addDoc(collection(db, 'reports'), {
        messageId: reportedMessage.id,
        reporterId: currentUser._id,
        reason: reportReason,
        createdAt: serverTimestamp(),
      });
      setReportDialogOpen(false);
      setReportedMessage(null);
      setReportReason('');
    }
  };

  const handleReaction = async (messageId: string, reaction: 'like' | 'dislike') => {
    const messageRef = doc(db, 'messages', messageId);
    const messageDoc = await getDoc(messageRef);
    const currentReactions = messageDoc.data()?.reactions || {};
    
    if (currentReactions[currentUser._id] === reaction) {
      delete currentReactions[currentUser._id];
    } else {
      currentReactions[currentUser._id] = reaction;
    }

    await updateDoc(messageRef, { reactions: currentReactions });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, message: DiscussionMessage) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMessage(null);
  };

  if (!discussion || loading) {
    return <StyledLoader />;
  }

  return (
    <StyledDiscussionRoom elevation={3}>
      <TopBar>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <div>
          <Typography variant="h5">{discussion.title}</Typography>
          
        </div>
      </TopBar>
      <Divider />
      <MessageList>
        {messages.map((message) => (
          <StyledMessage key={message.id} isCurrentUser={message.senderId === currentUser._id}>
            <UserInfo>
              <Avatar>{message.senderId[0]}</Avatar>
              <Username variant="body2">{message.senderId}</Username>
              <Time variant="caption">
                {formatTimestamp(message.createdAt)}
              </Time>
            </UserInfo>
            {message.replyTo && (
              <Typography variant="caption" style={{ marginBottom: 8 }}>
                Replying to: {messages.find(m => m.id === message.replyTo)?.content.substring(0, 50)}...
              </Typography>
            )}
            <MessageContent isCurrentUser={message.senderId === currentUser._id}>
              <Typography variant="body1">{message.content}</Typography>
              {message.fileUrl && (
                <Button href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                  View Attachment
                </Button>
              )}
            </MessageContent>
            <MessageActions>
              <Tooltip title="Like">
                <IconButton onClick={() => handleReaction(message.id, 'like')}>
                  <ThumbUp color={message.reactions[currentUser._id] === 'like' ? 'primary' : 'inherit'} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dislike">
                <IconButton onClick={() => handleReaction(message.id, 'dislike')}>
                  <ThumbDown color={message.reactions[currentUser._id] === 'dislike' ? 'primary' : 'inherit'} />
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => setReplyTo(message)}>
                <Reply />
              </IconButton>
              <IconButton onClick={(e) => handleMenuOpen(e, message)}>
                <MoreVert />
              </IconButton>
            </MessageActions>
          </StyledMessage>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <Divider />
      {replyTo && (
        <Paper style={{ padding: 8, margin: 8, backgroundColor: '#e8eaf6' }}>
          <Typography variant="body2">
            Replying to: {replyTo.content.substring(0, 50)}...
          </Typography>
          <IconButton size="small" onClick={() => setReplyTo(null)}>
            <Delete fontSize="small" />
          </IconButton>
        </Paper>
      )}
      <MessageInput>
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <AttachFile />
        </IconButton>
        <IconButton>
          <EmojiEmotions />
        </IconButton>
        <Button
          variant="contained"
          color="primary"
          endIcon={<Send />}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </MessageInput>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {selectedMessage?.senderId === currentUser._id && (
          <MenuItem onClick={() => handleDeleteMessage(selectedMessage.id)}>Delete</MenuItem>
        )}
        <MenuItem onClick={() => handleReportMessage(selectedMessage!)}>Report</MenuItem>
      </Menu>

      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Report Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for reporting"
            type="text"
            fullWidth
            variant="outlined"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitReport} color="primary">Submit Report</Button>
        </DialogActions>
      </Dialog>
    </StyledDiscussionRoom>
  );
};

export default DiscussionRoom;