/**
 * Centralized error handler.
 * Any error passed to next(err) in a controller ends up here,
 * so we get consistent JSON error responses across the whole API.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Sequelize validation error (e.g. failed a model-level validate rule)
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  // Sequelize unique constraint violation
  if (err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(409).json({ success: false, message: messages.join(", ") });
  }

  // Sequelize foreign key constraint violation (e.g. deleting a product that has sales)
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(409).json({
      success: false,
      message: "This record is referenced by other data and cannot be deleted.",
    });
  }

  // Invalid numeric ID passed in the URL (e.g. /api/products/abc)
  if (err.name === "SequelizeDatabaseError") {
    return res.status(400).json({ success: false, message: "Invalid request data" });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

module.exports = errorHandler;
