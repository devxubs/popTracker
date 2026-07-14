const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Product model
 * Represents an item the business buys and sells.
 * Stock is auto-decremented whenever a Sale is recorded for this product.
 */
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Product name is required" } },
    },
    buyPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "Buy price cannot be negative" } },
    },
    sellPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "Sell price cannot be negative" } },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: "Stock cannot be negative" } },
    },
  },
  {
    tableName: "products",
    timestamps: true, // adds createdAt / updatedAt columns
  }
);

module.exports = Product;
