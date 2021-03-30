var express = require("express");
var router = express.Router();
const createConnection = require("../parts/connectDB");

const getSchedules = function (sql, spaceId) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(sql, spaceId, function (err, rows, fields) {
      resolve(rows);
    });
    connection.end();
  });
};

const registerSchedules = function (sql, spaceId, date, start, end, contents) {
  return new Promise(async (resolve) => {
    const connection = await createConnection();
    connection.connect();
    connection.query(
      sql,
      [spaceId, date, start, end, contents],
      function (err, rows, fields) {
        resolve(rows);
      }
    );
    connection.end();
  });
};

// 画面を表示
router.get("/space/:id", function (req, res, next) {
  req.session.spaceId = req.params.id;
  res.render("schedule");
});

// スケジュール情報を取得
router.get("/get-schedules", async function (req, res, next) {
  const spaceId = req.session.spaceId;
  const sql = "SELECT * FROM schedules WHERE space_id = ?";
  const schedules = await getSchedules(sql, spaceId);
  res.json(schedules);
});

// 予定登録
router.get("/register", function (req, res, next) {
  res.render("registerSchedule");
});
router.post("/register", async function (req, res, next) {
  const { date, start, end, contents } = req.body;
  const spaceId = 1;
  const sql =
    "INSERT INTO schedules(space_id, schedule_date, schedule_start_time, schedule_end_time, schedule_contents) values(?, ?, ?, ?, ?);";
  await registerSchedules(sql, spaceId, date, start, end, contents);
  res.render("registerSchedule");
});

// 予定更新
router.get("/update", function (req, res, next) {});
router.post("/update", function (req, res, next) {});

module.exports = router;
