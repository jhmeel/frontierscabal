import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../../MetaData";
import LocalForageProvider from "../../utils/localforage";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const Personalize = () => {
  const navigate = useNavigate();
  const { theme } = useSelector((state: RootState) => state.theme);
  const [categories, setCategories] = useState({
    Tech: false,
    Science: false,
    News: false,
    Education: false,
    Personal_dev: false,
    Fiction: false,
    Finance: false,
    Fashion: false,
    Culture: false,
    Food: false,
    History: false,
    Music: false,
    Art: false,
    Lifestyle: false,
    Business: false,
    Religion: false,
    Sport: false,
    Movies: false,
  });
  const handleCategoryChange = (catg: string) => {
    setCategories((prevCatg) => ({
      ...prevCatg,
      [catg]: !prevCatg[catg],
    }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    LocalForageProvider.setItem(
      "FC:USER:INTERESTS",
      JSON.stringify(categories)
    );
    navigate("/");
  };
  return (
    <>
      <MetaData title="Personalize" />
      <ThemeProvider theme={theme}>
        <PersonalizeRender>
          <div className="p-header">
            <h1>Select your interests!!</h1>
            <p>This would determine the blog post you would see.</p>
          </div>
          <form className="p-catg-container" onSubmit={handleSubmit}>
            <label className={categories["Tech"] == true ? "checked" : ""}>
              Tech
              <input
                type="checkbox"
                checked={categories["Tech"]}
                onChange={() => handleCategoryChange("Tech")}
              />
            </label>
            <label className={categories["Education"] == true ? "checked" : ""}>
              Education
              <input
                type="checkbox"
                checked={categories["Education"]}
                onChange={() => handleCategoryChange("Education")}
              />
            </label>
            <label className={categories["Fashion"] == true ? "checked" : ""}>
              Fashion
              <input
                type="checkbox"
                checked={categories["Fashion"]}
                onChange={() => handleCategoryChange("Fashion")}
              />
            </label>
            <label className={categories["Science"] == true ? "checked" : ""}>
              Science
              <input
                type="checkbox"
                checked={categories["Science"]}
                onChange={() => handleCategoryChange("Science")}
              />
            </label>
            <label className={categories["History"] == true ? "checked" : ""}>
              History
              <input
                type="checkbox"
                checked={categories["History"]}
                onChange={() => handleCategoryChange("History")}
              />
            </label>
            <label className={categories["Finance"] == true ? "checked" : ""}>
              Finance
              <input
                type="checkbox"
                checked={categories["Finance"]}
                onChange={() => handleCategoryChange("Finance")}
              />
            </label>
            <label className={categories["Fiction"] == true ? "checked" : ""}>
              Fiction
              <input
                type="checkbox"
                checked={categories["Fiction"]}
                onChange={() => handleCategoryChange("Fiction")}
              />
            </label>
            <label className={categories["News"] == true ? "checked" : ""}>
              News
              <input
                type="checkbox"
                checked={categories["News"]}
                onChange={() => handleCategoryChange("News")}
              />
            </label>
            <label
              className={categories["Personal_dev"] == true ? "checked" : ""}
            >
              Personal_dev
              <input
                type="checkbox"
                checked={categories["Personal_dev"]}
                onChange={() => handleCategoryChange("Personal_dev")}
              />
            </label>

            <label className={categories["Culture"] == true ? "checked" : ""}>
              Culture
              <input
                type="checkbox"
                checked={categories["Culture"]}
                onChange={() => handleCategoryChange("Culture")}
              />
            </label>
            <label className={categories["Movies"] == true ? "checked" : ""}>
              Movies
              <input
                type="checkbox"
                checked={categories["Movies"]}
                onChange={() => handleCategoryChange("Movies")}
              />
            </label>
            <label className={categories["Food"] == true ? "checked" : ""}>
              Food
              <input
                type="checkbox"
                checked={categories["Food"]}
                onChange={() => handleCategoryChange("Food")}
              />
            </label>
            <label className={categories["Music"] == true ? "checked" : ""}>
              Music
              <input
                type="checkbox"
                checked={categories["Music"]}
                onChange={() => handleCategoryChange("Music")}
              />
            </label>
            <label className={categories["Lifestyle"] == true ? "checked" : ""}>
              Lifestyle
              <input
                type="checkbox"
                checked={categories["Lifestyle"]}
                onChange={() => handleCategoryChange("Lifestyle")}
              />
            </label>
            <label className={categories["Business"] == true ? "checked" : ""}>
              Business
              <input
                type="checkbox"
                checked={categories["Business"]}
                onChange={() => handleCategoryChange("Business")}
              />
            </label>
            <label className={categories["Religion"] == true ? "checked" : ""}>
              Religion
              <input
                type="checkbox"
                checked={categories["Religion"]}
                onChange={() => handleCategoryChange("Religion")}
              />
            </label>
            <label className={categories["Sport"] == true ? "checked" : ""}>
              Sport
              <input
                type="checkbox"
                checked={categories["Sport"]}
                onChange={() => handleCategoryChange("Sport")}
              />
            </label>
            <label className={categories["Art"] == true ? "checked" : ""}>
              Art
              <input
                type="checkbox"
                checked={categories["Art"]}
                onChange={() => handleCategoryChange("Art")}
              />
            </label>
          </form>

          <button
            className="p-catg-submit-btn"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </PersonalizeRender>
      </ThemeProvider>
    </>
  );
};

export default Personalize;

const PersonalizeRender = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0px 50px;
  position: relative;
  gap: 5px;

  h1 {
    font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;
    text-align: center;
  }

  p {
    color: gray;
    text-align: center;
  }
  .p-catg-container {
    height: fit-content;
    width: 350px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 10px;
    margin-left: 15px;
  }
  .p-catg-container input {
    accent-color: #176984;
  }
  .p-catg-container label {
    width: fit-content;
    height: fit-content;
    color: gray;
    font-size: 14px;
    border-radius: 25px;
    cursor: pointer;
    border: 1.5px solid gray;
    padding: 10px 20px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 3px;
  }
  @media (max-width: 767px) {
    .p-catg-container label {
      padding: 8px 16px;
      font-size: 12px;
    }
  }

  .p-catg-container .checked {
    border: 1.5px solid #176984;
    animation: 0.6s ease-out splash-12;
  }
  @-moz-keyframes splash-12 {
    40% {
      background: #176984;
      box-shadow: 0 -18px 0 -8px #176984, 16px -8px 0 -8px #176984,
        16px 8px 0 -8px #176984, 0 18px 0 -8px #176984, -16px 8px 0 -8px #176984,
        -16px -8px 0 -8px #176984;
    }

    100% {
      background: #176984;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

  @-webkit-keyframes splash-12 {
    40% {
      background: #176984;
      box-shadow: 0 -18px 0 -8px #176984, 16px -8px 0 -8px #176984,
        16px 8px 0 -8px #176984, 0 18px 0 -8px #176984, -16px 8px 0 -8px #176984,
        -16px -8px 0 -8px #176984;
    }

    100% {
      background: #176984;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

  @-o-keyframes splash-12 {
    40% {
      background: #176984;
      box-shadow: 0 -18px 0 -8px #176984, 16px -8px 0 -8px #176984,
        16px 8px 0 -8px #176984, 0 18px 0 -8px #176984, -16px 8px 0 -8px #176984,
        -16px -8px 0 -8px #176984;
    }

    100% {
      background: #176984;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }

  @keyframes splash-12 {
    40% {
      background: #176984;
      box-shadow: 0 -18px 0 -8px #176984, 16px -8px 0 -8px #176984,
        16px 8px 0 -8px #176984, 0 18px 0 -8px #176984, -16px 8px 0 -8px #176984,
        -16px -8px 0 -8px #176984;
    }

    100% {
      background: #176984;
      box-shadow: 0 -36px 0 -10px transparent, 32px -16px 0 -10px transparent,
        32px 16px 0 -10px transparent, 0 36px 0 -10px transparent,
        -32px 16px 0 -10px transparent, -32px -16px 0 -10px transparent;
    }
  }
  .p-catg-submit-btn {
    padding: 9px 18px;
    background-color: #176984;
    border: none;
    border-radius: 15px;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    margin-top: 5px;
  }

  @media (max-width: 767px) {
    h1 {
      font-size: 23px;
    }
  }
`;
