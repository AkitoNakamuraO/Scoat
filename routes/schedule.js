var express = require("express");
var router = express.Router();
const createConnectio = require("../parts/connectDB");

const getSchedule = function (spaceId) {};

// 画面を表示
router.get("/", function (req, res, next) {
  res.render("schedule");
});

router.get("/get-schedules/:space-id", function (req, res, next) {
  res.json();
});

module.exports = router;
