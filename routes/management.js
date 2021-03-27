var express = require("express");
var createConnection = require("../parts/connectDB");
var router = express.Router();
var { checkNotAuthenticated } = require("../parts/auth");

function getAdminData(sql, userId){
  return new Promise( async (resolve) => {
    var connection = await createConnection();
    connection.connect();
    await connection.query(sql, userId, (err, results, fields) => {
      resolve(results);
    })
    connection.end();
  });
}

function updateData(sql, value1, value2){
  return new Promise( async (resolve) => {
    var connection = await createConnection();
    connection.connect();
    await connection.query(sql, [value1, value2], (err, results, fields) => {
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
  var mail = req.session.mail;
  var sql = "SELECT * FROM admins JOIN spaces WHERE admins.admin_email = ? AND admins.space_id = spaces.space_id";
  var admin = await getAdminData(sql, mail);
  res.json(admin);
});

//ログイン画面に遷移
router.get("/logout", (req, res, next) => {
  res.redirect("/admins/logout");
});

//updatePasswordに遷移
router.get("/updatePwd", (req, res, next) => {
  res.render("updatePassword");
});
//パスワード変更処理
router.post("/updatePwd", async (req, res, next)=> {
  var password = req.body.password;
  var mail = req.session.mail;
  var sql = "UPDATE admins SET admins.admin_password = ? JOIN spaces ON admins.space_id = spaces.space_id WHERE admins.admin_mail = ?"
  await updateData(sql, password, mail);
  res.redirect("/managemnt");
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
