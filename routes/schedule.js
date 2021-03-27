var express = require("express");
var router = express.Router();
const createConnectio = require("../parts/connectDB");

const getSchedule = function (spaceId) {};

// 画面を表示
router.get("/:spaceId", function (req, res, next) {
  req.session.id = req.params.spaceId;
  res.render("schedule");
});

module.exports = router;
