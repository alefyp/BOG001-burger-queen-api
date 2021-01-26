const mongoose = require('mongoose');
const Product = require('../model/productModel');

module.exports = {
  // POST
  addProduct: (req, res, next) => {
    req.body.dateEntry = Date.now();

    // Schema verification
    const product = new Product(req.body);
    const error = product.validateSync();

    if (error) {
      console.log(error.message, 'name, price missing / something bad formatted');
      return next(400);
    }

    product.save().then((doc) => res.json(doc)).catch((err) => {
      console.log(err.message);
      return next(403);
    });
  },

  // DELETE
  deleteProduct: (req, res, next) => {
    // product id
    const { productId } = req.params;
    console.log(productId, 'aqui');
    Product.findByIdAndDelete(productId, (err, doc) => {
      if (err) {
        return next(404);
      }

      if (!doc) {
        console.log('no product matches the id');
        return next(404);
      }
      return res.json({ note: `${doc.name} deleted` });
    });
  },
};
