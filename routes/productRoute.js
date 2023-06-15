const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create a product
router.post("/", productController.createProduct);

// Retrieve all products
router.get("/", productController.getProducts);

// Retrieve a product by ID
router.get("/get/:id", productController.getProductById);

// Update a product by ID
router.patch("/:id", productController.updateProductById);

// Delete a product by ID
router.delete("/:id", productController.deleteProductById);

// Search products by name, description, or variant name
router.get("/search", productController.search);

module.exports = router;
