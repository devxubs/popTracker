const { Expense } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all expenses
 * @route   GET /api/expenses
 */
exports.getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.findAll({ order: [["date", "DESC"]] });
  res.status(200).json({ success: true, count: expenses.length, data: expenses });
});

/**
 * @desc    Create a new expense
 * @route   POST /api/expenses
 */
exports.createExpense = asyncHandler(async (req, res) => {
  const { category, amount, note, date } = req.body;
  const expense = await Expense.create({ category, amount, note, date });
  res.status(201).json({ success: true, data: expense });
});

/**
 * @desc    Update an expense
 * @route   PUT /api/expenses/:id
 */
exports.updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }
  await expense.update(req.body);
  res.status(200).json({ success: true, data: expense });
});

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 */
exports.deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }
  await expense.destroy();
  res.status(200).json({ success: true, data: {} });
});
