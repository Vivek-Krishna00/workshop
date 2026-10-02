const catalogService = require('../services/productService');
const { clearCache } = require('../middleware/cacheMiddleware');

const getProducts = async (request, response) => {
    try {
        const productList = await catalogService.getAllProducts();
        response.json(productList);
    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error');
    }
};

const getProductById = async (request, response) => {
    try {
        const productId = Number(request.params.id);
        if (isNaN(productId)) {
            return response.status(400).json({ message: 'Invalid product ID' });
        }
        const productRecord = await catalogService.getProductById(productId);
        if (!productRecord) {
            return response.status(404).json({ message: 'Product not found' });
        }
        response.json(productRecord);
    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error');
    }
};

const createProduct = async (request, response) => {
    try {
        const createdProduct = await catalogService.createProduct(request.body);
        clearCache();
        response.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error');
    }
};

const updateProduct = async (request, response) => {
    try {
        const productId = Number(request.params.id);
        if (isNaN(productId)) {
            return response.status(400).json({ message: 'Invalid product ID' });
        }
        const updatedProduct = await catalogService.updateProduct(productId, request.body);
        if (!updatedProduct) {
            return response.status(404).json({ message: 'Product not found' });
        }
        clearCache(productId);
        response.json(updatedProduct);
    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error');
    }
};

const patchProduct = async (request, response) => {
    try {
        const productId = Number(request.params.id);
        if (isNaN(productId)) {
            return response.status(400).json({ message: 'Invalid product ID' });
        }
        const patchedProduct = await catalogService.patchProduct(productId, request.body);
        if (!patchedProduct) {
            return response.status(404).json({ message: 'Product not found' });
        }
        clearCache(productId);
        response.json(patchedProduct);
    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error');
    }
};

const deleteProduct = async (request, response) => {
    try {
        const productId = Number(request.params.id);
        if (isNaN(productId)) {
            return response.status(400).json({ message: 'Invalid product ID' });
        }
        const deletedProduct = await catalogService.deleteProduct(productId);
        if (!deletedProduct) {
            return response.status(404).json({ message: 'Product not found' });
        }
        clearCache(productId);
        response.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        console.error(error);
        response.status(500).send('Server Error');
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct
};
