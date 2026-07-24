const express = require("express");
const router = express.Router();

const productController = require(
  "../controllers/product.controller"
);

const validate = require(
  "../middleware/validate.middleware"
);

const {
  productSchema
} = require("../validators/product.validator");

const {
  authenticate
} = require("../middleware/auth.middleware");

router.post(
  "/",
  authenticate,
  validate(productSchema),
  productController.createProduct
);

router.get(
  "/",
  productController.getProducts
);

router.put(
  "/:id",
  authenticate,
  productController.updateProduct
);

router.delete(
  "/:id",
  authenticate,
  productController.deleteProduct
);

module.exports = router;