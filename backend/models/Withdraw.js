const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

/**
 * Withdraw model
 * Represents money a partner takes OUT of the business.
 * Decreases cash balance.
 */
const Withdraw = sequelize.define(
  "Withdraw",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    partnerName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: "Partner name is required" } },
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: { args: [0.01], msg: "Amount must be greater than 0" } },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "withdraws",
    timestamps: true,
  }
);

module.exports = Withdraw;
