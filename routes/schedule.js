var express = require("express");
var router = express.Router();
const createConnection = require("../parts/connectDB");
const moment = require("moment");

function dateFormat(date, format){
  format = format.replace(/YYYY/, date.getFullYear());
  format = format.replace(/MM/, date.getMonth() + 1);
  format = format.replace(/DD/, date.getDate());

    return format;
}

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
  // 拓也が作るところ
  var today = moment().format("YYYY-MM-DD");
  var weekend = today.add(7,"days").format("YYYY-MM-DD");
  const spaceId = req.session.spaceId;
  const sql = `SELECT * FROM schedules WHERE space_id = ? AND schedule_date BETWEEN ${today} AND ${weekend}`;
  const schedules = await getSchedules(sql, spaceId);
  for(var ){
    
  }
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
