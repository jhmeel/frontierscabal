import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { clearErrors, loginUser } from "../../actions/user";
import {Visibility, VisibilityOff } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  Button,
  TextField,
  Typography,
  Divider,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { RootState } from "../../store";
import { MailIcon } from "../../assets/icons";
import fcabal from "../../assets/logos/fcabal.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import Div100vh from 'react-div-100vh'
import Config from "../../config/Config";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, error, user } = useSelector(
    (state: RootState) => state.user
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password should be between 6 and 30 characters")
      .max(30, "Password should be between 6 and 30 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch<any>(loginUser(values.email, values.password));
    },
  });


  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    } else if (isAuthenticated && Config.IS_BILLER_ACTIVE && user?.subscriptionDue) {
      enqueueSnackbar(`Logged in successfully!`, { variant: "success" });
      navigate(`/biller`);
    }
    else{
      enqueueSnackbar(`Logged in successfully!`, { variant: "success" });
      navigate(`/profile`);
    }

  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <Div100vh>
    <LoginContainer>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: isMobile ? '90%' : '30%' }}>
      <div className="logo_container">
          <img className="l-logo" src={fcabal} alt="frontierscabal" />
        </div>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Login
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailIcon/>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="Password"
          name="password"
          type={formik.values.isPasswordVisible ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => formik.setFieldValue("isPasswordVisible", !formik.values.isPasswordVisible)}>
                  {formik.values.isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Link to="/password/forgot" style={{ textAlign: 'right',fontSize:'12px', display: 'block', marginBottom: '1rem' }}>
          Forgot Password?
        </Link>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ padding: '10px 20px', marginBottom: '10px' }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
       
        <Typography variant="body2" align="center">
          Don't have an account?{" "}
          <Link to="/signup">
            <span style={{ color: "crimson", fontWeight: 600 }}>Signup</span>
          </Link>
        </Typography>
      </Box>
    </LoginContainer>
    </Div100vh>
  );
};

export default Login;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
`;
const StyledDivider = styled(Divider)`
  margin: 1rem 0;
  width: 100%;
`;