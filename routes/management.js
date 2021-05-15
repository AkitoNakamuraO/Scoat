var express = require("express");
var createConnection = require("../parts/connectDB");
var router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require("../parts/auth");

//データ取得
function getAdminData(sql, location, mail) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, [location, mail], (err, results, fields) => {
      resolve(results);
    });
    connection.end();
  });
}
//データを更新
function updateData(sql, value1, value2) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, [value1, value2], (err, results, fields) => {
      resolve(results);
    });
    connection.end();
  });
}

//管理画面表示
router.get("/", (req, res, next) => {
  res.render("management");
});
//管理者データ取得
router.get("/getData", async (req, res, next) => {
  const mail = req.session.mail;
  const location = req.session.location;
  const sql = "SELECT * FROM admins JOIN spaces WHERE spaces.space_name = ? AND admins.admin_email = ? AND admins.space_id = spaces.space_id";
  const admin = await getAdminData(sql, location, mail);
  if (req.session.spaceId == undefined) req.session.spaceId = admin[0].space_id;
  res.json(admin);
});

//updatePasswordに遷移
router.get("/updatePwd", checkAuthenticated, (req, res, next) => {
  res.render("updatePassword");
});
//パスワード変更処理
router.post("/updatePwd", async (req, res, next) => {
  const password = req.body.password;
  const mail = req.session.mail;
  const sql = "UPDATE admins SET admins.admin_password = ? JOIN spaces ON admins.space_id = spaces.space_id WHERE admins.admin_mail = ?";
  await updateData(sql, password, mail);
  res.redirect("/managemnt");
});

//updatePlaceに遷移
router.get("/updatePlace", checkAuthenticated, (req, res, next) => {
  res.render("updatePlace");
});
//場所変更処理
router.post("/updatePlace", (req, res, next) => {
  res.redirect("/");
});

//カレンダー表示
router.get("/display", (req, res, next) => {
  const spaceId = req.session.spaceId;
  res.redirect("/schedule/space/" + spaceId);
});

module.exports = router;
