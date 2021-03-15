var express = require("express");
var router = express.Router();

//管理画面表示
router.get("/", (req, res, next) => {
  res.render("management", {title: "Scoat"});
});

//ログアウト //get or post
router.post("/logout", (req, res, next) => {
  res.send("logout");
});

//パスワード変更
router.get("/changePwd", (req, res, next) => {
  res.send("changePwd");
});

//場所情報を編集
router.get("/changePlace", (req, res, next) => {
  res.send("changePlace");
});

//カレンダー表示
router.get("/display", (req, res, next) => {
  res.send("display");
});

module.exports = router;
