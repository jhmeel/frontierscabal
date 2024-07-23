import React from "react";
import { useState, useEffect } from "react";
import RDotLoader from "../../components/loaders/RDotLoader";
import { useSnackbar } from "notistack";
import MetaData from "../../MetaData";
import { clearErrors, forgotPassword } from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { isOnline } from "../../utils";
import { FORGOT_PASSWORD_RESET } from "../../constants/user";
import styled from "styled-components";
import { IconInfoCircleFill } from "../../assets/icons";
import { RootState } from "../../store";

const ForgotPassword = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const [formData, setFormData] = useState({
    email: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isOnline() && dispatch<any>(forgotPassword(formData.email));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (message) {
      enqueueSnackbar(message, { variant: "info" });
      setFormData({ email: "" });
      dispatch({ type: FORGOT_PASSWORD_RESET });
    }
  }, [dispatch, error, message]);
  return (
    <>
      <MetaData title="Forgot Password" />
      <ForgottenPasswordRenderer>
        <div className="forgot-container">
          <div className="title_container">
            <p className="title">Reset Password</p>

            <div className="info">
              <span>
                <IconInfoCircleFill fill="#125b8c" />
              </span>

              <p>
                Please provide the email address associated with your account
                and we will email you a link to reset your password.
              </p>
            </div>
          </div>
          <br />
          <form className="form-control" onSubmit={handleSubmit}>
            <input
              title="email"
              name="email"
              required={true}
              type="email"
              placeholder="John@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <label>
              <span style={{ transitionDelay: "350ms" }}>E</span>
              <span style={{ transitionDelay: "300ms" }}>-</span>
              <span style={{ transitionDelay: "50ms" }}>M</span>
              <span style={{ transitionDelay: "00ms" }}>A</span>
              <span style={{ transitionDelay: "50ms" }}>I</span>
              <span style={{ transitionDelay: "00ms" }}>L:</span>
            </label>

            <button
              title="Proceed"
              type="submit"
              className="proceed"
              disabled={loading}
            >
              {loading ? <RDotLoader /> : <>Proceed</>}
            </button>
          </form>
        </div>
      </ForgottenPasswordRenderer>
    </>
  );
};

export default ForgotPassword;

const ForgottenPasswordRenderer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  padding: 5px 10px;

  .forgot-container {
    margin: 0 auto;
    max-width: 600px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 10px;
    border-radius: 8px;
    font-family: "Inter", sans-serif;
    border: 1px solid #ededed;
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.12), 0px 2px 4px 0px rgba(0, 0, 0, 0.14);

  }
  .title_container {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
  }
  .title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 1000;
    color: #212121;
    text-align: center;
  }

  .subtitle {
    font-size: 14px;
    text-align: center;
    color: #8b8e98;
  }

  .input_container {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .form-control {
    max-width: 600px;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .form-control input {
    background-color: transparent;
    border: 0;
    border-bottom: 2px solid #176984;
    display: block;
    width: 100%;
    padding: 15px;
    font-size: 18px;
    color: #000;
    z-index: 999;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-bottom-color: #176984;
  }

  .form-control label {
    position: absolute;
    top: 10px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
    color: transparent;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus + label span,
  .form-control input:valid + label span {
    color: #176984;
    transform: translateY(-30px);
  }

  .proceed {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    color: #ffffff;
    font-weight: 700;
    background-color: #177284;
    border-radius: 5px;
    border: none;
    margin-top: 10px;
    cursor: pointer;
  }
  .info {
    margin-bottom: 40px;
    margin-top: 10px;
    padding: 10px;
    background-color: #6fb0bd;
    max-width: 600px;
    width: 90%;
    font-size: 12px;
    border-left: 4px solid #2b8fb6;
  }
  .info p {
    color: #f1f1f1;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
`;
