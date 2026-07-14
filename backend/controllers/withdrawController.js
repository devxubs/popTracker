const { Withdraw } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all withdrawals
 * @route   GET /api/withdraws
 */
exports.getWithdraws = asyncHandler(async (req, res) => {
  const withdraws = await Withdraw.findAll({ order: [["date", "DESC"]] });
  res.status(200).json({ success: true, count: withdraws.length, data: withdraws });
});

/**
 * @desc    Create a new withdrawal
 * @route   POST /api/withdraws
 */
exports.createWithdraw = asyncHandler(async (req, res) => {
  const { partnerName, amount, date } = req.body;
  const withdraw = await Withdraw.create({ partnerName, amount, date });
  res.status(201).json({ success: true, data: withdraw });
});

/**
 * @desc    Delete a withdrawal
 * @route   DELETE /api/withdraws/:id
 */
exports.deleteWithdraw = asyncHandler(async (req, res) => {
  const withdraw = await Withdraw.findByPk(req.params.id);
  if (!withdraw) {
    return res.status(404).json({ success: false, message: "Withdraw not found" });
  }
  await withdraw.destroy();
  res.status(200).json({ success: true, data: {} });
});
