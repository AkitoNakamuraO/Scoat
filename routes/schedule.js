var express = require("express");
var router = express.Router();
const createConnectio = require("../parts/connectDB");

const getSchedule = function (spaceId) {};

// 画面を表示
router.get("/space/:id", function (req, res, next) {
  // req.session.id = req.params.id;
  console.log(req.session);
  res.render("schedule");
});

// スケジュール情報を取得
router.get("/get-schedules", function (req, res, next) {
  console.log(req.session);
  res.redirect("/");
});

module.exports = router;
