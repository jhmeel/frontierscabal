import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArticleDetails, clearErrors } from "../../actions/article";
import SpinLoader from "../../components/loaders/SpinLoader";
import { useParams } from "react-router-dom";
import CustomEditor from "../../components/customTextEditor/CustomTextEditor";
import MarkdownEditor from "../../components/markdownEditor/MarkdownEditor";
import { UPDATE_ARTICLE_RESET } from "../../constants/article";
import toast from "react-hot-toast";
import { RootState } from "../../store";
const UpdateArticlePage = () => {
  const param = useParams();
  const dispatch = useDispatch();

  const {
    loading: detailsLoading,
    article,
    error: detailsError,
  } = useSelector((state:RootState) => state.articleDetails);
  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state:RootState) => state.updateArticle);

  useEffect(() => {
    if (detailsError) {
      toast.error(detailsError);
      dispatch<any>(clearErrors());
    }

    dispatch<any>(getArticleDetails(param.slug));
  }, [dispatch]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch<any>(clearErrors());
    }
    if (message) {
      toast.success(message);
      dispatch({ type: UPDATE_ARTICLE_RESET });
    }
  }, [dispatch, message, updateError]);
  const type = article?.type;
  return (
    <>
      {detailsLoading && <SpinLoader />}
      {type === "Custom" ? (
        <CustomEditor
          artId={article?._id}
          artTitle={article?.title}
          artImage={article?.image?.url}
          artContent={article?.content}
          artCategory={article?.category}
          artTags={article?.tags}
          artSlug={article?.slug}
          artDes={article?.description}
          action="Update"
        />
      ) : (
        <MarkdownEditor
          artId={article?._id}
          artTitle={article?.title}
          artImage={article?.image?.url}
          artContent={article?.content}
          artCategory={article?.category}
          artTags={article?.tags}
          artSlug={article?.slug}
          artDes={article?.description}
          action="Update"
        />
      )}
    </>
  );
};

export default UpdateArticlePage;
