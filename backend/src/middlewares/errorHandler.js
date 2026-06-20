//an error middleware. any error or next(err) will be sent to this middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';



  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;