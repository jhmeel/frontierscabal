import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  arrayUnion,
  updateDoc,
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
  Close as CloseIcon,
  AccessTime as ActivityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Alert } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import toast from "react-hot-toast";

const StyledCard = styled(Card)`
  margin: 16px 0;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #ededed;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
  padding: 8px 0;
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
  margin: 5px 0;
  max-width: 90%;
  word-wrap: break-word;
  align-self: flex-start;
`;

const DrawerContainer = styled(Box)`
  background-color: #fff;
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
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
      const shareURL = `${window.location.origin}/discuss-room/${selectedDiscussion.id}`;
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

  const handleJoinDiscussion = async (discussionId: string) => {
    if (currentUser?._id) {
      const discussionRef = doc(db, "discussions", discussionId);
      await updateDoc(discussionRef, {
        participants: arrayUnion(currentUser._id),
        lastActivityAt: new Date(),
      });
      navigate(`/discuss-room/${discussionId}`);
    }
  };

  const handleCreateDiscussion = () => {
    navigate("/discuss/create");
  };

  const isValidDate = (date: string) => {
    return date?.toDate().toLocaleString();
  };
  return (
    <Container maxWidth="md" sx={{paddingTop:2}}>
      <Typography variant="h5" fontWeight={600}>
        Discuss
      </Typography>
      <DiscussionListWrapper>
        <TopBar>
          <SearchBar
            label="Search Discussions"
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
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: "5px" }}
            onClick={handleCreateDiscussion}
          >
            <AddIcon />
          </Button>
        </TopBar>

        {filteredDiscussions.length > 0 ? filteredDiscussions.map((discussion) => (
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
              title={
                <Typography variant="h6" fontSize="1rem">
                  {discussion.title}
                </Typography>
              }
              subheader={
                <Typography variant="subtitle2" color="textSecondary">
                  {`${discussion.participants.length} participant${
                    discussion.participants.length > 1 ? "s" : ""
                  }`}
                  {" • "}
                  <ActivityIcon
                    sx={{ fontSize: "1rem", verticalAlign: "middle" }}
                  />
                  {` ${isValidDate(discussion.lastActivityAt)}`}
                </Typography>
              }
            />

            <CardContent>
              <TagContainer>
                {discussion.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </TagContainer>
              <MessageBubble>
                <Typography variant="body2" color="textPrimary">
                  {discussion.description}
                </Typography>
              </MessageBubble>
            </CardContent>

            <CardActions
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "8px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  if (discussion.participants.includes(currentUser?._id)) {
                    navigate(`/discuss-room/${discussion.id}`);
                  } else {
                    handleJoinDiscussion(discussion.id);
                  }
                }}
              > 
                {discussion.participants.includes(currentUser?._id)
                  ? "View"
                  : "Join"}
              </Button>
            </CardActions>
          </StyledCard>
        )):<Box sx={{
          width:`60%`,
          margin:`0 auto`,
          display:`flex`,
          flexDirection:`column`,
          alignContent:`center`,
          padding:`20px`,
          justifyContent:`center`,

        }}>
          <Typography paddingBottom={2} align="center" variant="body1"> No discuss found!</Typography>
        
        <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: "5px" }}
            onClick={handleCreateDiscussion}
          >Create New
           
          </Button>
        
        </Box>}

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          elevation={1}
        >
          <MenuItem divider onClick={handleDeleteDiscussion}>Delete</MenuItem>
          <MenuItem divider onClick={handleShareDiscussion}>Share</MenuItem>
          <MenuItem onClick={handleReportDiscussion}>Report</MenuItem>
        </Menu>

        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          variant="temporary"
        >
          <DrawerContainer>
            <CloseButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </CloseButton>
            <Typography variant="h6">Report Discussion</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="report-category-label">Category</InputLabel>
              <Select
                labelId="report-category-label"
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                fullWidth
              >
                <MuiMenuItem value="Inappropriate Content">
                  Inappropriate Content
                </MuiMenuItem>
                <MuiMenuItem value="Spam">Spam</MuiMenuItem>
                <MuiMenuItem value="Other">Other</MuiMenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Details"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={submitReport}
              fullWidth
            >
              Submit Report
            </Button>
          </DrawerContainer>
        </Drawer>

        <Snackbar
          open={deleteConfirmationOpen}
          autoHideDuration={3000}
          onClose={() => setDeleteConfirmationOpen(false)}
        >
          <Alert
            onClose={() => setDeleteConfirmationOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Discussion deleted successfully!
          </Alert>
        </Snackbar>
      </DiscussionListWrapper>
    </Container>
  );
};

export default DiscussionList;
