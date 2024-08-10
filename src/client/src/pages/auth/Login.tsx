import { useState, useEffect } from "react";
import {
  IconEyeSlashFill,
  IconEyeFill,
  MailIcon,
  PasswordIcon,
  ErrorIcon,
} from "../../assets/icons";
import fcabal from "../../assets/logos/fcabal.png";
import RDotLoader from "../../components/loaders/RDotLoader";
import MetaData from "../../MetaData";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loginUser } from "../../actions/user";
import { Link, useNavigate } from "react-router-dom";
import LocalForageProvider from "../../utils/localforage";
import { isOnline } from "../../utils";
import getToken from "../../utils/getToken";
import styled from "styled-components";
import { RootState } from "../../store";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState("");

  const { loading, isAuthenticated, error, user } = useSelector(
    (state:RootState) => state.user
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const setToken = async () => {
      const t: string = await getToken();
      setAuthToken(t);
    };
    setToken();
  }, [isAuthenticated, user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors: { email?: string; password?: string } = {};

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
    }

    // Validate password
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6 || formData.password.length > 30) {
      errors.password = "Password should be between 6 and 30 characters";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0 && isOnline()) {
      dispatch<any>(loginUser(formData.email, formData.password));
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    } else if (
      isAuthenticated &&
      !LocalForageProvider.getItem("FC:USER:INTERESTS")
    ) {
      enqueueSnackbar(`You are successfully logged in!`, {
        variant: "success",
      });
      navigate(`/personalize`);
    } else if (isAuthenticated && authToken !== "") {
      navigate(`/profile/${user?.username}`);
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <>
      <MetaData title="Login" />
      <FormContainer onSubmit={handleSubmit}>
        <div className="logo_container">
          <img className="l-logo" src={fcabal} alt="frontierscabal" />
        </div>
        <p className="create-an-account">
          Do not have an account?
          <Link to="/signup">
            &nbsp;
            <span style={{ color: "crimson", fontWeight: "600" }}>Signup</span>
          </Link>
        </p>
        <div className="title_container">
          <p className="title">Login to your Account</p>
          <span className="subtitle">
            Back to join the frontiers?, login into your account and enjoy the
            experience.
          </span>
        </div>
        <br />
        <div className="input_container">
          <label className="input_label" htmlFor="email_field">
            E-mail<span className="required">*</span>
          </label>
          <MailIcon className="icon" />
          <input
            placeholder="name@mail.com"
            value={formData.email}
            onChange={handleChange}
            title="email"
            name="email"
            type="email"
            className="input_field"
            id="email_field"
            disabled={loading}
            autoFocus
          />
        </div>
        {formErrors.email && (
          <div className="error-message">
            <ErrorIcon className="login-errmsg-icon" />
            &nbsp;{formErrors.email}
          </div>
        )}
        <div className="input_container">
          <label className="input_label" htmlFor="password_field">
            Password<span className="required">*</span>
          </label>
          <PasswordIcon className="icon" />
          <input
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            title="password"
            name="password"
            type={!isPasswordVisible ? "password" : "text"}
            className="input_field"
            id="password_field"
            disabled={loading}
          />
          <span>
            {isPasswordVisible ? (
              <IconEyeSlashFill
                className="p-visibility"
                onClick={togglePasswordVisibility}
              />
            ) : (
              <IconEyeFill
                className="p-visibility"
                onClick={togglePasswordVisibility}
              />
            )}
          </span>
        </div>
        {formErrors.password && (
          <div className="error-message">
            <ErrorIcon className="login-errmsg-icon" />
            &nbsp;{formErrors.password}
          </div>
        )}
        <Link to="/password/forgot">
          <p className="pswrd-frgt">Forgotten Password?</p>
        </Link>
        <button
          title="Login In"
          type="submit"
          className="login-in_btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <RDotLoader />
            </>
          ) : (
            <span>Login</span>
          )}
        </button>
        <Link to="/terms-of-service">
          <p className="note">Terms of use &amp; Conditions</p>
        </Link>
      </FormContainer>
    </>
  );
};

export default Login;

const FormContainer = styled.form`
  margin: 0 auto;
  max-width: 600px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 50px 40px 20px 40px;
  background-color: #ffffff;
  border-radius: 11px;
  font-family: "Inter", sans-serif;
  position: relative;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px 0px rgba(0, 0, 0, 0.14);
  .required{
    color:crimson;
  }
  .logo_container {
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    background: linear-gradient(
      180deg,
      rgba(248, 248, 248, 0) 50%,
      #f8f8f888 100%
    );
    border: 1px solid #f7f7f8;
    filter: drop-shadow(0px 0.5px 0.5px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .l-logo {
    width: 120px;
    height: auto;
  }

  .title_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #212121;
  }

  .subtitle {
    font-size: 0.725rem;
    max-width: 80%;
    text-align: center;
    line-height: 1.1rem;
    color: #8b8e98;
  }

  .input_container {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .icon {
    width: 20px;
    position: absolute;
    z-index: 99;
    left: 12px;
    bottom: 14px;
  }

  .input_label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
  }

  #email_field,
  #password_field {
    width: auto;
    height: 44px;
    padding: 0 0 0 40px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  #email_field:focus {
    border: 2px solid #176984;
    background-color: transparent;
  }
  #password_field:focus {
    border: 2px solid #176984;
    background-color: transparent;
  }

  .login-in_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    border: 0;
    padding: 10px 20px;
    background: #176984;
    border-radius: 24px;
    outline: none;
    color: #fff;
    cursor: pointer;
  }
  .login-in_btn span {
    color: #fff;
    font-weight: 600;
  }

  
  .note {
    font-size: 0.75rem;
    color: #8b8e98;
    text-decoration: underline;
  }
  .error-message {
    color: crimson;
    font-size: 12px;
    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    display: flex;
    align-items: center;
  }

  .p-visibility {
    position: absolute;
    cursor: pointer;
    right: 10%;
    top: 50%;
  }
  .login-errmsg-icon {
    height: 18px;
    width: 18px;
    fill: crimson;
  }

  .create-an-account {
    position: absolute;
    right: 10px;
    top: 20px;
    font-size: 12px;
  }
  .pswrd-frgt {
    font-size: 12px;
    color: crimson;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
`;
