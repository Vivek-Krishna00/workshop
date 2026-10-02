const express = require('express');
const catalogRouter = express.Router();
const catalogController = require('../controllers/productController');
const { cacheMiddleware, itemCacheMiddleware } = require('../middleware/cacheMiddleware');

catalogRouter.get('/', cacheMiddleware, catalogController.getProducts);
catalogRouter.get('/:id', itemCacheMiddleware, catalogController.getProductById);

catalogRouter.post('/', catalogController.createProduct);

catalogRouter.put('/:id', catalogController.updateProduct);

catalogRouter.patch('/:id', catalogController.patchProduct);

catalogRouter.delete('/:id', catalogController.deleteProduct);

module.exports = catalogRouter;
