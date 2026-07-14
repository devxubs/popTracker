const { Sale, Product } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");
const { sequelize } = require("../config/db");

/**
 * @desc    Get all sales
 * @route   GET /api/sales
 */
exports.getSales = asyncHandler(async (req, res) => {
  const sales = await Sale.findAll({ order: [["date", "DESC"]] });
  res.status(200).json({ success: true, count: sales.length, data: sales });
});

/**
 * @desc    Create a new sale
 *          Snapshots the sell price, calculates total, and decreases product stock.
 *          Wrapped in a transaction so the sale row and the stock decrement
 *          either both succeed or both roll back.
 * @route   POST /api/sales
 */
exports.createSale = asyncHandler(async (req, res) => {
  const { productId, quantity, date } = req.body;

  const result = await sequelize.transaction(async (t) => {
    const product = await Product.findByPk(productId, { transaction: t, lock: true });
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }

    if (product.stock < quantity) {
      const err = new Error(
        `Insufficient stock. Only ${product.stock} unit(s) available.`
      );
      err.statusCode = 400;
      throw err;
    }

    const totalPrice = product.sellPrice * quantity;

    const sale = await Sale.create(
      {
        productId: product.id,
        productName: product.name,
        quantity,
        sellPriceAtSale: product.sellPrice,
        totalPrice,
        date: date || new Date(),
      },
      { transaction: t }
    );

    // Reduce stock after a successful sale
    product.stock -= quantity;
    await product.save({ transaction: t });

    return sale;
  });

  res.status(201).json({ success: true, data: result });
});

/**
 * @desc    Delete a sale (restores stock back to the product)
 * @route   DELETE /api/sales/:id
 */
exports.deleteSale = asyncHandler(async (req, res) => {
  await sequelize.transaction(async (t) => {
    const sale = await Sale.findByPk(req.params.id, { transaction: t });
    if (!sale) {
      const err = new Error("Sale not found");
      err.statusCode = 404;
      throw err;
    }

    // Restore stock since the sale is being removed
    await Product.increment(
      { stock: sale.quantity },
      { where: { id: sale.productId }, transaction: t }
    );

    await sale.destroy({ transaction: t });
  });

  res.status(200).json({ success: true, data: {} });
});
