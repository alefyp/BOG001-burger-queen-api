const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const User = require('../model/userModel');
// require controller
const {
  getUsers,
  addUser,
  editUser,
} = require('../controller/users');

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');

  // no admin
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  // nothing to do if already exists! but if doesn't... save it!

  User.findOne({ email: adminUser.email }, (err, result) => {
    if (err) {
      return next(401);
    }

    if (!result) {
      const admin = new User(adminUser);
      admin.save().then((doc) => {
        console.log('admin created!', doc);
        mongoose.connection.close();
      })
        .catch((err) => console.log(err));
    } else {
      console.log(adminUser.email, 'already initialized');
    }
  });

  next();
};

module.exports = (app, next) => {
  app.get('/users', requireAdmin, getUsers);

  app.post('/users', requireAdmin, addUser);

  app.put('/users/:uid', requireAuth, (req, res, next) => {
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

    User.findOneAndUpdate(filter, update, { returnOriginal: false }, (err, doc) => {
      if (!doc) {
        return next(403);
      }
      // acá me falta estoooooooooooooooooooooooooooooo
      // una usuaria no admin intenta de modificar sus `roles`, ya sería lo único pendiente u.u
      console.log('updated!', doc);
      return res.json(doc);
    });
  });

  app.delete('/users/:uid', requireAuth, (req, res, next) => {
    // uid: email or id
  });

  initAdminUser(app, next);
};
