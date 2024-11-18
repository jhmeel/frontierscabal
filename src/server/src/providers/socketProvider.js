import { Server } from "socket.io";
import { logger } from "../utils/logger.js";
import {
  addReply,
  deleteComment,
  deleteReply,
  newComment,
  toggleLike,
} from "../handlers/articleHandler.js";
import { Emitter } from "../utils/emitter.js";

class SocketProvider {
  constructor(config) {
    this._name = "<SOCKET_PROVIDER>";
    this.io = null;
    this.emitter = Emitter.getInstance();
  }

  init(server) {
    try {
      logger.info(`initializing ${this._name}...`);

      this.io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
      });

      this.io.on("connection", (socket) => {
        logger.info(`Client connected: ${socket.id}`);

        socket.on("join_article", (articleId) => {
          socket.join(`article:${articleId}`);
          logger.debug(`Socket ${socket.id} joined article:${articleId}`);
        });

        // Handle new comment
        socket.on(
          "new_comment",
          async ({ articleId, userId, commentText }, callback) => {
            try {
              const article = await newComment(articleId, userId, commentText);
              this.io.to(`article:${articleId}`).emit("comment_added", article);
              return callback({
                success: true,
                message: "Successful",
                article,
              });
            } catch (error) {
              socket.emit("error", { message: error.message });
              return callback({
                success: false,
                error: error.message,
              });
            }
          }
        );

        // Handle delete comment
        socket.on(
          "delete_comment",
          async ({ articleId, commentId, userId }, callback) => {
            try {
              const article = await deleteComment(articleId, userId, commentId);
              this.io
                .to(`article:${articleId}`)
                .emit("comment_deleted", article);
              return callback({
                success: true,
                message: "Successful",
                article,
              });
            } catch (error) {
              socket.emit("error", { message: error.message });
              return callback({
                success: false,
                error: error.message,
              });
            }
          }
        );

        // Handle new reply
        socket.on(
          "new_reply",
          async ({ articleId, commentId, userId, replyText }, callback) => {
            try {
              const article = await addReply(
                articleId,
                commentId,
                userId,
                replyText
              );
              this.io.to(`article:${articleId}`).emit("reply_added", article);
              return callback({
                success: true,
                message: "Successful",
                article,
              });
            } catch (error) {
              socket.emit("error", { message: error.message });
              return callback({
                success: false,
                error: error.message,
              });
            }
          }
        );

        // Handle delete reply
        socket.on(
          "delete_reply",
          async ({ articleId, commentId, replyId }, callback) => {
            try {
              const article = await deleteReply(articleId, commentId, replyId);
              this.io.to(`article:${articleId}`).emit("reply_deleted", article);
              return callback({
                success: true,
                message: "Successful",
                article,
              });
            } catch (error) {
              socket.emit("error", { message: error.message });
              return callback({
                success: false,
                error: error.message,
              });
            }
          }
        );

        // Handle like/unlike
        socket.on("toggle_like", async ({ articleId, userId }, callback) => {
          try {
            const article = await toggleLike(articleId, userId);
            this.io.to(`article:${articleId}`).emit("like_updated", article);
            return callback({
              success: true,
              message: "Successful",
              article,
            });
          } catch (error) {
            socket.emit("error", { message: error.message });
            return callback({
              success: false,
              error: error.message,
            });
          }
        });

        socket.on("disconnect", () => {
          logger.info(`Client disconnected: ${socket.id}`);
        });
      });

      this.emitter.emit(`${this._name}Ready`);

      logger.info(`${this._name} initialized! `);
      return Promise.resolve();
    } catch (error) {
      logger.error("Socket.IO initialization failed:", error);
      return Promise.reject(error);
    }
  }

  static getInstance(config) {
    if (!SocketProvider.instance) {
      SocketProvider.instance = new SocketProvider(config);
      return SocketProvider.instance;
    }
    return SocketProvider.instance;
  }
}

export { SocketProvider };
