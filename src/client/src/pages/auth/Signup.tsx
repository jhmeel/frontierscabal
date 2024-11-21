import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import {
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { clearErrors, registerUser } from "../../actions/user";
import { isOnline } from "../../utils";
import getToken from "../../utils/getToken";
import { RootState } from "../../store";
import MetaData from "../../MetaData";
import RDotLoader from "../../components/loaders/RDotLoader";
import fcabal from "../../assets/logos/fcabal.png";

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;

const StyledDivider = styled(Divider)`
  margin: 1rem 0;
  width: 100%;
`;

const Logo = styled.img`
  max-width: 150px;
  margin-bottom: 1rem;
`;

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username should be at least 3 characters")
    .max(15, "Username should not exceed 15 characters"),
  phonenumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{11}$/, "Please enter a valid 11-digit phone number"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password should be at least 6 characters")
    .max(30, "Password should not exceed 30 characters"),
});

const Signup: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { loading, isAuthenticated, user:currentUser, error } = useSelector(
    (state: RootState) => state.user
  );

  const [showPassword, setShowPassword] = useState(false);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const setToken = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    setToken();
  }, [isAuthenticated]);

  const formik = useFormik({
    initialValues: {
      username: "",
      phonenumber: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (isOnline()) {
        dispatch<any>(registerUser(values));
      } else {
        enqueueSnackbar("No internet connection", { variant: "error" });
      }
    },
  });


  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (isAuthenticated) {
      enqueueSnackbar("Signed up successfully!", { variant: "success" });
      navigate("/personalize");
    }
  },[dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      <MetaData title="Signup" />
      <FormContainer>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: isMobile ? "90%" : "30%" }}
        >
          <div className="logo_container">
            <img className="l-logo" src={fcabal} alt="frontierscabal" />
          </div>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Sign up
          </Typography>
          <TextField
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            disabled={loading}
            margin="normal"
            autoFocus
          />
          <TextField
            fullWidth
            id="phonenumber"
            name="phonenumber"
            label="Phone Number"
            value={formik.values.phonenumber}
            onChange={formik.handleChange}
            error={
              formik.touched.phonenumber && Boolean(formik.errors.phonenumber)
            }
            helperText={formik.touched.phonenumber && formik.errors.phonenumber}
            disabled={loading}
            margin="normal"
          />
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
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            disabled={loading}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <StyledButton
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <RDotLoader /> : "Sign Up"}
          </StyledButton>
          <Box mt={2}>
            <Typography variant="body2" align="center">
              Already have an account?{" "}
              <a style={{ color: "crimson", fontWeight: 600 }} href="/#/login">
                Log in
              </a>
            </Typography>
          </Box>
        
          <Box mt={2}>
            <Typography variant="body2" align="center">
              By clicking sign up, you agree to our{" "}
              <a
                style={{ color: "crimson", fontWeight: 600 }}
                href="/#/terms-of-service"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                style={{ color: "crimson", fontWeight: 600 }}
                href="/#/privacy-policy"
              >
                Privacy Policy
              </a>
              .
            </Typography>
          </Box>
        </Box>
      </FormContainer>
    </>
  );
};

export default Signup;
