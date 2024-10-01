import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { USER } from "../../types";
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Chip,
  Box,
  Container,
} from "@mui/material";
import styled from "styled-components";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  height: 100vh;
  margin: 32px auto;
  padding: 32px;
`;

const TagInput = styled(TextField)`
  margin-right: 8px;
`;

const TagContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

interface CreateDiscussionProps {
  currentUser: USER;
}

const CreateDiscussion: React.FC<CreateDiscussionProps> = ({ currentUser }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "discussions"), {
      title,
      description,
      creatorId: currentUser?._id,
      isPrivate,
      isOpen: true,
      participants: [currentUser?._id],
      createdAt: new Date(),
      lastActivityAt: new Date(),
      tags,
    });
    setTitle("");
    setDescription("");
    setIsPrivate(false);
    setTags([]);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Container maxWidth="sm">
      
      <StyledForm onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight={600}>
        Create Discuss
      </Typography>

        <TextField
          label="Discussion Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
        />
        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          }
          label="Private"
        />
        <Box display="flex" alignItems="center">
          <TagInput
            label="Add Tags"
            style={{ marginRight: "5px" }}
            size="small"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <Button
            size="small"
            style={{ fontSize: "12px", border: "none" }}
            onClick={handleAddTag}
            variant="outlined"
          >
            Add Tag
          </Button>
        </Box>
        <TagContainer>
          {tags.map((tag) => (
            <Chip key={tag} label={tag} onDelete={() => handleRemoveTag(tag)} />
          ))}
        </TagContainer>
        <Button type="submit" variant="contained" color="primary">
          Create Discussion
        </Button>
      </StyledForm>
    </Container>
  );
};

export default CreateDiscussion;
