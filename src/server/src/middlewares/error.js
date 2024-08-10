
const errorMiddleware = (err, req, res, next) => {

    const { statusCode , message } = err;
  
    res.status(statusCode||500).json({
      success: false,
      message: message || "Something went wrong",
      stack: err.stack,
    });

};
export {errorMiddleware};
