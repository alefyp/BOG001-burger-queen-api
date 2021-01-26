const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
// require schema models
const User = require('../model/userModel');

const { secret } = config;

module.exports = (app, nextMain) => {
  app.post('/auth', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    User.findOne({ email }).then((result) => {
      if (result) {
        bcrypt.compare(password, result.password, (err, check) => {
          if (err || !check) {
            return next(401);
          }
        });
      }

      if (!result) {
        return next(401);
      }

      const token = jwt.sign({ uid: result._id }, secret, {
        expiresIn: '1day',
      });
      res.set('authorization', token);
      return res.json({ token });
    });
  });

  return nextMain();
};
