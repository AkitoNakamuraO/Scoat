var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const { checkAuthenticated, checkNotAuthenticated } = require("../parts/auth");
var createConnection = require("../parts/connectDB");
const { isEmpty, isCorrect, isUnique } = require("../parts/config_error");

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
    connection.query(sql, [location, description, url], function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
}

function insertAdmin(sql, spaceId, mail, password) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    await connection.query(sql, [spaceId, mail, password], function (err, rows, fields) {
      resolve(rows);
    });
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

const getSpaceName = function (sql, spaceId) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(sql, spaceId, function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
};

// login from index
router.get("/login/public", function (req, res, next) {
  req.session.destroy();
  res.render("login", { locationErrors: [], mailErrors: [], passErrors: [] });
});
//login from calender
router.get("/login", async function (req, res, next) {
  const sql = "SELECT space_name FROM spaces WHERE space_id = ?";
  const name = await getSpaceName(sql, req.session.spaceId);
  req.session.location = await name[0].space_name;
  res.render("login", { locationErrors: [], mailErrors: [], passErrors: [] });
});
router.post(
  "/login",
  function (req, res, next) {
    req.session.mail = req.body.mail;
    if (req.session.location == undefined) req.session.location = req.body.location;
    isEmpty(req, res, next);
  },
  function (req, res, next) {
    isCorrect(req, res, next);
  },
  passport.authenticate("local", {
    successRedirect: "/management",
    failureRedirect: "/admins/login",
    failureFlash: true,
  })
);

// register
router.get("/register", checkNotAuthenticated, function (req, res, next) {
  res.render("register", { locationErrors: [], mailErrors: [], passErrors: [] });
});
router.post(
  "/register",
  function (req, res, next) {
    req.session.mail = req.body.mail;
    req.session.location = req.body.location;
    isEmpty(req, res, next);
  },
  function (req, res, next) {
    isCorrect(req, res, next);
  },
  function (req, res, next) {
    isUnique(req, res, next);
  },
  async function (req, res, next) {
    const url = "mm";
    const { location, mail, password, description } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlSpace1 = "INSERT INTO spaces(space_name, space_description, space_url) VALUES(?,?,?);";
    const sqlSpace2 = "SELECT * FROM spaces WHERE space_name = ? AND space_url = ?;";
    const sqlAdmin = "INSERT INTO admins(space_id, admin_email, admin_password) VALUES(?,?,?);";

    await insertPlace(sqlSpace1, location, description, url);
    const result = await selectPlace(sqlSpace2, location, url);
    const placeId = result[0].space_id;
    await insertAdmin(sqlAdmin, placeId, mail, hashedPassword);

    res.redirect("/management");
  }
);

// logout
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});

//displayPart
router.get("/displayPart", (req, res, next) => {
  if (req.session.spaceId === undefined) {
    const data = { check: true };
    res.json(data);
  } else {
    const data = { check: false };
    res.json(data);
  }
});

module.exports = router;
