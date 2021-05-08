var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var { checkNotAuthenticated } = require("../parts/auth");
var createConnection = require("../parts/connectDB");

passport.use(
  new LocalStrategy(
    {
      usernameField: "mail",
      passwordField: "password",
    },
    async function (username, password, done) {
      const sql = "SELECT * FROM admins WHERE admin_email = ?";
      const users = await checkUser(sql, username);
      for (i = 0; i < users.length; i++) {
        if (await bcrypt.compare(password, users[i].admin_password)) {
          return done(null, { username, password, id: users[i].admin_id });
        }
      }
      return done(null, false);
    }
  )
);

function insertPlace(sql, location, description, url) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(
      sql,
      [location, description, url],
      function (err, rows, fields) {
        resolve(rows);
      }
    );
    connection.end();
  });
}

function insertAdmin(sql, spaceId, mail, password) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(
      sql,
      [spaceId, mail, password],
      function (err, rows, fields) {
        resolve(rows);
      }
    );
    connection.end();
  });
}

function selectPlace(sql, location, url) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, [location, url], function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
}

function checkUser(sql, username) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, username, function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
}

// login
router.get("/login", function (req, res, next) {
  res.render("login");
});
router.post(
  "/login",
  function (req, res, next) {
    if (
      req.body.location.length <= 0 ||
      req.body.mail.length <= 0 ||
      req.body.password.length <= 0
    ) {
      return res.redirect("/");
    }
    req.session.mail = req.body.mail;
    req.session.location = req.body.location;
    next();
  },
  passport.authenticate("local", {
    successRedirect: "/management",
    failureRedirect: "/admins/login",
    failureFlash: true,
  })
);

// register
router.get("/register", function (req, res, next) {
  res.render("register");
});
router.post("/register", async function (req, res, next) {
  const { location, mail, password, description } = req.body;
  req.session.mail = mail;
  req.session.location = location;
  const url = location;
  console.log('111111111111')
  console.log(url)
  const hashedPassword = await bcrypt.hash(password, 10);
  req.session.password = hashedPassword;
  const sqlSpace1 =
    "INSERT INTO spaces(space_name, space_description, space_url) VALUES(?,?,?);";
  const sqlSpace2 =
    "SELECT * FROM spaces WHERE space_name = ? AND space_url = ?;";
  const sqlAdmin =
    "INSERT INTO admins(space_id, admin_email, admin_password) VALUES(?,?,?);";

  await insertPlace(sqlSpace1, location, description, url);
  const result = await selectPlace(sqlSpace2, location, url);
  const placeId = result[0].space_id;
  await insertAdmin(sqlAdmin, placeId, mail, hashedPassword);

  res.redirect("/management");
});

// logout
router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/admins/login");
});

module.exports = router;
