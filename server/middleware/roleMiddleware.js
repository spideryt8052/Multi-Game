import { errorResponse } from '../utils/apiResponse.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `User role (${req.user?.role || 'guest'}) is unauthorized to perform this operation`,
        403
      );
    }
    next();
  };
};

