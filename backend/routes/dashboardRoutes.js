const express = require("express");
const router = express.Router();
const { getSummary, getReport } = require("../controllers/dashboardController");

router.get("/summary", getSummary);
router.get("/report", getReport);

module.exports = router;
