import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import MetaData from "../../MetaData";
import { clearErrors, resetPassword } from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import RDotLoader from "../../components/loaders/RDotLoader";
import { isOnline } from "../../utils";
import styled from "styled-components";
import { RootState } from "../../store";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { error, success, loading } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      enqueueSnackbar("Password length must be atleast 6 characters", {
        variant: "error",
      });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      enqueueSnackbar("Password Doesn't Match", { variant: "error" });
      return;
    }
    isOnline() &&
      dispatch<any>(resetPassword(params.token, formData.newPassword));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Password Updated Successfully", { variant: "success" });
      navigate("/login");
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      <MetaData title="Reset password" />
      <ResetPasswordRenderer>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} className="r-form_container">
          <div className="r-input_cont">
            <label htmlFor="password">New password*</label>
            <input
              type="password"
              title="New password"
              value={formData.newPassword}
              name="newPassword"
              required={true}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="r-input_cont">
            <label htmlFor="password">Confirm password*</label>
            <input
              type="password"
              title="Confirm password"
              value={formData.confirmPassword}
              name="confirmPassword"
              required={true}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
          </div>
          <button title="Reset" className="reset_btn" disabled={loading}>
            {loading ? <RDotLoader /> : "Reset"}
          </button>
        </form>
      </ResetPasswordRenderer>
    </>
  );
};

export default ResetPassword;

const ResetPasswordRenderer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  font-family: "Inter", sans-serif;
  position: relative;
  padding: 10px 20px;

  h2 {
    font-size: 18px;
    font-weight:1000;
  }
  form {
    max-width: 600px;
    width: 90%;
  }
  .r-input_cont {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 10px;
  }

  .r-input_cont label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
  }
  .r-input_cont input {
    width: 100%;
    height: 40px;
    padding: 10px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .r-input_cont input:focus {
    border: 2px solid #176984;
    background-color: transparent;
  }

  .reset_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px 18px;
    border: 0;
    background: #176984;
    border-radius: 24px;
    outline: none;
    color: #fff;
    cursor: pointer;
    margin-top: 10px;
    width:100%;
  }
`;
