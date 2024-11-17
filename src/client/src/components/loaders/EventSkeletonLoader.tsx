import React from "react";
import { Skeleton, Card, Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledSkeletonCard = styled(Card)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 600,
  minWidth:300,
  height: 180,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const SkeletonDateBadge = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(0.5),
}));

const EventSkeletonLoader: React.FC = () => {
  return (
    <StyledSkeletonCard>
  
      <SkeletonDateBadge>
        <Skeleton variant="rectangular" width={40} height={20} />
        <Skeleton variant="rectangular" width={40} height={15} />
      </SkeletonDateBadge>

    
      <Box display="flex" alignItems="center" mb={2}>
        
        <Skeleton variant="circular" width={90} height={90} sx={{ mr: 2 }} />
        <Box flex={1}>
         
          <Skeleton variant="text" width="80%" height={25} />
       
          <Skeleton variant="rectangular" width={90} height={20} />
        </Box>

      
      </Box>

 
      <Box textAlign="center" sx={{margin:`0 auto`}} mt={1}>
        <Skeleton variant="rectangular" width={100} height={20} />
      </Box>
    </StyledSkeletonCard>
  );
};

export default EventSkeletonLoader;
