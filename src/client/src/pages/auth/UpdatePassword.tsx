import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import MetaData from "../../MetaData";
import { clearErrors, updatePassword } from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import RDotLoader from "../../components/loaders/RDotLoader";
import { isOnline } from "../../utils";
import { UPDATE_PASSWORD_RESET } from "../../constants/user";
import getToken from "../../utils/getToken";
import styled from "styled-components";
import { RootState } from "../../store";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const { error, isUpdated, loading } = useSelector(
    (state: RootState) => state.profile
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const authToken = await getToken();
    if (formData.newPassword.length < 6) {
      enqueueSnackbar("Password length must be atleast 6 characters", {
        variant: "error",
      });
      return;
    }

    isOnline() && dispatch<any>(updatePassword(authToken, formData));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch<any>(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("Password Updated Successfully", { variant: "success" });
      dispatch({ type: UPDATE_PASSWORD_RESET });
      navigate(`/profile/${user.username}`);
    }
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <>
      <MetaData title="Reset password" />
      <>
        <UpdatePasswordRenderer onSubmit={handleSubmit}>
          <h2>Update Password</h2>
          <div className="up-input_cont">
            <label htmlFor="password">Old password*</label>
            <input
              type="password"
              title="Old password"
              value={formData.oldPassword}
              name="oldPassword"
              required={true}
              onChange={handleChange}
              disabled={loading}
              autoFocus
            />
          </div>
          <div className="up-input_cont">
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
          <button type="submit" className="update_btn" disabled={loading}>
            {loading ? <RDotLoader /> : "Update"}
          </button>
        </UpdatePasswordRenderer>
      </>
    </>
  );
};

export default UpdatePassword;

const UpdatePasswordRenderer = styled.form`
  margin: 0 auto;
  max-width: 600px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  font-family: "Inter", sans-serif;
  position: relative;
  padding: 10px 20px;
  border-radius: 4px;

  h2 {
    font-size: 18px;
    font-weight:1000;
  }
  .up-input_cont {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .up-input_cont label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
  }
  .up-input_cont input {
    width: 100%;
    height: 40px;
    padding: 0 0 0 40px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .up-input_cont input:focus {
    border: 2px solid #176984;
    background-color: transparent;
  }

  .update_btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    border: 0;
    background: #176984;
    border-radius: 4px;
    outline: none;
    color: #fff;
    cursor: pointer;
  }
`;
