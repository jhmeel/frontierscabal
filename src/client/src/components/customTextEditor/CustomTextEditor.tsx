/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useNavigate } from "react-router-dom";
import {
 IconChevronLeft,
  IconCaretDown,
  IconDeleteForeverOutline,
} from "../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewArticle,
  clearErrors,
  updateArticle,
} from "../../actions/article";
import GetToken from "../../utils/getToken";
import toast from "react-hot-toast";
import { isOnline } from "../../utils";
import {
  NEW_ARTICLE_RESET,
  UPDATE_ARTICLE_RESET,
} from "../../constants/article";
import LocalForageProvider from "../../utils/localforage";
import IRCache from "../../utils/cache";
import styled from "styled-components";
import RDotLoader from "../loaders/RDotLoader";
import { RootState } from "../../store";
import { Button } from "@mui/material";

interface CustomEditorProps {
  artId?: string;
  artTitle?: string;
  artImage?: string;
  artContent?: string;
  artCategory?: string;
  artTags?: string;
  artSlug?: string;
  artDes?: string;
  action?:'New'|'Update';
}

const CustomEditor: React.FC<CustomEditorProps> = ({
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
  const imageEl = useRef<HTMLInputElement>(null);
  const editorEl = useRef<any>(null);
  const [image, setImage] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [tags, setTags] = useState<string | undefined>("");
  const [content, setContent] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    ""
  );
  const [optionVisible, setIsOptionVisible] = useState<boolean>(false);
  const [metaVisible, setMetaVisible] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    error: articlePublishError,
    success,
    article,
    loading,
  } = useSelector((state: RootState) => state.newArticle);
  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state: RootState) => state.updateArticle);

  // Backing up editor state to IRCache to prevent unexpected or interrupted downtime
  const backUPToCache = () => {
    if (title || content || tags || description || selectedCategory || image) {
      new IRCache(LocalForageProvider).save("FC:IRCACHE:EDITOR",{
        type: "CUSTOM",
        title,
        content,
        description,
        selectedCategory,
        image,
        tags,
      });
    }
  };

  useEffect(() => {
    backUPToCache();
  }, [title, content, image, description, tags, selectedCategory]);

  // Restore editor state from IRCache if present, when the page first loads
  useEffect(() => {
    const restore = async () => {
      const res = await new IRCache(
        LocalForageProvider
      ).restorePreviousSession("FC:IRCACHE:EDITOR");
      if (res && res.type === "CUSTOM") {
        setTitle(res.title);
        setImage(res?.image);
        setContent(res?.content);
        setTags(res?.tags);
        setDescription(res?.description);
        setSelectedCategory(res?.selectedCategory);
      }
    };

    action === "New" && restore();
  }, []);

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
  }, [dispatch, updateError, message, navigate]);

  // Set editor state to editing article info when the page first loads
  useEffect(() => {
    if (artTitle && artImage && artContent && artCategory && artDes) {
      setTitle(artTitle);
      setImage(artImage);
      setContent(artContent);
      setTags(artTags);
      setDescription(artDes);
      setSelectedCategory(artCategory);
    }
  }, []);

  const toggleOptionVisible = () => {
    setIsOptionVisible(!optionVisible);
  };

  const handleSelectedCategory = (category: string) => {
    setSelectedCategory(category);
    toggleOptionVisible();
  };

  // Editor header image handler
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Validate file type as an image
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (file && !validImageTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or GIF).");
      return;
    }

    // Validate file size (max 5MB)
    const maxSizeInBytes = 5 << 20; // 5MB
    if (file && file.size > maxSizeInBytes) {
      toast.error("Please upload an image file with a maximum size of 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result as string);
      }
    };

    file && reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMetaVisible(true);
  };

  const handleDescInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  // Submit and publish new article if action is New or update article if otherwise
  const handleMetaDetailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = await GetToken();
    if (
      description &&
      (description.split(" ").length < 10 ||
        description.split(" ").length > 100)
    ) {
      toast.error("Description should be between 10 and 100 words.");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category for your article.");
      return;
    } else if (!image) {
      toast.error("Please select an image for your article.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("category", selectedCategory);
    formData.append("image", image);
    formData.append("tags", tags);
    formData.append("type", "Custom");

    if (action === "New" && isOnline()) {
      dispatch<any>(addNewArticle(authToken, formData));
    } else if (isOnline()) {
      dispatch<any>(updateArticle(authToken, artId, formData));
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

  const optionRef = useRef<HTMLDivElement>(null);

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
      <CustomEditorForm className="custom-editor-form">
        <div className="cust-ed-header">
          {image && (
            <span title="Remove">
              <IconDeleteForeverOutline
                className="c-rmv-hd-image-icon"
                onClick={() => setImage("")}
              />
            </span>
          )}
          {image ? (
            <img
              src={image}
              loading="lazy"
              draggable={false}
              alt=""
              className="c-hd-img"
            />
          ) : (
            <div className="c-header-img-holder">
              <label htmlFor="image-upload" title="upload">
                Click to Upload Header Image (Recommended size: 1200x250px)
              </label>
              <input
                className="c-hd-img-input"
                id="image-upload"
                type="file"
                ref={imageEl}
                accept="image/jpeg, image/png, image/gif"
                onChange={handleImageUpload}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          required
          id="title"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          autoFocus
        />

        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(e: any, editor: any) => {
            const data = editor.getData();
            setContent(data);
          }}
          ref={editorEl}
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!content}
          className={content ? "custom-editor-btn" : "dis-btn"}
        >
          {action === "New" ? "Publish" : "Republish"}
        </Button>
      </CustomEditorForm>
      {metaVisible && (
        <CustomEditorFormMetaData>
           <span
            title="back"
            className="back"
            onClick={() => setMetaVisible(false)}
          >
            <IconChevronLeft />| back
          </span>
          <form
            className="c-art-form"
            onSubmit={handleMetaDetailSubmit}
            encType="multipart/form-data"
          >
            <div className="c-meta-input-container">
              <label htmlFor="description">Description*</label>
              <textarea
                name="description"
                value={description}
                placeholder="Description of your article, not more than 100 words, for Search engine optimization"
                required={true}
                title="Description"
                onChange={handleDescInputChange}
                disabled={loading}
              ></textarea>
            </div>
            <div className="c-meta-input-container">
              <label htmlFor="title">Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="EX:Tech, Science, Finance"
                value={tags}
                title="Tags"
                autoFocus={true}
                onChange={handleTagInputChange}
                disabled={loading}
              />
            </div>
            <div className="c-art-category" ref={optionRef}>
              <span
                className="c-art-selected-catg"
                title="Categories"
                onClick={toggleOptionVisible}
              >
                {selectedCategory}
              </span>
              <span
                className="c-catg-toggle-icon"
                onClick={toggleOptionVisible}
              >
                {!selectedCategory && "Select a category"}
              </span>
              <IconCaretDown
                className="c-catg-toggle-icon"
                onClick={toggleOptionVisible}
              />

              {optionVisible && (
                <div className="c-art-categories-menu">
                  <ul className="c-art-categories-menu-options">
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
            <Button
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
            </Button>
          </form>
        </CustomEditorFormMetaData>
      )}
    </>
  );
};

export default CustomEditor;

const CustomEditorForm = styled.form`
  input#title {
    width: 100%;
    height: 55px;
    outline: 0;
    border: none;
    border: rgb(235, 235, 235) solid 1px;
    font-size: 1.4rem;
    padding-left: 1rem;
    font-weight: 450;
    font-family: sans-serif;
    text-transform: capitalize;
    border-bottom: none;
  }

  .ck-editor {
    width: 100%;
    margin-bottom: 1rem !important;
  }

  .ck-editor__top * {
    border: none !important;
  }

  .ck-editor__top {
    border: rgb(235, 235, 235) solid 1px !important;
    border-bottom: none !important;
    padding: 0.6rem 1rem !important;
  }

  .ck-content {
    border: rgb(235, 235, 235) solid 1px !important;
  }

  .ck-toolbar__items,
  .ck-toolbar div {
    border: none !important;
  }

  .ck-editor__editable {
    height: 250px;
    padding: 0.5rem 1rem !important;
  }

  .ck-editor__editable:focus {
    box-shadow: none !important;
  }
  .cust-ed-header {
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-bottom: 5px;
  }
  .c-hd-img-input {
    display: none;
  }
  .c-hd-img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
    padding: 6px;
  }
  .c-header-img-holder label {
    font-size: 11px;
  font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
    font-family: "Inter", sans-serif;
  cursor: pointer;
  }
  .c-rmv-hd-image-icon {
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

  .custom-editor-btn {
    background-color: #176984;
    color: white;
    margin-top: 1.9rem;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    padding: 8px 18px;
    position: absolute;
    left: 44%;
    cursor: pointer;
  }

  .dis-btn {
    padding: 8px 18px;
    background-color: #176984;
    color: white;
    margin-top: 1.9rem;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    opacity: 0.4;
    cursor: pointer;
    position: absolute;
    left: 44%;
  }
`;
const CustomEditorFormMetaData = styled.div`
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

  .c-meta-input-container {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
  }

  .c-art-form {
    width: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 15px;
  }

  .c-meta-input-container label {
    font-size: 0.75rem;
    color: #fff;
    font-weight: 600;
  }

  .c-meta-input-container textarea,
  input {
    width: auto;
    height: auto;
    padding: 20px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    color: #000;
    font-weight: 500;
    font-size: 16px;
    background-color: #fff;
  }
  .c-meta-input-container textarea::placeholder,
  input::placeholder {
    color: gray;
    font-size: 12px;
  }
  .submit-art-meta {
    padding: 8px 18px;
    border: none;
    font-size: 12px;
    color: #fff;
    border-radius: 5px;
    margin-top: 10px;
    background-color: #176984;
    cursor: pointer;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
  }

  .c-art-category {
    color: #fff;
  }

  .c-art-categories-menu {
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
  .c-catg-toggle-icon {
    cursor: pointer;
    color: #ccc;
    font-weight: 600;
    font-size: small;
  }
  @media (max-width: 767px) {
    .c-meta-input-container {
      width: 320px;
    }
    .c-header-img-holder label {
      font-size: 9px;
    }
    .c-art-categories-menu {
      top: 50%;
      right: 20%;
    }
  }
  .c-art-categories-menu ul li {
    border-bottom: 0.5px solid #dedede;
    padding: 5px 10px;
    transition: 0.3s ease-out;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
  }
  .c-art-categories-menu ul li:hover {
    background-color: rgb(1, 95, 123);
    color: #fff;
  }

  .c-art-selected-catg {
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
`;
