const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../model/userModel');

module.exports = {
  getUsers: (req, res, next) => {
    res.json({ holongo: 'si puedo ver esto es porque hice bien la autenticación?' });
  },

  addUser: (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email }, (err, result) => {
      if (err || result) {
        return next(403);
      }

      const user = new User({
        ...req.body,
        password: bcrypt.hashSync(password, 10),
      });

      user.save().then((doc) => {
        console.log('new user created!', doc);
        mongoose.connection.close();
      }).catch((err) => console.log(err));

      return res.json({ note: 'New user created' });
    });
  },
};
