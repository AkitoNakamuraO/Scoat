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
  var reschedules = [];
  var today = moment();
  var weekend = today.clone().add(7, "days");
  var between = [];
  const spaceId = req.session.spaceId;
  const sql = `SELECT * FROM schedules WHERE space_id = ?`;
  const schedules = await getSchedules(sql, spaceId);

  console.log(today);
  console.log(weekend);
  var j = 0;
  var i = 0;
  for (i = 0; i < schedules.length; i++) {
    if (today.isSameOrBefore(schedules[i].schedule_date) && weekend.isSameOrAfter(schedules[i].schedule_date)) {
      between[j] = schedules[i];
      j++;
    }
  }

  console.log(between);
  console.log("\\\\\\\\\\");
  console.log(schedules);
  for(i=0;i<7;i++){
    reschedules[i] = [];
    today.add(1,"days");
    for(j=0;;j++){
      if(between[j] == null) break;
      reschedules[i][j]={};
      if(today.isSame(between[j].schedule_date, "days")){
        reschedules[i][j].id = between[j].schedule_id;
        reschedules[i][j].date = moment(between[j].schedule_date).format("YYYY/MM/DD");
        reschedules[i][j].startHour = between[j].schedule_start_time.substr(0, 2);
        reschedules[i][j].endHour = between[j].schedule_end_time.substr(0, 2);
        reschedules[i][j].startMinute = between[j].schedule_start_time.substr(3, 2);
        reschedules[i][j].endMinute = between[j].schedule_end_time.substr(3,2);
        reschedules[i][j].content = between[j].schedule_contents;
      }
    }
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
  const sql =
    "INSERT INTO schedules(space_id, schedule_date, schedule_start_time, schedule_end_time, schedule_contents) values(?, ?, ?, ?, ?);";
  await registerSchedules(sql, spaceId, date, start, end, contents);
  res.render("registerSchedule");
});

// 予定更新
router.get("/update", function (req, res, next) {});
router.post("/update", function (req, res, next) {});

module.exports = router;
