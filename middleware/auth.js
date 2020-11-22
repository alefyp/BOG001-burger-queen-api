const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  console.log(authorization, type, token);
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    User.findById(decodedToken.uid, (err, result) => {
      if (err) {
        return next(401);
      }
      req.user = result;
    });
  });
};

// if req.user exists
module.exports.isAuthenticated = (req) => !!req.user._uid;

// if admin rol = true
module.exports.isAdmin = (req) => !!req.user.roles.admin;

module.exports.requireAuth = (req, resp, next) =>
  !module.exports.isAuthenticated(req) ? next(401) : next();

module.exports.requireAdmin = (req, resp, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
    ? next(403)
    : next();
