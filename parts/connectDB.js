const mysql = require("mysql");

const pool = mysql.createPool({
  host: "us-cdbr-east-03.cleardb.com",
  port: 3306,
  user: "b2d3e150901925",
  password: "c6661e08",
  database: "heroku_da2d3a32efc70bc",
  timezone: 'jst'
});

const createConnection = function () {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if (error) reject(error);
      resolve(connection);
    });
  });
};

module.exports = createConnection;
