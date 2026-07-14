const { Product } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all products
 * @route   GET /api/products
 */
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
  res.status(200).json({ success: true, count: products.length, data: products });
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 */
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, buyPrice, sellPrice, stock } = req.body;
  const product = await Product.create({ name, buyPrice, sellPrice, stock });
  res.status(201).json({ success: true, data: product });
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  await product.update(req.body); // runs validators automatically
  res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  await product.destroy(); // throws SequelizeForeignKeyConstraintError if sales reference it
  res.status(200).json({ success: true, data: {} });
});
