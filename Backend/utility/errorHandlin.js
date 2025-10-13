// errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.log("Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
};

export default errorHandler;
