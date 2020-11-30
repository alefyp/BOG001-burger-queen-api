const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const User = require('../model/userModel');

// const { getUsers } = require('../controller/users');

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
      console.log(adminUser.email, 'already initialized!');
    }
  });

  next();
};

module.exports = (app, next) => {
  // app.get('/users', requireAdmin, getUsers); que lo haga todo acá dice
  app.get('/users', requireAdmin, (req, res, next) => {
    console.log(req.headers);
    console.log(req);
    console.log(requireAdmin, 'resultado del admin');
    res.json({ holongo: 'si puedo ver esto es porque hice bien la autenticación?' });
  });
  //  app.get('/users/:uid', requireAuth, (req, resp) => {});

  app.post('/users', requireAdmin, (req, res, next) => {
    console.log(requireAdmin);
    console.log(req);
    console.log(resp);
    console.log(req.body);
  });

  app.put('/users/:uid', requireAuth, (req, resp, next) => {});

  app.delete('/users/:uid', requireAuth, (req, resp, next) => {});

  initAdminUser(app, next);
};
