var express = require("express");
var createConnection = require("../parts/connectDB");
var router = express.Router();

function getAdminData(sql, userId){
  return new Promise( async (resolve) => {
    var connection = await createConnection();
    connection.connect();
    connection.query(sql, userId, (err, results, fields) => {
      resolve(results);
    })
    connection.end();
  });
}

//管理画面表示
router.get("/", (req, res, next) => {
  res.render("management");
});
//管理者データ取得
router.get("/getData", async (req, res, next) => {
  //※userId セッション使用してない
  var userId = 1;
  var sql = "SELECT * FROM admins JOIN spaces WHERE admins.admin_id = ?";
  var admin = await getAdminData(sql, userId);
  console.log(admin);
  res.json(admin);
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
