const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  addProduct,
  deleteProduct
} = require('../controller/products');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, (req, resp, next) => {
  });

  app.get('/products/:productId', requireAuth, (req, resp, next) => {
  });

  app.post('/products', requireAdmin, addProduct);

  app.put('/products/:productId', requireAdmin, (req, resp, next) => {
  });

  app.delete('/products/:productId', deleteProduct);

  nextMain();
};
