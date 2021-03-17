var express = require("express");
var router = express.Router();

//管理画面表示
router.get("/", (req, res, next) => {
  res.render("management");
});

//ログイン画面に遷移
router.get("/logout", (req, res, next) => {
  res.render("login");
});

//updatePasswordに遷移
router.get("/updatePwd", (req, res, next) => {
  res.render("updatePassword");
});
//パスワード変更処理
router.post("/updatePwd", (req, res, next)=> {
  res.redirect("/");
});

//updatePlaceに遷移
router.get("/updatePlace", (req, res, next) => {
  res.render("updatePlace");
});
//場所変更処理
router.post("/updatePlace", (req, res, next)=> {
  res.redirect("/");
});

//カレンダー表示
router.get("/schedule", (req, res, next) => {
  res.render("/schedule");
});

module.exports = router;
