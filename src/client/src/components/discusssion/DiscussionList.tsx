import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Chip,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Drawer,
  TextField,
  Select,
  MenuItem as MuiMenuItem,
  InputLabel,
  FormControl,
  Box,
  Container,
} from "@mui/material";
import { db } from "../../firebase";
import { Discussion, USER } from "../../types";
import {
  Lock,
  Public,
  MoreVert,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Alert } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import toast from "react-hot-toast";

const StyledCard = styled(Card)`
  margin: 16px 0;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
  padding: 16px 0;
`;

const SearchBar = styled(TextField)`
  flex-grow: 1;
  margin-right: 16px;
`;

const DiscussionListWrapper = styled.div`
  padding: 16px 0;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const MessageBubble = styled.div`
  background-color: #e3f2fd;
  border-radius: 20px;
  padding: 12px 18px;
  margin: 10px 0;
  max-width: 90%;
  word-wrap: break-word;
  align-self: flex-start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface DiscussionListProps {
  currentUser: USER;
}

const DiscussionList: React.FC<DiscussionListProps> = ({ currentUser }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<Discussion[]>(
    []
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "discussions"),
      orderBy("lastActivityAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const discussionsData: Discussion[] = [];
      querySnapshot.forEach((doc) => {
        discussionsData.push({ id: doc.id, ...doc.data() } as Discussion);
      });
      setDiscussions(discussionsData);
      setFilteredDiscussions(discussionsData);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    discussion: Discussion
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedDiscussion(discussion);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedDiscussion(null);
  };

  const handleDeleteDiscussion = async () => {
    if (
      selectedDiscussion &&
      selectedDiscussion.creatorId === currentUser?._id
    ) {
      await deleteDoc(doc(db, "discussions", selectedDiscussion.id));
      setDeleteConfirmationOpen(true);
    }
    handleMenuClose();
  };

  const handleShareDiscussion = () => {
    if (selectedDiscussion) {
      const shareURL = `${window.location.origin}/discuss/${selectedDiscussion.id}`;
      navigator.clipboard.writeText(shareURL);
      toast.success("Discussion link copied to clipboard");
    }
    handleMenuClose();
  };

  const handleReportDiscussion = () => {
    setDrawerOpen(true);
    handleMenuClose();
  };

  const submitReport = async () => {
    if (selectedDiscussion && reportCategory && reportDetails) {
      const reportData = {
        discussionId: selectedDiscussion.id,
        reporterId: currentUser._id,
        reportCategory,
        reportDetails,
        reportedAt: new Date(),
      };

      await addDoc(collection(db, "reports"), reportData);
      setReportCategory("");
      setReportDetails("");
      setDrawerOpen(false);

      toast.success("Report submitted successfully");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    const searchQuery = e.target.value.toLowerCase();
    const filtered = discussions.filter(
      (discussion) =>
        discussion.title.toLowerCase().includes(searchQuery) ||
        discussion.description.toLowerCase().includes(searchQuery) ||
        discussion.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    );
    setFilteredDiscussions(filtered);
  };

  const handleCreateDiscussion = () => {
    navigate("/discuss/create");
  };
  const isValidDate = (date) => {
    const d = new Date(date).getTime();
    if (!isNaN(d)) {
      new Date(date).toLocaleDateString()
    }
    return ''
  };
  return (
    <Container maxWidth="md">
      <DiscussionListWrapper>
        <TopBar>
          <SearchBar
            label="Search Discussions"
            variant="outlined"
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
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "5px" }}
            onClick={handleCreateDiscussion}
          >
            <AddIcon />
          </Button>
        </TopBar>

        {filteredDiscussions.map((discussion) => (
          <StyledCard key={discussion.id}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    bgcolor: discussion.isPrivate
                      ? "secondary.main"
                      : "primary.main",
                  }}
                >
                  {discussion.isPrivate ? <Lock /> : <Public />}
                </Avatar>
              }
              action={
                discussion.creatorId === currentUser?._id && (
                  <IconButton onClick={(e) => handleMenuOpen(e, discussion)}>
                    <MoreVert />
                  </IconButton>
                )
              }
              title={<Typography variant="h6">{discussion.title}</Typography>}
              subheader={
                <Typography variant="subtitle2" color="textSecondary">
                  {`${discussion.participants.length} participant${
                    discussion.participants.length > 1 ? "s" : ""
                  } •  ${isValidDate(discussion.lastActivityAt)}`}
                </Typography>
              }
            />

            <CardContent>
              <MessageBubble>
                <Typography variant="body1" color="textPrimary">
                  {discussion.description}
                </Typography>
              </MessageBubble>
              <TagContainer>
                {discussion.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </TagContainer>
            </CardContent>

            <CardActions>
              <Button
                component={Link}
                to={`/discuss/${discussion.id}`}
                variant="contained"
                color="primary"
                fullWidth
              >
                {discussion.participants.includes(currentUser?._id)
                  ? "View Discussion"
                  : "Join Discussion"}
              </Button>
            </CardActions>

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              {discussion.creatorId === currentUser?._id && (
                <MenuItem onClick={handleDeleteDiscussion}>
                  Delete Discussion
                </MenuItem>
              )}
              <MenuItem onClick={handleReportDiscussion}>
                Report Discussion
              </MenuItem>
              <MenuItem onClick={handleShareDiscussion}>
                Share Discussion
              </MenuItem>
            </Menu>
          </StyledCard>
        ))}

        <Snackbar
          open={deleteConfirmationOpen}
          autoHideDuration={6000}
          onClose={() => setDeleteConfirmationOpen(false)}
        >
          <Alert
            severity="success"
            onClose={() => setDeleteConfirmationOpen(false)}
          >
            Discussion deleted successfully!
          </Alert>
        </Snackbar>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box padding={3} width={350}>
            <Typography variant="h6" gutterBottom>
              Report Discussion
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value as string)}
              >
                <MuiMenuItem value="Spam">Spam</MuiMenuItem>
                <MuiMenuItem value="Harassment">Harassment</MuiMenuItem>
                <MuiMenuItem value="Inappropriate Content">
                  Inappropriate Content
                </MuiMenuItem>
                <MuiMenuItem value="Other">Other</MuiMenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Details"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={submitReport}
              disabled={!reportCategory || !reportDetails}
            >
              Submit Report
            </Button>
          </Box>
        </Drawer>
      </DiscussionListWrapper>
    </Container>
  );
};

export default DiscussionList;
