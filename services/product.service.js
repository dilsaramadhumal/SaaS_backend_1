const { Product } = require('../models');
const redis = require('../config/redis');

exports.createProduct = async(data, userId) => {
    const product = await Product.create({
        ...data,
        ownerId: userId
    });

    await redis.del('products_page_1');

    return product;
}

exports.getProducts = async(page = 1, limit = 10) => {
    const cacheKey = 'products_page_${page}';

    const cahced = await redis.get(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const offset = (page - 1) * limit;

    const products = await Product.findAll({
        limit,
        offset
    });

    await redis.set(
        cacheKey, JSON.stringify(products), 'EX', 60
    );

    return products;
}

exports.updateProduct = async( productId, user, data) => {
    const product = await Product.findByPk(productid);

    if (!product) {
        throw new Error('Product not found');
    }

    if (product.ownerId !== userId && user.role !== "admin") {
        throw new Error('Unauthorized');
    }

    await product.update(data);
    await redis.del('products_page_1');

    return product;
};

exports.deleteProduct = async (productId, user) => {
    const product = await Product.findByPk(productId);

    if (!product) {
        throw new Error('Product not found');
    }

    if (product.ownerId !== user.id && user.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    await product.destroy();
    await redis.del('products_page_1');

    return true;
}