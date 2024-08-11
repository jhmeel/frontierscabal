import { GoogleGenerativeAI } from "@google/generative-ai";
import getMimeType from "../utils/getMimeType.js";
import catchAsync from "../middlewares/catchAsync.js";
import { ErrorHandler } from "./errorHandler.js";

const genAI = new GoogleGenerativeAI("AIzaSyCRkhaz1l25Z-OmjbO_k2uDPzE0LQj6M68");

export const processPastQuestionImage = catchAsync(async (req, res, next) => {
  const { image } = req.body;
  
  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Base64 image data is required",
    });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const mimeType = getMimeType(image);

  const imageData = {
    inlineData: {
      data: image.split(",")[1],
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([
    "Please provide answers to the questions in this image:",
    imageData,
  ]);
  const response = await result.response;
  const answer = response.text();

  res.status(200).json({
    success: true,
    answer,
  });
});

export const respondToQuery = catchAsync(async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return next(new ErrorHandler("Query is required", 400));
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(`${query}`);
  const response = await result.response;
  const article = response.text();


  res.status(200).json({
    success: true,
    article,
  });
});
