const Product = require("./../models/productModel");

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve a product by ID
exports.getProductById = async (req, res) => {
  try {
    console.log("entered get Product by id api");
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search products by name, description, or variant name
exports.search = async (req, res) => {
  console.log("This is filter api");
  const query = req.query.key; // Get the keyword from the parameter
  const regex = new RegExp(query, "i"); // Create a case-insensitive regular expression

  // Find products matching the keyword in the name, description, or variant name
  Product.find({
    $or: [{ name: regex }, { description: regex }, { "variants.name": regex }],
  })
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error" });
    });
};
