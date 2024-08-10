import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Previewer from "../previewer/Previewer";
import {
  IconArticleFill,
  IconCaretDown,
  IconChevronLeft,
  IconDeleteForeverOutline,
} from "../../assets/icons";
import RDotLoader from "../loaders/RDotLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewArticle,
  clearErrors,
  updateArticle,
} from "../../actions/article";
import getToken from "../../utils/getToken";
import { isOnline } from "../../utils";
import { NEW_ARTICLE_RESET, UPDATE_ARTICLE_RESET } from "../../constants/article";
import LocalForageProvider from "../../utils/localforage";
import IRCache from "../../utils/cache";
import styled from "styled-components";
import { RootState } from "../../store";

const MarkdownEditor: React.FC<{
  artId: string;
  artTitle: string;
  artImage: string;
  artContent: string;
  artCategory: string;
  artTags: string;
  artSlug: string;
  artDes: string;
  action?:'New'|'Update';
}> = ({
  artId,
  artTitle,
  artImage,
  artContent,
  artCategory,
  artTags,
  artSlug,
  artDes,
  action = "New",
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [metaDetails, setMetaDetails] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [metaVisible, setMetaVisible] = useState(false);
  const [markdownText, setMarkdownText] = useState("");
  const [headerImage, setHeaderImage] = useState<string>("");
  const [preview, setPreview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [optionVisible, setIsOptionVisible] = useState(false);


  const {
    error: articlePublishError,
    success,
    loading,
    article,
  } = useSelector((state:RootState) => state.newArticle);

  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state:RootState) => state.updateArticle);

  const backUPToCache = () => {
    if (
      metaDetails.title ||
      markdownText ||
      metaDetails.tags ||
      preview ||
      metaDetails.description ||
      selectedCategory ||
      headerImage
    ) {
      new IRCache(LocalForageProvider).save("FC:IRCACHE:EDITOR",{
        type: "MARKDOWN",
        title: metaDetails.title,
        content: markdownText,
        description: metaDetails.description,
        selectedCategory,
        image: headerImage,
        preview,
        tags: metaDetails.tags,
      });
    }
  };

  useEffect(() => {
    backUPToCache();
  }, [metaDetails.title, markdownText, metaDetails.description, selectedCategory, preview, metaDetails.tags, headerImage]);

  useEffect(() => {
    let restore = async () => {
      let res = await new IRCache(LocalForageProvider).restorePreviousSession("FC:IRCACHE:EDITOR");
      if (res && res.type === "MARKDOWN") {
        setMetaDetails((prevState) => ({
          ...prevState,
          title: res.title,
          description: res?.description,
          tags: res?.tags,
        }));
        setHeaderImage(res?.image);
        setPreview(res?.preview)
        setMarkdownText(res?.content);
        setSelectedCategory(res?.selectedCategory);;
      }
    };

    action === "New" && restore();
  }, []);

  useEffect(() => {
    if (artTitle && artImage && artContent && artCategory && artDes) {
      setMetaDetails((prevState) => ({
        ...prevState,
        title: artTitle,
        description: artDes,
        tags: artTags,
      }));
      setHeaderImage(artImage);
      setMarkdownText(artContent);
      setSelectedCategory(artCategory);
    }
  }, [artTitle, artImage, artContent, artCategory, artDes, artTags]);

  

  const handleMetaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetaDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (updateError) {
      toast.error(updateError);
      dispatch<any>(clearErrors());
    }
    if (message) {
      new IRCache(LocalForageProvider).clear("FC:IRCACHE:EDITOR");
      dispatch({ type: UPDATE_ARTICLE_RESET });
      toast.success(message);
      navigate(`/blog/article/${artSlug}`);
    }
  }, [dispatch, toast, updateError, message]);

  const toggleOptionVisible = () => {
    setIsOptionVisible(!optionVisible);
  };

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    toggleOptionVisible();
  };

  const handleFileChange = (event:ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setMarkdownText(event.target.result as string);
      };
      reader.readAsText(file);
    }
  };
  const handleInputChange = (event:ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(event.target.value);
  };

  const handleImageUpload = (event:ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    // Validate file type as an image
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(file.type)) {
     toast.error("Please upload a valid image file (JPEG, PNG, or GIF).");
      return;
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 << 20; // 5MB
    if (file.size > maxSizeInBytes) {
     toast(
        "Please upload an image file with a maximum size of 3MB.",
      
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setHeaderImage(reader.result as string);
      }
    };

    reader.readAsDataURL(file);
  };

  const handlePreview = () => {
    setPreview(!preview);
  };
  const handleHeaderImageRemove = () => {
    setHeaderImage("");
  };
  const handlePublish = (e:React.FormEvent) => {
    e.preventDefault();
    setMetaVisible(true);
  };

    /**
   * @dev submit and publish new article if action is New or update article if otherwise
   */
  const handleMetaDetailSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const authToken = await getToken();
    if (
      metaDetails.description.split(" ").length < 10 ||
      metaDetails.description.split(" ").length > 100
    ) {
     toast.error(
        "Please your description should not be less than 10 words or exceed 100 words",
      
      );
      return;
    }
    if (!selectedCategory) {
     toast.error("Please select a category for your article");
      return;
    } else if (!headerImage) {
     toast.error("Please select an image for your article");
      return;
    }
    const formData = new FormData();
    formData.append("title", metaDetails.title);
    formData.append("description", metaDetails.description);
    formData.append("tags", metaDetails.tags);
    formData.append("content", markdownText);
    formData.append("category", selectedCategory);
    formData.append("image", headerImage);
    formData.append("type", "Markdown");
    {
      action === "New" && isOnline()
        ? dispatch<any>(addNewArticle(authToken, formData))
        : isOnline() && dispatch<any>(updateArticle(authToken, artId, formData));
    }
  };

  useEffect(() => {
    if (articlePublishError) {
     toast.error(articlePublishError);
      dispatch<any>(clearErrors());
    }
    if (success) {
      new IRCache(LocalForageProvider).clear("FC:IRCACHE:EDITOR");
      dispatch({ type: NEW_ARTICLE_RESET });
     toast.success("Article published successfully!");
      navigate(`/blog/article/${article?.slug}`);
    }
  }, [dispatch, articlePublishError, success, navigate]);

  const optionRef = useRef(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (optionRef.current && !optionRef.current.contains(e.target as Node)) {
      setIsOptionVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
    {preview ? (
      <>
        <Previewer
          img={headerImage}
          content={markdownText}
          removeFunc={handlePreview}
        />
      </>
    ) : (
      <MarkdownEditorRenderer>
        <div className="editor-header">
          {headerImage && (
            <span title="Remove">
              <IconDeleteForeverOutline
                className="rmv-hd-image-icon"
                onClick={handleHeaderImageRemove}
              />
            </span>
          )}
          {markdownText && (
            <button
              className="pre-btn"
              onClick={handlePreview}
              title="Preview"
            >
              Preview
            </button>
          )}
          {headerImage ? (
            <img
              src={headerImage}
              loading="lazy"
              draggable={false}
              alt=""
              className="e-hd-img"
            />
          ) : (
            <div className="e-header-img-holder">
              <label htmlFor="image-upload" title="Upload">
                Click to Upload Header Image (Recommended size: 1200x250px)
              </label>
              <input
                className="e-hd-img-input"
                id="image-upload"
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>
        <div className="e-textarea-holder">
          <textarea
            className="e-textarea"
            value={markdownText}
            onChange={handleInputChange}
            placeholder="Write your article in Markdown..."
            autoFocus
          />
          {markdownText ? (
            <button
              type="submit"
              className="pub-btn"
              title="Publish"
              onClick={handlePublish}
            >
              {action === "New" ? "Publish" : "Republish"}
            </button>
          ) : (
            <>
              <label
                htmlFor="md-file-selector"
                className="md-file-selector-label"
              >
                {file ? (
                  file.name
                ) : (
                  <>
                    <IconArticleFill className="e-upload-md-icon" />
                    &nbsp; Or Upload A Markdown
                  </>
                )}{" "}
              </label>
              <input
                type="file"
                className="md-file-selector"
                id="md-file-selector"
                accept=".md"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </MarkdownEditorRenderer>
    )}

    {metaVisible && (
      <MarkdownEditorFormMetaData>
      <span
            title="back"
            className="back"
            onClick={() => setMetaVisible(false)}
          >
            <IconChevronLeft />| back
          </span>
        <form
          className="e-art-form"
          onSubmit={handleMetaDetailSubmit}
          encType="multipart/form-data"
        >
          <div className="e-meta-input-container">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              name="title"
              placeholder="Your article title"
              value={metaDetails.title}
              required={true}
              title="Title"
              autoFocus={true}
              onChange={handleMetaInputChange}
              disabled={loading}
            />
          </div>
          <div className="e-meta-input-container">
            <label htmlFor="description">Description*</label>
            <textarea
              name="description"
              value={metaDetails.description}
              placeholder="Description of your article, not more than 100 words, for Search engine optimization"
              required={true}
              title="Description"
              onChange={handleMetaInputChange}
              disabled={loading}
            ></textarea>
          </div>
          <div className="e-meta-input-container">
            <label htmlFor="title">Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="Tech, Science, Finance"
              value={metaDetails.tags}
              title="Tags"
              autoFocus={true}
              onChange={handleMetaInputChange}
              disabled={loading}
            />
          </div>
          <div className="e-art-category" ref={optionRef}>
            <span className="e-art-selected-catg" title="Categories">
              {selectedCategory}
            </span>
            <span className="catg-toggle-icon" onClick={toggleOptionVisible}>
              {!selectedCategory && "Select a category"}
            </span>
            <IconCaretDown
              className="catg-toggle-icon"
              onClick={toggleOptionVisible}
            />

            {optionVisible && (
              <div className="e-art-categories-menu">
                <ul className="e-art-categories-menu-options">
                  {[
                    "Tech",
                    "Science",
                    "News",
                    "Education",
                    "Personal Dev",
                    "Fiction",
                    "Finance",
                    "Fashion",
                    "Culture",
                    "Food",
                    "History",
                    "Music",
                    "Lifestyle",
                    "Business",
                    "Religion",
                    "Sport",
                    "Movies",
                  ]
                    .sort()
                    .map((opt) => (
                      <li
                        key={opt}
                        onClick={() => handleSelectedCategory(opt)}
                      >
                        {opt}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="submit-art-meta"
            disabled={loading || updateLoading}
          >
            {loading || updateLoading ? (
              <RDotLoader />
            ) : action === "New" ? (
              "Submit"
            ) : (
              "Update"
            )}
          </button>
        </form>
      </MarkdownEditorFormMetaData>
    )}
  </>
  );
};

export default MarkdownEditor;


const MarkdownEditorRenderer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

.editor-header {
  width: 100%;
  height: fit-content;
  margin: 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #ccc;
  padding-bottom: 5px;
}
.e-hd-img-input {
  display: none;
}
.e-hd-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  padding: 6px;
}
.e-header-img-holder label {
  font-size: 11px;
  font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
    font-family: "Inter", sans-serif;
  cursor: pointer;
}
.pre-btn {
  padding: 8px 16px;
  border: none;
  background-color: #176984;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.e-textarea-holder {
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.e-textarea {
  border: none;
  padding: 15px 0px 0px 15px;
  height: 100%;
  width: 100%;
  font-size: 16px;
  border-bottom: 1px solid #ccc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.e-textarea:focus {
  border: none;
  outline: none;
}
.pub-btn {
  padding: 8px 16px;
  border-radius: 5px;
  background-color: #176984;
  color: #fff;
  font-size: 14px;
  border: none;
  margin-top: 5px;
  cursor: pointer;
  transition: 0.3s ease-out;
}
.pub-btn:hover {
  transform: scale(1.02);
}
.rmv-hd-image-icon {
  position: absolute;
  height: 26px;
  width: 26px;
  background-color: #fff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  fill: red;
  padding: 5px;
  left: 10px;
  cursor: pointer;
}

.md-file-selector {
  display: none;
}
.md-file-selector-label {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #176984;
  color: #fff;
  font-size: 14px;
  border: none;
  margin-top: 5px;
  cursor: pointer;
  transition: 0.3s ease-out;
}
.md-file-selector-label:hover {
  transform: scale(1.02);
}
.e-upload-md-icon {
  height: 20px;
  width: 20px;
  fill: #ccc;
}

`


const MarkdownEditorFormMetaData = styled.div`
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;


.e-meta-input-container {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
}

.e-art-form {
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 15px;
}

.e-meta-input-container label {
  font-size: 0.75rem;
  color: #fff;
  font-weight: 600;
}

.e-meta-input-container input {
  width: auto;
  height: 40px;
  padding: 20px;
  border-radius: 8px;
  outline: none;
  color: #000;
  border: 1px solid #e5e5e5;
  font-weight: 500;
  font-size: 16px;
  background-color: #fff;
}
.e-meta-input-container textarea {
  width: auto;
  height: 100px;
  padding: 25px;
  border-radius: 7px;
  outline: none;
  border: 1px solid #e5e5e5;
  color: #000;
  font-weight: 500;
  font-size: 16px;
  background-color: #fff;
}
.e-meta-input-container input::placeholder, textarea::placeholder {
  color: gray;
  font-size: small;
}

.submit-art-meta {
  padding: 8px 16px;
  border: none;
  font-size: 12px;
  color: #fff;
  border-radius: 5px;
  margin-top: 10px;
  background-color: #176984;
  cursor: pointer;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
}

.e-art-category {
  color: #fff;
}

.e-art-categories-menu {
  position: absolute;
  z-index: 999;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background-color: #fff;
  top: 55%;
  right: 38%;
  height: 250px;
  overflow-y: scroll;
}
@media (max-width: 767px) {
  .e-meta-input-container {
    width: 320px;
  }
  .e-header-img-holder label {
    font-style: 9px;
  }
  .e-art-categories-menu {
    top: 50%;
    right: 20%;
  }
}
.e-art-categories-menu ul li {
  border-bottom: 0.5px solid #dedede;
  padding: 5px 10px;
  transition: 0.3s ease-out;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
}
.e-art-categories-menu ul li:hover {
  background-color: rgb(1, 95, 123);
  color: #fff;
}

.e-art-selected-catg {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  padding: 3px 6px;
  cursor: pointer;
}

.back {
  position: absolute;
  top: 10%;
  left: 5px;
  padding: 5px 10px;
  border:1px solid #ededed;
  border-radius: 5px;
  background: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 99;
}
.catg-toggle-icon{
  cursor: pointer;
  color: #ccc;
  font-weight: 600;
  font-size: small;
}
`