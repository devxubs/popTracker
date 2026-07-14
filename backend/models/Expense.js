const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Expense model
 * Represents a business cost (e.g., rent, marketing, transport).
 */
const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.ENUM(
        "Marketing",
        "Packaging",
        "Delivery",
        "Salary",
        "Office Rent",
        "Transport",
        "Utility",
        "Other"
      ),
      allowNull: false,
      defaultValue: "Other",
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "Amount cannot be negative" } },
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
  }
);

module.exports = Expense;
