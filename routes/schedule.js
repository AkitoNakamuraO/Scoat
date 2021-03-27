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

module.exports = router;
