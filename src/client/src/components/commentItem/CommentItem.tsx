import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  IconCaretDown,
  IconMinutemailer,
  IconRemoveFill,
} from "../../assets/icons";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  deleteComment,
  addCommentReply,
  clearErrors,
} from "../../actions/article";
import getToken from "../../utils/getToken";
import { useDispatch } from "react-redux";
import {
  DELETE_COMMENT_RESET,
  NEW_COMMENT_REPLY_RESET,
} from "../../constants/article";
import { FormattedCount } from "../../utils/formatter";
import emptyImage from "../../assets/images/empty_avatar.png";
import ReplyItem from "../replyItem/ReplyItem";
import RDotLoader from "../loaders/RDotLoader";
import SpinLoader from "../loaders/SpinLoader";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";

const CommentItem = ({
  articleId,
  commentId,
  ownersName,
  commenterName,
  commenterPic,
  date,
  comment,
  replies,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [showReply, setShowReply] = useState(false);
  const [replyInputedText, setReplyInputedText] = useState("");
  const {
    error: deleteCommentError,
    loading: deleteCommentLoading,
    success: deleteCommentSuccess,
  } = useSelector((state: RootState) => state.deleteComment);
  const { theme } = useSelector((state: RootState) => state.theme);
  const {
    error: replyError,
    loading: replyLoading,
    success: replySuccess,
  } = useSelector((state: RootState) => state.newCommentReply);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (replyError) {
      toast.error("Error, try again...");
      dispatch<any>(clearErrors());
    }
    if (replySuccess) {
      toast.success("Replied successfully!");
      dispatch({ type: NEW_COMMENT_REPLY_RESET });
      window.location.reload();
    }
  }, [dispatch, replyError, replySuccess]);

  useEffect(() => {
    if (deleteCommentError) {
      toast.error("Error while deleting your comment... try again");
      dispatch<any>(clearErrors());
    }
    if (deleteCommentSuccess) {
      toast.success("Comment deleted!");
      dispatch({ type: DELETE_COMMENT_RESET });
      window.location.reload();
    }
  }, [dispatch, deleteCommentError, deleteCommentSuccess, toast]);

  const showAuthDialogue = () => {
    enqueueSnackbar("Please signup to complete your action!", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button
            className="snackbar-btn"
            onClick={() => {
              closeSnackbar();
              navigate("/signup");
            }}
          >
            Signup
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            Cancel
          </button>
        </>
      ),
    });
  };
  const removeComment = async () => {
    const authToken = await getToken();
    enqueueSnackbar("Are you sure you want to remove your comment?", {
      variant: "info",
      persist: true,
      action: (key) => (
        <>
          <button
            className="snackbar-btn"
            onClick={() =>
              dispatch<any>(deleteComment(authToken, articleId, commentId))
            }
          >
            Proceed
          </button>
          <button className="snackbar-btn" onClick={() => closeSnackbar()}>
            cancle
          </button>
        </>
      ),
    });
  };

  const handleShowReply = () => {
    setShowReply(!showReply);
  };
  const handleReplyTextChange = (e) => {
    setReplyInputedText(e.target.value);
  };
  const handleReply = async () => {
    const authToken = await getToken();
    if (!authToken) {
      showAuthDialogue();
      return;
    }
    dispatch<any>(
      addCommentReply(authToken, articleId, commentId, replyInputedText)
    );
  };
  return (
    <>

        <CommentItemRenderer>
          {deleteCommentLoading && <SpinLoader />}
          <div className="comment-container">
            {user?.username === commenterName ||
            user?.role === "FC:SUPER:ADMIN" ? (
              <span
                title="remove"
                className="comment-rmv-icon"
                onClick={removeComment}
              >
                <IconRemoveFill />
              </span>
            ) : (
              commenterName === ownersName && (
                <span className="comm-owner-tag">Author</span>
              )
            )}
            <div className="user-pic-holder">
              <div className="user-pic">
                <img src={commenterPic || emptyImage} alt={commenterName} />
              </div>
              <div className="user-info">
                <Link to={`/profile/${commenterName}`}>
                  <span className="commenter-name">{`@${commenterName}`}</span>
                </Link>
                <p className="comment-date">{moment(date).fromNow()}</p>
              </div>
            </div>
            <p className="comment-content">{comment}</p>
          </div>
          <div className="comment-footer">
            <span className="comment-reply-txt" onClick={handleShowReply}>
              {`${FormattedCount(replies?.length) || ""} ${
                replies?.length > 1 ? "replies" : "reply"
              }`}
              <IconCaretDown />
            </span>
          </div>
          {showReply && (
            <div className="replies">
              <div className="reply-header">
                <h3 className="reply-hd-txt">
                  {replies?.length >= 1 && "Replies"}
                </h3>
              </div>
              <div className="reply-holder">
                {replies?.length > 0 &&
                  replies.map((rep, i) => (
                    <ReplyItem
                      articleId={articleId}
                      commentId={commentId}
                      replyId={rep?._id}
                      replyerName={rep?.user.username}
                      replyerPic={rep?.user.avatar?.url || emptyImage}
                      date={rep?.date}
                      replyText={rep?.replyText}
                      key={i}
                    />
                  ))}
              </div>
              <div className="textarea-holder">
                <input
                  title="Reply"
                  className="reply-text-area"
                  onChange={handleReplyTextChange}
                  placeholder={`replying to @${commenterName}`}
                  autoFocus={true}
                />
                {replyInputedText && (
                  <button
                    type="submit"
                    className="add-rply-btn"
                    onClick={handleReply}
                  >
                    {replyLoading ? (
                      <RDotLoader />
                    ) : (
                      <span title="Reply">
                        <IconMinutemailer fill="#fff" />
                        &nbsp;Reply
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </CommentItemRenderer>
    </>
  );
};

export default CommentItem;
const CommentItemRenderer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  max-width: 600px;
  min-width: 550px;
  overflow: hidden;
  height: fit-content;
  border: 1px solid #ededed;
  padding: 6px 20px;
  margin-top: 5px;
  border-radius: 8px;
  background-color: #fff;
  @media (max-width: 767px) {
    & {
      min-width: 330px;
      max-width: 400px;
    }
  }
  .comment-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
  }
  .user-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .user-pic {
    width: 38px;
    height: 38px;
    position: relative;
    border-radius: 50%;
    border: 1px solid #176984;
  }
  .user-pic img {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    height: 100%;
    width: 100%;
  }
  .commenter-name {
    font-size: 12px;
    font-weight: 700;
    color: #176984;
  }
  .comment-date {
    font-weight: 700;
    font-size: 10px;
    color: #6e6e6e;
  }

  .comment-content {
    font-size: 14px;
    width: 100%;
    text-align: start;
    color: #6e6e6e;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
      sans-serif;
    margin-bottom: 10px;
  }
  .comment-rmv-icon {
    position: absolute;
    height: 20px;
    width: 20px;
    top: 5px;
    right: 10px;
    cursor: pointer;
  }
  .comm-owner-tag {
    width: fit-content;
    height: fit-content;
    padding: 3px 6px;
    align-self: flex-end;
    cursor: pointer;
    background-color: #176984;
    color: #fff;
    border-radius: 5px;
    font-size: 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
  .comment-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .reply-text-area:focus {
    outline: none;
  }
  .comment-reply-txt {
    font-size: 14px;
    cursor: pointer;
    font-weight: 700;
    color: black;
  }
  .replies {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    position: relative;
  }
  .reply-holder {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    max-height: 320px;
    overflow-y: scroll;
  }

  .textarea-holder {
    width: 100%;
    padding: 10px;
  }
  .reply-text-area {
    border: none;
    padding: 10px;
    background-color: transparent;
    color: #000;
    width: 100%;
    height: 30px;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .add-rply-btn {
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #176984;
    color: #fff;
    font-size: 12px;
    border: none;
    margin-top: 5px;
    cursor: pointer;
    transition: 0.3s ease-out;
  }
  .add-rply-btn:hover {
    transform: scale(1.02);
  }
  .add-rply-btn span {
    color: #fff;
  }

  .snackbar-btn {
    padding: 6px 12px;
    color: #000;
    border: none;
    border-radius: 5px;
    margin-right: 5px;
    cursor: pointer;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
`;
