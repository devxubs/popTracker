const { Op, fn, col } = require("sequelize");
const { Sale, Expense, Investment, Withdraw } = require("../models");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * Helper: sums a numeric column for a model, optionally filtered by a where clause.
 * Returns 0 instead of null when there are no matching rows.
 */
const sumColumn = async (Model, column, where = {}) => {
  const result = await Model.findOne({
    attributes: [[fn("SUM", col(column)), "total"]],
    where,
    raw: true,
  });
  return Number(result.total) || 0;
};

/**
 * @desc    Get dashboard summary totals
 *          - Total Sales, Total Expenses, Total Profit
 *          - Total Investment, Total Withdraw
 *          - Cash Balance = Investment - Withdraw + Sales - Expenses
 * @route   GET /api/dashboard/summary
 */
exports.getSummary = asyncHandler(async (req, res) => {
  const [totalSales, totalExpenses, totalInvestment, totalWithdraw] = await Promise.all([
    sumColumn(Sale, "totalPrice"),
    sumColumn(Expense, "amount"),
    sumColumn(Investment, "amount"),
    sumColumn(Withdraw, "amount"),
  ]);

  // Net profit = revenue from sales minus operating expenses
  const totalProfit = totalSales - totalExpenses;

  // Cash on hand = money put in + money earned - money taken out - money spent
  const cashBalance = totalInvestment + totalSales - totalWithdraw - totalExpenses;

  res.status(200).json({
    success: true,
    data: {
      totalSales,
      totalExpenses,
      totalProfit,
      totalInvestment,
      totalWithdraw,
      cashBalance,
    },
  });
});

/**
 * Helper: builds a start/end Date range for "daily" | "monthly" | "yearly" | custom.
 */
const getDateRange = (period, from, to) => {
  const now = new Date();
  let start, end;

  if (period === "daily") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  } else if (period === "monthly") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (period === "yearly") {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear() + 1, 0, 1);
  } else if (from && to) {
    // custom range
    start = new Date(from);
    end = new Date(to);
    end.setDate(end.getDate() + 1); // include the "to" day fully
  } else {
    // fallback: all time
    start = new Date(0);
    end = new Date(8640000000000000);
  }

  return { start, end };
};

/**
 * @desc    Get a report (sales, expenses, profit) for a given period
 * @route   GET /api/dashboard/report?period=daily|monthly|yearly|custom&from=&to=
 */
exports.getReport = asyncHandler(async (req, res) => {
  const { period, from, to } = req.query;
  const { start, end } = getDateRange(period, from, to);

  const dateWhere = { date: { [Op.gte]: start, [Op.lt]: end } };

  const [sales, expenses] = await Promise.all([
    Sale.findAll({ where: dateWhere, order: [["date", "ASC"]] }),
    Expense.findAll({ where: dateWhere, order: [["date", "ASC"]] }),
  ]);

  const totalSales = sales.reduce((sum, s) => sum + Number(s.totalPrice), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const netProfit = totalSales - totalExpenses;

  res.status(200).json({
    success: true,
    data: {
      period: period || "custom",
      range: { start, end },
      totalSales,
      totalExpenses,
      netProfit,
      sales,
      expenses,
    },
  });
});
