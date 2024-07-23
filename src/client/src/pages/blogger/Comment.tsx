import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  IconArrowLeftfunction,
  IconBxsCommentDetail,
  IconChevronLeft,
} from "../../assets/icons";
import { addComment, clearErrors } from "../../actions/article";
import { NEW_COMMENT_RESET } from "../../constants/article";
import CommentItem from "../../components/commentItem/CommentItem";
import RDotLoader from "../../components/loaders/RDotLoader";
import getToken from "../../utils/getToken";
import { FormattedCount } from "../../utils";
import { useNavigate } from "react-router-dom";
import emptyAvatar from "../../assets/images/empty_avatar.png";
import toast from "react-hot-toast";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import { RootState } from "../../store";

const Comment = ({
  username,
  article,
  comments,
  remover,
}: {
  username: string;
  article: any;
  comments: any;
  remover: () => void;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector(
    (state: RootState) => state.newComment
  );
  const [comment, setComment] = useState("");
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch<any>(clearErrors());
    }
    if (success) {
      toast.success("Comment added");
      dispatch({ type: NEW_COMMENT_RESET });
      window.location.reload();
    }
  }, [dispatch, success, error, toast]);

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
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
  const handleComment = async () => {
    const authToken = await getToken();
    if (!authToken) {
      showAuthDialogue();
      return;
    }
    dispatch<any>(addComment(authToken, article?._id, comment));
  };

  return (
    <>
      <CommentRenderer>
        <span title="back" className="back" onClick={() => remover()}>
          <IconChevronLeft />| back
        </span>
        <h3 className="comment-title">
          <IconBxsCommentDetail fill="gray" /> Comments
          <span className="comment-count">
            ({FormattedCount(comments?.length)})
          </span>
        </h3>
        <div className="comment-cont">
          <div className="comment-list">
            {comments?.length > 0 &&
              comments.map((comment: any, i: number) => (
                <CommentItem
                  key={i}
                  articleId={article._id}
                  commentId={comment._id}
                  ownersName={article?.postedBy?.username}
                  commenterName={comment?.user?.username}
                  commenterPic={comment?.user.avatar?.url}
                  date={comment.comment[0]?.date}
                  comment={comment.comment[0]?.commentText}
                  replies={comment.comment[0]?.replies}
                />
              ))}
          </div>
        </div>
        <div className="comment-textarea-holder">
          <div className="comment-commenter-avatar">
            <img src={user?.avatar?.url || emptyAvatar} />
          </div>
          <textarea
            placeholder="Leave a comment..."
            value={comment}
            onChange={handleCommentChange}
            autoFocus={true}
          ></textarea>

          {comment && (
            <button
              type="submit"
              className="comment-send-btn"
              title="Post"
              onClick={handleComment}
              disabled={loading}
            >
              {loading ? <RDotLoader /> : <span title="Comment">Post</span>}
            </button>
          )}
        </div>
      </CommentRenderer>
    </>
  );
};

export default Comment;

const CommentRenderer = styled.div`
  width: 100%;
  height: 300px;
  padding: 10px 20px;
  position: relative;
  z-index: 999;
  background: rgb(212, 205, 205, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  -moz-backdrop-filter: blur(10px);
  -o-backdrop-filter: blur(10px);
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.2);
  transform: 0.5s;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  align-items: center;

  .comment-title {
    position: fixed;
    z-index: 99;
    color: gray;
    display: flex;
    align-items: center;
  }
  .comment-cont {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 25px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-bottom: 80px;
  }

  .comment-textarea-holder {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    align-self: center;
    position: fixed;
    bottom: 0;
    z-index: 999;
    padding: 10px 5px;
    background-color: rgb(3, 82, 128);
  }

  .comment-commenter-avatar img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  .comment-textarea-holder textarea {
    border: none;
    padding-left: 20px;
    max-height: 100px;
    width: 600px;
    font-size: medium;
    background-color: transparent;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
  .comment-textarea-holder textarea::placeholder {
    color: gray;
    font-size: medium;
  }
  .comment-textarea-holder textarea:focus {
    outline: none;
  }

  .comment-count {
    font-size: 16px;
    color: gray;
  }
  .comment-send-btn {
    padding: 6px 12px;
    background-color: #05222c;
    color: #176984;
    border-radius: 4px;
    border: none;
    margin: 10px;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .comment-send-btn span {
    color: #ffffff;
    font-weight: 600;
  }
  .comment-list {
    flex: 80%;
    width: 100%;
    height: fit-content;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px 10px;
    gap: 20px;
  }

  .back {
    position: absolute;
    top: 10%;
    left: 5px;
    padding: 5px 10px;
    border: 1px solid #ededed;
    border-radius: 5px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    cursor: pointer;
    z-index: 99;
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

  @media (max-width: 767px) {
    .comment-cont {
      max-width: 600px;
    }
    .comment-textarea-holder textarea {
      width: 340px;
    }
  }
`;
