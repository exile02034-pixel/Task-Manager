//this is a middleware for validating each request

import { validationResult } from 'express-validator';
import ApiError from '../utls/apiError.js';
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array()[0].msg));
  }
  next();
};

export default validateRequest;