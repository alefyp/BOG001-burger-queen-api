const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const User = require('../model/userModel');
// require controller
const {
  getUsers,
  addUser,
  editUser,
  deleteUser,
} = require('../controller/users');

const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  console.log(adminEmail);
  // no admin
  if (!adminEmail || !adminPassword) {
    return next();
  }

  const adminUser = {
    email: adminEmail,
    password: bcrypt.hashSync(adminPassword, 10),
    roles: { admin: true },
  };

  console.log(adminUser.email);

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

  app.put('/users/:uid', requireAuth, editUser);

  app.delete('/users/:uid', requireAuth, deleteUser);

  initAdminUser(app, next);
};
