import React,{useEffect} from "react";
import styled,{ThemeProvider} from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { IconRemoveFill } from "../../assets/icons";
import emptyImage from "../../assets/images/empty_avatar.png";
import getToken from "../../utils/getToken";
import { deleteReply, clearErrors } from "../../actions/article";
import { DELETE_REPLY_RESET } from "../../constants/article";
import { Link } from "react-router-dom";
import SpinLoader from "../loaders/SpinLoader";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";



const ReplyItem = ({
  articleId,
  commentId,
  replyId,
  replyerName,
  replyerPic,
  replyText,
  date,
}) => {
  const { user } = useSelector((state:any) => state.user);
  const dispatch = useDispatch();
  const {theme} = useSelector((state:any)=> state.theme)
  const {
    error: deleteReplyError,
    loading: deleteReplyLoading,
    success: deleteReplySuccess,
  } = useSelector((state:any) => state.deleteReply);

  useEffect(() => {
    if (deleteReplyError) {
      toast.error('Error while deleting your reply... try again');
      dispatch<any>(clearErrors());
    }
    if (deleteReplySuccess) {
      toast.success('Deleted successfully');
      dispatch({ type: DELETE_REPLY_RESET });
      window.location.reload()
    }
  }, [dispatch, deleteReplyError, deleteReplySuccess]);


  
  const removeReply = async () => {
    const authToken = await getToken();
    enqueueSnackbar(`"Are you sure you want to remove your reply?`, {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button className="snackbar-btn"  onClick={() => {
                toast.dismiss("confirmation-toast");
                dispatch<any>(deleteReply(authToken, articleId, commentId, replyId))
              }}
            >
            Proceed
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            No
          </button>
        </>
      ),
    });
  
  };
  return (
    <>
    <ThemeProvider theme={theme}>
    {deleteReplyLoading && <SpinLoader/>}
        <ReplyItemRenderer>
        <div className="reply-item-header">
          {(user?.username === replyerName || user?.role === 'FC:SUPER:ADMIN') && (
            <span
              title="remove"
              className="reply-rmv-icon"
              onClick={removeReply}
            >
              <IconRemoveFill />
            </span>
          )}
          <div className="user-pic-holder">
            <div className="user-pic">
              <img src={replyerPic||emptyImage} alt={replyerName} />
            </div>
          </div>

          <div className="reply-user-info">
            <Link to={`/profile/${replyerName}`}><span className="replyer-name">{`@${replyerName}`}</span></Link>
            <p className="reply-date">{moment(date).fromNow()}</p>
          </div>
        </div>
        <p className="reply-content">
          {replyText} </p>
          <div className="reply-footer"></div>
        </ReplyItemRenderer>
    </ThemeProvider>
    
    </>
  );
};

export default ReplyItem;
const ReplyItemRenderer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 100%;
    overflow: hidden;
    height: fit-content;
    min-height: 70px;
    border: 1px solid #ededed;
    padding: 10px 20px;
    margin-top: 5px;
    border-radius: 5px;
  .reply-item-header {
    width: 100%;
  }
  .reply-user-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .reply-content {
    width: 100%;
    margin: 5px;
    font-size: 14px;
    color: #6e6e6e;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
    text-align:start;
  }
  .replyer-name {
    font-size: 12px;
    font-weight: 700;
    color: #176984;
  }
  .reply-date {
    font-size: 12px;
    font-weight: 700;
    color: #6e6e6e;
  }
  .reply-rmv-icon{
    position: absolute;
    height: 20px;
    width: 20px;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
`
