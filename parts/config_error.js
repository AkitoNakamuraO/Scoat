const createConnection = require("../parts/connectDB");

function checkData(sql, email) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, email, function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
}

function isEmpty(req, res, next) {
  const locationErrors = [];
  const mailErrors = [];
  const passErrors = [];
  const location = req.body.location;
  const mail = req.body.mail;
  const password = req.body.password;

  if (location == "") locationErrors.push("場所を入力してください。");
  if (mail === "") mailErrors.push("Eメールを入力してください。");
  if (password === "") passErrors.push("パスワードを入力してください。");

  if (
    locationErrors.length > 0 ||
    mailErrors.length > 0 ||
    passErrors.length > 0
  ) {
    res.render("login", {
      locationErrors: locationErrors,
      mailErrors: mailErrors,
      passErrors: passErrors,
    });
  } else next();
}

function isCorrect(req, res, next) {
  const mailErrors = [];
  const reg = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/; 
  const email = req.body.mail;

  if (reg.test(email) === false) mailErrors.push("有効なメールアドレスを入力してください。");

  if (mailErrors.length > 0) res.render("login", {locationErrors: [], mailErrors: mailErrors, passErrors: []});
  else next();
}

async function isUnique(req, res, next){
  const location = req.body.location;
  const mail = req.body.mail;
  const mailErrors = [];
  const sql = "SELECT * FROM admins JOIN spaces ON admins.space_id = spaces.space_id WHERE admins.admin_email = ?";
  const data = await checkData(sql, mail);
  var i,count=0;

  for(i=0;i<data.length;i++){
    if(location == data[i].space_name){
      mailErrors.push("場所が重複しています。");
      mailErrors.push("(※)1つのメールに複数の同じ名前の場所は登録できません。");
      mailErrors.join("\n");
      break;
    }
  }

  if(mailErrors.length > 0) res.render("register", {locationErrors: [], mailErrors: mailErrors, passErrors: []});
  else next();
}

module.exports = { isEmpty, isCorrect, isUnique};
