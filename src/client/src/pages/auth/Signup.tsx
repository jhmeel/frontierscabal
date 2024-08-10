import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { IconEyeSlashFill, IconEyeFill, ErrorIcon } from "../../assets/icons";
import MetaData from "../../MetaData";
import { Link, useNavigate } from "react-router-dom";
import fcabal from "../../assets/logos/fcabal.png";
import RDotLoader from "../../components/loaders/RDotLoader";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, registerUser } from "../../actions/user";
import { useSnackbar } from "notistack";
import { isOnline } from "../../utils";
import getToken from "../../utils/getToken";
import styled from "styled-components";
import { RootState } from "../../store";

interface FormData {
  username: string;
  phonenumber: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState<string>("");
  const { loading, isAuthenticated, user, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const setToken = async () => {
      const t: string = await getToken();
      setAuthToken(t);
    };
    setToken();
  }, [isAuthenticated, user]);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    phonenumber: "",
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [formErrors, setFormErrors] = useState<{
    username?: string;
    phone?: string;
    email?: string;
    password?: string;
  }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: {
      username?: string;
      phone?: string;
      email?: string;
      password?: string;
    } = {};

    // Validate username
    if (!formData.username) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3 || formData.username.length > 15) {
      errors.username = "Username should be between 3 and 15 characters";
    }
    // Validate Phone
    if (!formData.phonenumber) {
      errors.phone = "Phone is required";
    } else if (formData.phonenumber.length !== 11) {
      errors.phone = "Please enter a valid Phonenumber";
    }

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
      dispatch<any>(registerUser(formData));
    }
  };

  const sendNotification = () => {
    const showNotification = () => {
      const bc = new BroadcastChannel("push-channel");
      bc.postMessage({
        type: "push-notification",
        message: {
          _id: "FC:5RhgfTYUjhgfdRTYULKJHgfrtyuKJHgffKKJH",
          user: user?.username,
          type: "NEW:USER",
          slug: "/profile/edit",
          message: `We are thrilled to have you on board. To enhance your experience\n
          update your profile.`,
          date: Date.now(),
        },
      });
    };

    showNotification();
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (isAuthenticated === true && authToken !== "") {
      enqueueSnackbar(`Signed up successfully!`, {
        variant: "success",
      });
      sendNotification();
      navigate(`/personalize`);
    }
  }, [dispatch, error, user, navigate]);

  return (
    <>
      <MetaData title="Signup" />
      <FormContainer onSubmit={handleSubmit}>
        <div className="logo_container">
          <img className="l-logo" src={fcabal} alt="frontierscabal" />
        </div>
        <p className="already-have-account">
          Already have an account?<Link to="/login">&nbsp;Login</Link>
        </p>
        <div className="title_container">
          <p className="title">Create an Account</p>
          <span className="subtitle">
            Ready to join the frontiers?, just create an account and enjoy the
            experience.
          </span>
        </div>
        <br />
        <div className="input_container">
          <label className="input_label" htmlFor="username">
            Username<span className="required">*</span>
          </label>
          <input
            title="username"
            type="text"
            id="username"
            placeholder="John Doe"
            name="username"
            value={formData.username}
            className="input_field "
            autoFocus
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {formErrors.username && (
          <div className="error-message">
            <ErrorIcon className="signup-errmsg-icon" />
            &nbsp;{formErrors.username}
          </div>
        )}
        <div className="input_container">
          <label className="input_label" htmlFor="Phone">
            Phone<span className="required">*</span>
          </label>
          <input
            title="phone"
            type="tel"
            id="phone"
            placeholder="Your whatsapp number"
            name="phonenumber"
            className="input_field"
            value={formData.phonenumber}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {formErrors.phone && (
          <div className="error-message">
            <ErrorIcon className="signup-errmsg-icon" />
            &nbsp;{formErrors.phone}
          </div>
        )}
        <div className="input_container">
          <label className="input_label" htmlFor="email">
            E-mail<span className="required">*</span>
          </label>
          <input
            title="email"
            type="email"
            id="email"
            placeholder="John@gmail.com"
            name="email"
            className="input_field"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        {formErrors.email && (
          <div className="error-message">
            <ErrorIcon className="signup-errmsg-icon" />
            &nbsp;{formErrors.email}
          </div>
        )}
        <div className="input_container">
          <label className="input_label" htmlFor="password">
            Password<span className="required">*</span>
          </label>
          <input
            title="password"
            type={!isPasswordVisible ? "password" : "text"}
            id="password"
            name="password"
            className="input_field"
            placeholder="Input a strong password"
            value={formData.password}
            onChange={handleChange}
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
            <ErrorIcon className="signup-errmsg-icon" />
            &nbsp;{formErrors.password}
          </div>
        )}
        <button className="signup_btn" type="submit" disabled={loading}>
          {loading ? (
            <>
              <RDotLoader />
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="terms">
          By clicking "Signup", you agree to our
          <Link to="/privacy-policy"> Privacy Policy</Link> and our
          <Link to="/terms-of-service"> Terms of service.</Link>
        </p>
      </FormContainer>
    </>
  );
};
export default Signup;

const FormContainer = styled.form`
  margin: 0 auto;
  max-width: 600px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 50px 40px 20px 40px;
  background-color: #fff;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.12),
    0px 2px 4px 0px rgba(0, 0, 0, 0.14);
  font-family: "Inter", sans-serif;
  position: relative;
  border-radius: 5px;

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
    bottom: 9px;
  }

  .input_label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
  }

  .input_field {
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

  .input_field:focus {
    border: 2px solid #176984;
    background-color: transparent;
  }

  .signup_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    padding: 10px 20px;
    border: 0;
    background: #176984;
    border-radius: 24px;
    outline: none;
    color: #fff;
    cursor: pointer;
  }
  .signup_btn span {
    color: #fff;
  }
  .login-in_btn span {
    color: #fff;
    font-weight: 600;
  }
  a {
    text-decoration: none;
    color: crimson;
  }

  .note {
    font-size: 0.75rem;
    color: #8b8e98;
    text-decoration: underline;
  }
  .error-message {
    color: crimson;
    font-size: 12px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    display: flex;
    align-items: center;
  }

  .signup-errmsg-icon {
    height: 18px;
    width: 18px;
    fill: crimson;
  }

  .terms {
    font-size: 12px;
  }
  .terms a {
    color: crimson;
  }
  .p-visibility {
    position: absolute;
    cursor: pointer;
    right: 10%;
    top: 50%;
  }

  .already-have-account {
    position: absolute;
    right: 10px;
    top: 20px;
    font-size: 12px;
  }
  .required {
    color: crimson;
  }
`;
