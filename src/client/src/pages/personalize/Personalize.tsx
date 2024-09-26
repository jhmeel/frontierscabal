import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MetaData from "../../MetaData";
import LocalForageProvider from "../../utils/localforage";
import styled from "styled-components";
import { Button, Checkbox, Typography, Box, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Personalize = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      <StyledPersonalizeRender>
        <Box className="p-header">
          <Typography variant="h4" align="center" gutterBottom>
            Select your interests!
          </Typography>
          <Typography variant="subtitle1" align="center">
            This will help us customize your blog feed.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="p-catg-container">
          <Grid container spacing={2}>
            {Object.keys(categories).map((category) => (
              <Grid item xs={6} sm={4} key={category}>
                <CategoryLabel className={categories[category] ? "checked" : ""}>
                  {category.replace('_', ' ')}
                  <Checkbox
                    checked={categories[category]}
                    onChange={() => handleCategoryChange(category)}
                    color="primary"
                  />
                </CategoryLabel>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            className="p-catg-submit-btn"
            type="submit"
            fullWidth
          >
            Customize My Feed
          </Button>
        </form>
      </StyledPersonalizeRender>
    </>
  );
};

export default Personalize;

const StyledPersonalizeRender = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;

  .p-header {
    margin-bottom: 20px;
  }

  .p-catg-container {
    width: 100%;
    max-width: 500px;
    margin: 20px 0;
  }

  .p-catg-submit-btn {
    margin-top: 20px;
    padding: 12px 0;
    font-weight: bold;
    text-transform: uppercase;
  }

  @media (max-width: 600px) {
    .p-catg-container {
      padding: 0 15px;
    }
  }
`;

const CategoryLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #ffffff;
  border: 1.5px solid #c4c4c4;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  text-transform: capitalize;

  &.checked {
  border: 1.5px solid #176984;
  background: #176984;
  color:#fff;
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

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 600px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;
