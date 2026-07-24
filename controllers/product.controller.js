const productService = require('../services/product.service');

exports.createProduct = async(req, res, next) => {
    try{
        const product = await productService.createProduct(req.body, req.user.id);

        res.status(201).json(product);
    } catch (error){
        next(error);
    }
}

exports.getProducts = async(req, res, next) => {
    try{
        const page = req.query.page || 1;

        const products = await productService.getProducts(page);
        res.json(products);
    } catch (error){
        next(error);
    }
}

exports.updateProduct = async(req, res, next) => {
    try{
        const product = await productService.updateProduct(req.params.id, req.body, req.user);
        res.json(product);
    } catch (error){
        next(error);
    }
}

exports.deleteProduct = async(req, res, next) => {
    try{
        await productService.deleteProduct(req.params.id, req.user);
        res.json({message: 'Deleted successfully'});
    } catch (error){
        next(error);
    }
}