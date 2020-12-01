const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../model/userModel');

module.exports = {
  getUsers: (req, res, next) => {
    res.json({ holongo: 'holongo' });
  },

  addUser: (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email }, (err, result) => {
      if (err || result) {
        console.log(err || 'email already used');
        return next(403);
      }

      const user = new User({
        ...req.body,
        password: bcrypt.hashSync(password, 10),
      });

      user.save().then((doc) => {
        console.log('new user created!', doc);
        mongoose.connection.close();
        return res.json({ note: 'New user created' });
      }).catch((err) => console.log(err || 'not valid data entry'));
    });
  },
};
