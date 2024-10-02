import React, { useEffect, useState } from "react";
import { ModuleItem } from "../../components/moduleItem/ModuleItem";
import { useSnackbar } from "notistack";
import axiosInstance from "../../utils/axiosInstance";
import { IconVideoTwentyFour } from "../../assets/icons";
import Footer from "../../components/footer/Footer";
import ModuleItemSkeletonLoader from "../../components/loaders/ModuleItemSkeletonLoader";
import { isOnline } from "../../utils";
import { IModule } from "../../types";
import { styled } from "@mui/system";
import { Box, Button, Grid, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from "react-router-dom";

const ModuleList: React.FC = (): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const [modules, setModules] = useState<Array<IModule> | null>(null);
  const [moduleErr, setModuleErr] = useState<any>(null);
  const navigate = useNavigate();

  const handleCreateModule = () => {
    navigate('/module/new');  
  };

  useEffect(() => {
    const getModules = async () => {
      try {
        const { data } = await axiosInstance().get(`/api/v1/modules`);
        setModules(data?.modules);
      } catch (err: any) {
        enqueueSnackbar(err.message, { variant: "error" });
        setModuleErr(err);
      }
    };

    isOnline() && getModules();
  }, [moduleErr]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, background: '#f7f7f7', boxShadow: 1 }}>
        <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconVideoTwentyFour /> Modules
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCreateModule}
        >
          Create Module
        </Button>
      </Box>

      <ModuleRenderer container spacing={2}>
        {modules?.length
          ? modules.map((mod: any, i: number) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <ModuleItem
                  _id={mod?._id}
                  title={mod?.title}
                  description={mod?.description}
                  banner={mod?.avatar?.secureUrl}
                />
              </Grid>
            ))
          : Array(10)
              .fill(null)
              .map((_, i: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <ModuleItemSkeletonLoader />
                </Grid>
              ))}
      </ModuleRenderer>

      <Footer />
    </>
  );
};

export default ModuleList;


const ModuleRenderer = styled(Grid)({
  width: '100%',
  marginTop: '16px',
  paddingBottom: '150px',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  "@media (max-width: 767px)": {
    flexDirection: 'column',
    paddingBottom: '100px',
  },
});
