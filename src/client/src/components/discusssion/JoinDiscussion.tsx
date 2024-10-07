import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { USER, JoinRequest as JoinRequestType }from '../../types';
import { Button, List, ListItem, ListItemText, ListItemSecondaryAction, Typography, Paper } from '@mui/material';
import styled from 'styled-components';
import { arrayUnion } from 'firebase/firestore';

const StyledPaper = styled(Paper)`
  padding: 16px;
  margin: 16px;
  max-width: 600px;
`;

interface JoinRequestProps {
  discussionId: string;
  currentUser: USER;
  isCreator: boolean;
}

const JoinRequest: React.FC<JoinRequestProps> = ({ discussionId, currentUser, isCreator }) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequestType[]>([]);
  const [hasRequestedJoin, setHasRequestedJoin] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'joinRequests'),
      where('discussionId', '==', discussionId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests: JoinRequestType[] = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() } as JoinRequestType);
      });
      setJoinRequests(requests);
      setHasRequestedJoin(requests.some(request => request.userId === currentUser._id && request.status === 'pending'));
    });

    return () => unsubscribe();
  }, [discussionId, currentUser._id]);

  const handleJoinRequest = async () => {
    await addDoc(collection(db, 'joinRequests'), {
      discussionId,
      userId: currentUser._id,
      status: 'pending',
      createdAt: new Date(),
    });
  };

  const handleApproveRequest = async (requestId: string, userId: string) => {
    await updateDoc(doc(db, 'joinRequests', requestId), { status: 'approved' });
    await updateDoc(doc(db, 'discussions', discussionId), {
      participants: arrayUnion(userId)
    });
  };

  const handleRejectRequest = async (requestId: string) => {
    await updateDoc(doc(db, 'joinRequests', requestId), { status: 'rejected' });
  };

  if (isCreator) {
    return (
      <StyledPaper>
        <Typography variant="h6">Join Requests</Typography>
        <List>
          {joinRequests.filter(request => request.status === 'pending').map((request) => (
            <ListItem key={request.id}>
              <ListItemText primary={`User ID: ${request.userId}`} />
              <ListItemSecondaryAction>
                <Button onClick={() => handleApproveRequest(request.id, request.userId)} color="primary">
                  Approve
                </Button>
                <Button onClick={() => handleRejectRequest(request.id)} color="secondary">
                  Reject
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      {hasRequestedJoin ? (
        <Typography>Your join request is pending approval.</Typography>
      ) : (
        <Button onClick={handleJoinRequest} variant="contained" color="primary">
          Request to Join
        </Button>
      )}
    </StyledPaper>
  );
};

export default JoinRequest;


