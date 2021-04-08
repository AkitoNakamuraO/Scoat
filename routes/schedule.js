var express = require("express");
var router = express.Router();
const createConnection = require("../parts/connectDB");
const moment = require("moment");

function dateFormat(date, format) {
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
    connection.query(sql, [spaceId, date, start, end, contents], function (err, rows, fields) {
      resolve(rows);
    });
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
  const reschedules = [];
  const today = moment();
  const weekend = today.clone().add(7, "days");
  const between = [];
  const sql = `SELECT * FROM schedules WHERE space_id = ?`;
  const schedules = await getSchedules(sql, spaceId);

  let j = 0;
  let i = 0;
  for (i = 0; i < schedules.length; i++) {
    if (today.isSameOrBefore(schedules[i].schedule_date, "days") && weekend.isSameOrAfter(schedules[i].schedule_date, "days")) {
      between[j] = schedules[i];
      j++;
    }
  }

  for (i = 0; i < 7; i++) {
    reschedules[i] = [];
    let count = 0;
    for (j = 0; j < between.length; j++) {
      if (today.isSame(between[j].schedule_date, "days")) {
        reschedules[i][count] = {};
        reschedules[i][count].id = between[j].schedule_id;
        reschedules[i][count].date = moment(between[j].schedule_date).format("MM/DD");
        reschedules[i][count].startHour = between[j].schedule_start_time.substr(0, 2);
        reschedules[i][count].endHour = between[j].schedule_end_time.substr(0, 2);
        reschedules[i][count].startMinute = between[j].schedule_start_time.substr(3, 2);
        reschedules[i][count].endMinute = between[j].schedule_end_time.substr(3, 2);
        reschedules[i][count].content = between[j].schedule_contents;
        count++;
      }
    }
    today.add(1, "days");
  }
  console.log(reschedules);
  res.json(reschedules);
});

// 予定登録
router.get("/register", function (req, res, next) {
  res.render("registerSchedule");
});
router.post("/register", async function (req, res, next) {
  const { date, start, end, contents } = req.body;
  const spaceId = 1;
  const sql = "INSERT INTO schedules(space_id, schedule_date, schedule_start_time, schedule_end_time, schedule_contents) values(?, ?, ?, ?, ?);";
  await registerSchedules(sql, spaceId, date, start, end, contents);
  res.redirect("space/1");
});

// 予定更新
router.get("/update", function (req, res, next) {});
router.post("/update", function (req, res, next) {});

module.exports = router;
