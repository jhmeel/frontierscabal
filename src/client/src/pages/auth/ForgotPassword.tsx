import React from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import {
  Button,
  TextField,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Container,
  InputAdornment,
} from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import MetaData from "../../MetaData";
import { clearErrors, forgotPassword } from "../../actions/user";
import { FORGOT_PASSWORD_RESET } from "../../constants/user";
import { isOnline } from "../../utils";
import { RootState } from "../../store";
import { IconInfoCircleFill } from "../../assets/icons";
import RDotLoader from "../../components/loaders/RDotLoader";

const ForgottenPasswordContainer = styled(Container)`
  display: flex;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 2rem 0;
`;

const ForgottenPasswordPaper = styled(Paper)`
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
`;

const InfoBox = styled(Box)`
  background: #ededed;
  padding: 1rem;
  border-left: 4px solid #2b8fb6;
  margin-bottom: 1.5rem;
  border-radius: 12px;
`;

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
});

const ForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { error, message, loading } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (isOnline()) {
        dispatch<any>(forgotPassword(values.email));
      } else {
        enqueueSnackbar("No internet connection", { variant: "error" });
      }
    },
  });

  React.useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (message) {
      enqueueSnackbar(message, { variant: "info" });
      formik.resetForm();
      dispatch({ type: FORGOT_PASSWORD_RESET });
    }
  }, [dispatch, error, message, formik, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Forgot Password" />
      <ForgottenPasswordContainer>
        <ForgottenPasswordPaper>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={800}>
              Reset Password
            </Typography>
            <InfoBox>
              <Box display="flex" alignItems="center">
                <IconInfoCircleFill fontSize={20} fill="#004271" />
                <Typography style={{fontSize:"12px"}} color="textSecondary" ml={1}>
                  Please provide the email address associated with your account
                  and we will email you a link to reset your password.
                </Typography>
              </Box>
            </InfoBox>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={loading}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ padding: "10px 20px", marginTop: "1rem" }}
            >
              {loading ? <RDotLoader /> : "Proceed"}
            </Button>
          </form>
        </ForgottenPasswordPaper>
      </ForgottenPasswordContainer>
    </>
  );
};

export default ForgotPassword;
