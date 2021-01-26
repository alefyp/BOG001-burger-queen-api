const mongoose = require('mongoose');
const Product = require('../model/productModel');

module.exports = {

  // POST
  addProduct: (req, res, next) => {
    const {
      name,
      price,
    } = req.body;

    req.body.dateEntry = Date.now();

    // Schema verification
    const product = new Product(req.body);
    const error = product.validateSync();

    if (error) {
      console.log(error.message);
      return next(400);
    }

    product.save().then((doc) => {
      console.log('new product added!', doc);
      console.log(mongoose.connection.readyState);
      // mongoose.connection.close();
      return res.json(doc);
    }).catch((err) => {
      console.log(err.message || 'not valid data entry');
      return next(403);
    });
  },
};
