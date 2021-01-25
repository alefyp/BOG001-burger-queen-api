const mongoose = require('mongoose');
const User = require('../model/userModel');

module.exports = {
  addProduct: (req, res, next) => {
    const {
      name,
      price,
      image,
      type,
    } = req.body;

    console.log(req.headers.authorization);

    if (!name || !price) {
      console.log('No name or price');
      return next(400);
    }

    if (!req.headers.authorization) {
      console.log('No auth header');
      return next(401);
    }
  },
};
