const express = require("express");
const router = express.Router();
const {
  getWithdraws,
  createWithdraw,
  deleteWithdraw,
} = require("../controllers/withdrawController");

router.route("/").get(getWithdraws).post(createWithdraw);
router.route("/:id").delete(deleteWithdraw);

module.exports = router;
