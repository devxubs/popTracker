const Product = require("./Product");
const Sale = require("./Sale");
const Expense = require("./Expense");
const Investment = require("./Investment");
const Withdraw = require("./Withdraw");

/**
 * Associations
 * A Product can have many Sales; a Sale belongs to one Product.
 * Deleting a Sale does NOT cascade-delete the Product (and vice versa
 * is prevented at the application level in the controller, since a
 * product with sale history shouldn't disappear silently).
 */
Product.hasMany(Sale, { foreignKey: "productId", onDelete: "RESTRICT" });
Sale.belongsTo(Product, { foreignKey: "productId" });

module.exports = { Product, Sale, Expense, Investment, Withdraw };
