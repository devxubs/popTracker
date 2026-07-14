const { Investment } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all investments
 * @route   GET /api/investments
 */
exports.getInvestments = asyncHandler(async (req, res) => {
  const investments = await Investment.findAll({ order: [["date", "DESC"]] });
  res.status(200).json({ success: true, count: investments.length, data: investments });
});

/**
 * @desc    Create a new investment
 * @route   POST /api/investments
 */
exports.createInvestment = asyncHandler(async (req, res) => {
  const { partnerName, amount, date } = req.body;
  const investment = await Investment.create({ partnerName, amount, date });
  res.status(201).json({ success: true, data: investment });
});

/**
 * @desc    Delete an investment
 * @route   DELETE /api/investments/:id
 */
exports.deleteInvestment = asyncHandler(async (req, res) => {
  const investment = await Investment.findByPk(req.params.id);
  if (!investment) {
    return res.status(404).json({ success: false, message: "Investment not found" });
  }
  await investment.destroy();
  res.status(200).json({ success: true, data: {} });
});
