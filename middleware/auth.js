/* eslint-disable implicit-arrow-linebreak */
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

module.exports = (secret) => (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  req.user = null;

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    User.findById(decodedToken.uid, (err, result) => {
      if (err) {
        return next(401);
      }

      console.log(result);
      req.user = result;
      return next();
    });
  });
};

// if req.user exists
module.exports.isAuthenticated = (req) => {
  return !!req.user;
};

// if admin rol = true
module.exports.isAdmin = (req) => {
  return !!req.user.roles.admin;
};

// eslint-disable-next-line no-confusing-arrow
module.exports.requireAuth = (req, res, next) =>
  !module.exports.isAuthenticated(req) ? next(401) : next();

// eslint-disable-next-line no-confusing-arrow
module.exports.requireAdmin = (req, res, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
      ? next(403)
      : next();
