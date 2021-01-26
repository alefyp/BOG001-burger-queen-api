const mongoose = require('mongoose');
const Product = require('../model/productModel');

module.exports = {

  // GET/products
  getProducts: (req, res, next) => {
    const { page } = req.query;
    const { limit } = req.query;
    const fullUrl = `${req.protocol}://${req.get('host')}${req.route.path}`;

    const customLabels = {
      totalDocs: 'totalProducts',
      docs: 'productsList',
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

    Product.paginate({}, options, (err, result) => {
      if (err) {
        return next(404);
      }

      const products = result.productsList.map((e) => e);

      const links = {
        first: `${fullUrl}?page=1&limit=${result.limit}`,
        last: `${fullUrl}?page=${result.totalPages}&limit=${result.limit}`,
        prev: result.hasPrevPage ? `${fullUrl}?page=${result.currentPage - 1}&limit=${result.limit}` : null,
        next: result.hasNextPage ? `${fullUrl}?page=${result.currentPage + 1}&limit=${result.limit}` : null,
      };

      res.links(links);
      res.json(products);
    });
  },

  // GET/products/:productId
  // Just wanted to use async await ...
  getProduct: async (req, res, next) => {
    const { productId } = req.params;
    try {
      const doc = await Product.findById(productId).exec();
      return res.json(doc);
    } catch (err) {
      return next(404);
    }
  },

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

  // PUT
  editProduct: (req, res, next) => {
    // productId
    const { productId } = req.params;
    console.log(productId);

    const productUpdate = req.body;

    Product.findByIdAndUpdate(productId, productUpdate, { new: true }, (err, doc) => {
      if (!doc) {
        return next(404);
      }

      console.log('product updated!', doc);
      return res.json(doc);
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
