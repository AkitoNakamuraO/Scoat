var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkNotAuthenticated } = require("../config/auth");
var createConnection = require("../parts/connectDB");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async function (username, password, done) {
      const sql = "SELECT * FROM users WHERE name = ?";
      const users = await checkUser(sql, username);
      for (i = 0; i < users.length; i++) {
        if (await bcrypt.compare(password, users[i].password)) {
          return done(null, { username, password, id: users[i].id });
        }
      }
      return done(null, false);
    }
  )
);

function insertUser(sql, username, hashedPassword) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(
      sql,
      [username, hashedPassword],
      function (err, rows, fields) {
        resolve(rows);
      }
    );
    connection.end();
  });
}

function checkUser(sql, username) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(sql, username, function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
}

function regist(sql, userId){
  return new Promise( async (resolve) => {
    var connection = await createConnection();
    connection.connect();
    connection.query(sql, userId, (err, results, fields) => {
      resolve(results);
    })
    connection.end();
  });
}

//takuya
// login
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post("/login", function (req, res, next) {

});

// register
router.get("/register", function (req, res, next) {
  res.render("register");
});
router.post("/register", function (req, res, next) {

});

// logout
router.post("/", function (req, res, next) {});

module.exports = router;
