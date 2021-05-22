var express = require("express");
var bcrypt = require("bcryptjs");
var createConnection = require("../parts/connectDB");
var router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require("../parts/auth");
const { isUnique, checkPassword } = require("../parts/config_error.js");

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
//パスワード更新
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

//場所情報更新
function updatePlace(sql) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, (err, results, fields) => {
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
  const sql =
    "SELECT * FROM admins JOIN spaces WHERE spaces.space_name = ? AND admins.admin_email = ? AND admins.space_id = spaces.space_id";
  const admin = await getAdminData(sql, location, mail);
  if (req.session.spaceId == undefined) req.session.spaceId = admin[0].space_id;
  res.json(admin);
});

//updatePasswordに遷移
router.get("/updatePwd", checkAuthenticated, (req, res, next) => {
  res.render("updatePassword", {
    locationErrors: [],
    mailErrors: [],
    passErrors: [],
  });
});
//パスワード変更処理
router.post(
  "/updatePwd",
  //パスワード比較(関数化してrequireすると、なぜか"関数名 is not function"とでる。？？？？)
  function (req, res, next) {
    checkPassword(req, res, next);
  },
  async (req, res, next) => {
    const password = req.body.password;
    const spaceId = req.session.spaceId;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "UPDATE admins SET admin_password = ? WHERE space_id = ?";
    await updateData(sql, hashedPassword, spaceId);
    res.redirect("/management");
  }
);

//updatePlaceに遷移
router.get("/updatePlace", checkAuthenticated, (req, res, next) => {
  res.render("updatePlace", {
    locationErrors: [],
    mailErrors: [],
    passErrors: [],
  });
});
//場所変更処理
router.post(
  "/updatePlace",
  function (req, res, next) {
    isUnique(req, res, next);
  },
  async (req, res, next) => {
    let location = req.session.location;
    let mail = req.session.mail;
    let spaceId = req.session.spaceId;

    //sql文(デフォルト)
    var sql = "UPDATE admins JOIN spaces ON admins.space_id = spaces.space_id SET spaces.space_name ='" 
    +location +"', admins.admin_email ='"
    +mail +"'";
    //session場所名更新
    if (req.session.location != req.body.location && req.body.location != "") {
      req.session.location = req.body.location;
      location = req.body.location;
    }
    //sessionメール更新
    if (req.session.mail != req.body.email && req.body.mail != "") {
      req.session.mail = req.body.mail;
      mail = req.body.mail;
    }
    //sql文更新
    sql = "UPDATE admins JOIN spaces ON admins.space_id = spaces.space_id SET spaces.space_name ='" 
    +location +"', admins.admin_email ='" 
    + mail +"'";
    //説明変更
    if (req.body.description != "") sql += ", spaces.space_description ='" + req.body.description + "'";
    //spaceIdで検索
    sql += " WHERE admins.space_id =" + spaceId + ";";

    await updatePlace(sql);
    
    res.redirect("/management");
  }
);

//カレンダー表示
router.get("/display", (req, res, next) => {
  const spaceId = req.session.spaceId;
  res.redirect("/schedule/space/" + spaceId);
});

module.exports = router;
