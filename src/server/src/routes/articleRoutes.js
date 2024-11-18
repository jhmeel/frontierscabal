import express from "express";
import { newArticle } from "../handlers/articleHandler.js";
import { searchArticlesByCategory } from "../handlers/articleHandler.js";
import { searchArticlesByTitle } from "../handlers/articleHandler.js";
import { getRecentArticles } from "../handlers/articleHandler.js";
import { deleteArticle } from "../handlers/articleHandler.js";
import { updateArticle } from "../handlers/articleHandler.js";
import { getArticleDetails } from "../handlers/articleHandler.js";
import { allArticles } from "../handlers/articleHandler.js";
import { getUserArticles } from "../handlers/articleHandler.js";
import { bookmarkOrUnBookmark } from "../handlers/articleHandler.js";
import { getUserBookmarkedArticles } from "../handlers/articleHandler.js";
import { getTrendingArticles } from "../handlers/articleHandler.js";
import { pinAndUnpinArticle } from "../handlers/articleHandler.js";
import { getUserPinnedArticles } from "../handlers/articleHandler.js";
import { authenticator } from "../middlewares/authenticator.js";

const Article = express();
Article.route("/article/new").post(authenticator, newArticle);

Article.route("/article/all").get(allArticles);

Article.route("/article/recent").get(getRecentArticles);
Article.route("/article/trending").get(getTrendingArticles);
Article.route("/article/search")
  .get(searchArticlesByCategory)
  .get(searchArticlesByTitle);

Article.route("/article/bookmarked").get(
  authenticator,
  getUserBookmarkedArticles
);
Article.route("/article/bookmark/:id").get(authenticator, bookmarkOrUnBookmark);
Article.route("/article/pin/:id").get(authenticator, pinAndUnpinArticle);

Article.route("/article/all-pinned").get(authenticator, getUserPinnedArticles)

Article.route("/article/detail/:slug").get(getArticleDetails);

Article.route("/article/:id")
  .put(authenticator, updateArticle)
  .delete(authenticator, deleteArticle);

Article.route("/articles/:username").get(authenticator, getUserArticles);

export { Article };
