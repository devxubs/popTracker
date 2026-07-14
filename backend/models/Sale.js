const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Sale model
 * Represents a single sale transaction of a product.
 * totalPrice = quantity * sellPriceAtSale (snapshotted so historic reports stay accurate
 * even if the product's sellPrice changes later).
 */
const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "products", key: "id" },
    },
    productName: {
      // snapshot of product name at time of sale
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: { args: [1], msg: "Quantity must be at least 1" } },
    },
    sellPriceAtSale: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "sales",
    timestamps: true,
  }
);

module.exports = Sale;
