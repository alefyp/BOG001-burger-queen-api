const bcrypt = require('bcrypt');
const { query } = require('express');
// eslint-disable-next-line import/no-unresolved
const mongoose = require('mongoose');
const url = require('url');
const User = require('../model/userModel');

module.exports = {
  // GET
  getUsers: (req, res, next) => {
    const { page } = req.query;
    const { limit } = req.query;
    const fullUrl = `${req.protocol}://${req.get('host')}`;

    const customLabels = {
      totalDocs: 'totalUsers',
      docs: 'usersList',
      page: 'currentPage',
      nextPage: 'next',
      prevPage: 'prev',
    };

    // eslint-disable-next-line max-len
    const options = page === undefined || limit === undefined ? { pagination: false, customLabels } : {
      page,
      limit,
      customLabels,
    };

    User.paginate({}, options, (err, result) => {
      if (err) {
        return next(404);
      }
      const users = result.usersList.map((e) => {
        const { email, _id, roles } = e;
        return { email, _id, roles };
      });

      // header parameters
      const links = {
        first: `${fullUrl}/users?page=1&limit=${result.limit}`,
        last: `${fullUrl}/users?page=${result.totalPages}&limit=${result.limit}`,
        prev: result.hasPrevPage ? `${fullUrl}/users?page=${result.currentPage - 1}&limit=${result.limit}` : null,
        next: result.hasNextPage ? `${fullUrl}/users?page=${result.currentPage + 1}&limit=${result.limit}` : null,
      };

      // black magic fuckery
      res.links(links);
      res.json(users);
    });
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
        return res.json(doc);
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

  deleteUser: (req, res, next) => {
    // uid: email or id
    const { uid } = req.params;
    const byEmail = (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(uid);
    const filter = byEmail ? { email: uid } : { _id: uid };

    // eslint-disable-next-line max-len
    if (!req.user.roles.admin && uid.localeCompare(req.user._id) !== 0 && uid.localeCompare(req.user.email) !== 0) {
      return next(403);
    }

    User.findOneAndRemove(filter, (err, doc) => {
      if (err) {
        return next(404);
      }

      if (!doc) {
        console.log('user not found');
        return next(404);
      }

      console.log('deleted user:', doc);
      return res.json({ note: 'user deleted' });
    });
  },
};
