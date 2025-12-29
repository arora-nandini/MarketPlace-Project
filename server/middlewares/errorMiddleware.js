const globalErrorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
  });
};

export default globalErrorHandler;

