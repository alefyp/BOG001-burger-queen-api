const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');

const {
  addProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts,
} = require('../controller/products');

module.exports = (app, nextMain) => {
  app.get('/products', requireAuth, getProducts);

  app.get('/products/:productId', requireAuth, getProduct);

  app.post('/products', requireAdmin, addProduct);

  app.put('/products/:productId', requireAdmin, editProduct);

  app.delete('/products/:productId', requireAdmin, deleteProduct);

  nextMain();
};
