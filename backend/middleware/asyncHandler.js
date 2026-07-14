/**
 * Wraps an async controller function so any thrown error
 * is automatically forwarded to Express's error handler.
 * Avoids repeating try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
