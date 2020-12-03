const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../model/userModel');

module.exports = {
  // GET
  getUsers: (req, res, next) => {
    res.json({ holongo: 'holongo' });
  },

  // POST
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
      }).catch((err) => {
        console.log(err || 'not valid data entry');
        return next(403);
      });
    });
  },

  // PUT
  editUser: (req, res, next) => {
    // getting 500 when no header auth by an error i lost track lmao
    // it should be 401
    const { uid } = req.params;

    const update = req.body.password ? {
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    } : req.body;

    // eslint-disable-next-line no-useless-escape
    const byEmail = (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(uid);
    const filter = byEmail ? { email: uid } : { _id: uid };

    // eslint-disable-next-line max-len
    if (!req.user.roles.admin && uid.localeCompare(req.user._id) !== 0 && uid.localeCompare(req.user.email) !== 0) {
      return next(403);
    }

    // no admin trying to modify roles
    if (req.body.roles && !req.user.roles.admin) {
      return next(403);
    }

    User.findOneAndUpdate(filter, update, { returnOriginal: false }, (err, doc) => {
      if (!doc) {
        return next(403);
      }

      console.log('updated!', doc);
      return res.json(doc);
    });
  },
};
