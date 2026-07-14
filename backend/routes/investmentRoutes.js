const express = require("express");
const router = express.Router();
const {
  getInvestments,
  createInvestment,
  deleteInvestment,
} = require("../controllers/investmentController");

router.route("/").get(getInvestments).post(createInvestment);
router.route("/:id").delete(deleteInvestment);

module.exports = router;
