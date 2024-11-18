import { User } from "../models/userModel.js";
import { Article } from "../models/articleModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import { ErrorHandler } from "../handlers/errorHandler.js";
import cloudinary from "cloudinary";
import { generateNotification } from "../utils/notificationGen.js";
import { notifyAll, notifyUser } from "./webpushHandler.js";
import { marked } from "marked";
import slugify from "slugify";
import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";

const dompurify = createDomPurify(new JSDOM().window);
import { readingTime } from "reading-time-estimator";

const options = {
  mangle: false,
  headerIds: false,
};

marked.setOptions(options);
// Create New Article
export const newArticle = catchAsync(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req?.body?.image, {
    folder: "ArticleHeaderImage",
  });
  const articleData = {
    title: req.body.title,
    content: req.body.content,
    image: {
      public_id: myCloud?.public_id,
      url: myCloud?.secure_url,
    },
    category: req.body.category,
    type: req.body.type,
    tags: req.body?.tags || "",
    description: req.body.description,
    postedBy: req.user._id,
  };

  const article = await Article.create(articleData);
  const user = await User.findById(req?.user._id);

  user.articles.push(article._id);
  await user.save();
  const populatedArticle = await Article.findById(article._id).populate(
    "postedBy"
  );

  res.status(201).json({
    success: true,
    article,
  });
  const notPayload = generateNotification("NEW:ARTICLE", populatedArticle);
  notifyAll(notPayload);
});

// Like or Unlike Article
export const toggleLike = async (articleId, userId) => {
  const article = await Article.findById(articleId)
    .populate("postedBy")
    .populate({ path: "comments.user", model: "User" })
    .populate({ path: "comments.comment.replies.user", model: "User" })
    .exec()

  if (!article) {
    throw new ErrorHandler("Article Not Found", 404);
  }

  const user = await User.findById(userId);
  const isLiked = article.likes.includes(userId);

  if (isLiked) {
    article.likes.pull(userId);
    await article.save();
  } else {
    article.likes.push(userId);
    await article.save();

    const notPayload = generateNotification("ARTICLE:LIKE", {
      title: article?.title,
      image: article?.image,
      avatar: user?.avatar?.url,
      slug: article?.slug,
      username: user.username,
    });
    notifyUser(article.postedBy?.username, notPayload);
  }
  return article;
};

// Delete Article
export const deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new ErrorHandler("Article Not Found", 404));
  }

  const userId = req.user._id.toString();
  const postedById = article.postedBy.toString();
  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });
  if (postedById !== userId && userId !== superAdmin._id.toString()) {
    return next(new ErrorHandler("Unauthorized", 401));
  }

  await cloudinary.v2.uploader.destroy(article.image.public_id);

  await Article.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Article Deleted",
  });
});

// Update Content
export const updateArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new ErrorHandler("Article Not Found", 404));
  }
  const { title, content, category, description, tags, type } = req.body;
  const userId = req?.user._id.toString();
  const postedById = article.postedBy.toString();

  if (postedById !== userId) {
    return next(new ErrorHandler("Unauthorized", 401));
  }
  const newData = {
    title,
    content,
    description,
    category,
    tags,
    type,
    updatedAt: Date.now(),
  };
  if (req?.body?.image && !req?.body?.image?.startsWith("http")) {
    await cloudinary.v2.uploader.destroy(article.image?.public_id);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "ArticleHeaderImage",
    });

    article.image.public_id = myCloud.public_id;
    article.image.url = myCloud.secure_url;
  }

  article.content = newData.content;
  if (type === "Markdown") {
    const markdownContent = marked(newData.content, { gfm: true });
    article.sanitizedHtml = await dompurify.sanitize(markdownContent);
  } else if (type === "Custom") {
    article.sanitizedHtml = await dompurify.sanitize(newData.content);
  }
  article.description = newData.description;
  article.category = newData.category;
  article.tags = newData.tags;
  article.updatedAt = newData.updatedAt;
  const { text } = readingTime(newData.content);
  article.readDuration = text;
  article.slug = slugify(newData.title, {
    lower: true,
    strict: true,
  });

  await article.save();

  res.status(200).json({
    success: true,
    message: "Article Updated",
  });
});

// Add Comment
export const newComment = async (articleId, userId, commentText) => {
  const article = await Article.findById(articleId)

  if (!article) {
    throw new ErrorHandler("Article Not Found", 404);
  }

  const user = await User.findById(userId);

  const newComment = {
    user: userId,
    comment: [
      {
        commentText,
        date: new Date(),
        replies: [],
      },
    ],
  };

  article.comments.push(newComment);

  await article.save();

  const updatedArticle = await Article.findById(articleId)
  .populate("postedBy")
  .populate({ path: "comments.user", model: "User" })
  .populate({ path: "comments.comment.replies.user", model: "User" })
  .exec();

  const notPayload = generateNotification("ARTICLE:COMMENT", {
    title: article?.title,
    image: article?.image,
    avatar: user?.avatar?.url,
    slug: article?.slug,
    username: user.username,
  });
  notifyUser(article.postedBy?.username, notPayload);

  return updatedArticle;
};

//Delete comment
export const deleteComment = async (articleId, userId, commentId) => {
  const article = await Article.findById(articleId)
    .populate("postedBy")
    .populate({ path: "comments.user", model: "User" })
    .populate({ path: "comments.comment.replies.user", model: "User" })
    .exec();

  if (!article) {
    throw new ErrorHandler("Article Not Found", 404);
  }
  const superAdmin = await User.findOne({ role: "FC:SUPER:ADMIN" });

  const commentIndex = article.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  if (commentIndex === -1) {
    throw new ErrorHandler("Comment Not Found", 404);
  }

  if (
    article.comments[commentIndex]["user"]?._id.toString() !== userId &&
    userId !== superAdmin._id.toString()
  ) {
    throw new ErrorHandler("Unauthorize");
  }

  // Delete the comment from the 'comments' array.
  article.comments.splice(commentIndex, 1);

  await article.save();
  return article;
};

//Add reply
export const addReply = async (articleId, commentId, userId, replyText) => {
  const article = await Article.findById(articleId)

  if (!article) {
    throw new ErrorHandler("Article Not Found", 404);
  }

  // Find the index of the comment to add a reply to in the 'comments' array.
  const commentIndex = article.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  if (commentIndex === -1) {
    throw new ErrorHandler("Comment Not Found", 404);
  }

  const newReply = {
    user: userId,
    replyText,
  };

  // Push the new reply to the 'replies' array of the comment.
  article.comments[commentIndex].comment[0].replies.push(newReply);

  await article.save();

  const updatedArticle = await Article.findById(articleId)
  .populate("postedBy")
  .populate({ path: "comments.user", model: "User" })
  .populate({ path: "comments.comment.replies.user", model: "User" })
  .exec();

  return updatedArticle;
};

//Delte reply
export const deleteReply = async (articleId, commentId, replyId) => {
  const article = await Article.findById(articleId)
    .populate("postedBy")
    .populate({ path: "comments.user", model: "User" })
    .populate({ path: "comments.comment.replies.user", model: "User" })
    .exec();

  if (!article) {
    throw new ErrorHandler("Article Not Found", 404);
  }

  // Find the index of the comment containing the reply in the 'comments' array.
  const commentIndex = article.comments.findIndex(
    (comment) => comment._id.toString() === commentId
  );

  if (commentIndex === -1) {
    throw new ErrorHandler("Comment Not Found", 404);
  }

  // Find the index of the reply in the 'replies' array of the comment.
  const replyIndex = article.comments[
    commentIndex
  ].comment[0].replies.findIndex((reply) => reply._id.toString() === replyId);

  if (replyIndex === -1) {
    throw new ErrorHandler("Reply Not Found", 404);
  }
 
  // Delete the reply from the 'replies' array of the comment.
  article.comments[commentIndex].comment[0].replies.splice(replyIndex, 1);

  await article.save();

  return article;
};

// Get Article Details
export const getArticleDetails = catchAsync(async (req, res, next) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate("postedBy")
    .populate({ path: "comments.user", model: "User" })
    .populate({ path: "comments.comment.replies.user", model: "User" })
    .exec();

  if (!article) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found" });
  }

  article.views += 1;
  await article.save();

  res.status(200).json({
    success: true,
    article: article,
  });
});

// Get All Articles
export const allArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find().populate("postedBy");

  return res.status(200).json({
    articles,
  });
});

// Get Recent Articles
export const getRecentArticles = catchAsync(async (req, res, next) => {
  const { categories, page } = req.query;
  const pageSize = 50;

  const query = await Article.find({
    category: { $in: categories.split(",") },
  })
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();

  const totalResults = query.length;

  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    articles: query,
    totalPages: totalPages,
  });
});

// Search Articles by Category
export const searchArticlesByCategory = catchAsync(async (req, res, next) => {
  const { category, page } = req.query;
  const pageSize = 50;

  const query = await Article.find({
    category: { $in: category },
  })
    .populate("postedBy")
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();

  const totalResults = query.length;

  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    articles: query,
    totalPages: totalPages,
  });
});

// Search Articles by Title
export const searchArticlesByTitle = catchAsync(async (req, res, next) => {
  const title = req.query.title;

  const regex = new RegExp(title, "gmi");

  const query = await Article.find({
    $or: [{ title: { $regex: regex } }, { tags: { $regex: regex } }],
  }).populate("postedBy");

  res.status(200).json({
    articles: query,
  });
});

// Get Bookmarked Articles
export const getUserBookmarkedArticles = catchAsync(async (req, res, next) => {
  const { page } = req.query;
  const pageSize = 15;

  const query = await Article.find({
    savedBy: { $in: req.user._id },
  })
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();
  const totalResults = query.length;

  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    articles: query,
    totalPages: totalPages,
  });
});
export const bookmarkOrUnBookmark = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new ErrorHandler("Article Not Found", 404));
  }

  if (user.savedArticles.includes(article._id.toString())) {
    user.savedArticles = user.savedArticles.filter(
      (art) => art.toString() !== article._id.toString()
    );
    article.savedBy = article.savedBy.filter(
      (art) => art.toString() !== req.user._id.toString()
    );
    await user.save();
    await article.save();

    return res.status(200).json({
      success: true,
      message: "Unsaved",
    });
  } else {
    user.savedArticles.push(article._id);
    article.savedBy.push(req.user._id);

    await user.save();
    await article.save();

    return res.status(200).json({
      success: true,
      message: "Saved",
    });
  }
});

export const pinAndUnpinArticle = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const article = await Article.findById(req.params.id);

  if (!article) {
    return next(new ErrorHandler("Article Not Found", 404));
  }

  if (user.pinnedArticles.includes(article._id.toString())) {
    user.pinnedArticles = user.pinnedArticles.filter(
      (art) => art.toString() !== article._id.toString()
    );
    article.pinnedBy = article.pinnedBy.filter(
      (art) => art.toString() !== req.user._id.toString()
    );

    await user.save();
    await article.save();

    return res.status(200).json({
      success: true,
      message: "Article Unpinned",
    });
  } else {
    user.pinnedArticles.push(article._id);
    article.pinnedBy.push(req.user._id);
    await user.save();
    await article.save();
    return res.status(200).json({
      success: true,
      message: "Article Pinned",
    });
  }
});

export const getUserPinnedArticles = catchAsync(async (req, res, next) => {
  const { username, page } = req.query;
  const pageSize = 10;
  const user = await User.findOne({ username });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const query = await Article.find({
    pinnedBy: { $in: user._id },
  })
    .populate("postedBy")
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();
  const totalResults = query.length;

  const totalPages = Math.ceil(totalResults / pageSize);

  res.status(200).json({
    articles: query,
    totalPages: totalPages,
  });
});

export const getUserArticles = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  const articles = await Article.find({ postedBy: user._id })
    .populate("postedBy")
    .exec();
  res.status(200).json({
    success: true,
    articles,
  });
});

export const getTrendingArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();

  const viewWeight = 0.3;
  const likeWeight = 0.5;
  const saveWeight = 0.1;

  const trendingArticles = await Promise.all(
    articles.map(async (article) => {
      // Calculate the rank using the weighted sum formula
      const rank =
        viewWeight * article.views +
        likeWeight * article.likes.length +
        saveWeight * article.savedBy.length;

      const populatedArticle = await Article.findById(article._id).populate(
        "postedBy"
      );

      return { Article: populatedArticle, rank: rank };
    })
  );

  trendingArticles.sort((a, b) => b.rank - a.rank);

  const top12TrendingArticles = trendingArticles.slice(0, 12);
  res.status(200).json({
    success: true,
    articles: top12TrendingArticles,
  });
});

export const suggestTopWriters = catchAsync(async (req, res, next) => {
  //TODO: get writers with trending articles
});
