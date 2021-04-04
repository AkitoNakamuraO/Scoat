"use strict";

// 予定を取得
const getSchedule = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/schedule/get-schedules";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    // const schedules = request.response;
    const schedules = [
      [
        [0, 0, 3, 30],
        [3, 30, 5, 50],
        [0, 0, 3, 30],
        [3, 30, 5, 50],
        [0, 0, 3, 30],
        [3, 30, 5, 50],
        [0, 0, 3, 30],
        [3, 30, 5, 50],
      ],
      [
        [5, 50, 18, 40],
        [18, 40, 21, 0],
      ],
    ];
    createWeek(schedules);
  };
};

// 一週間分の予定を表示
const createWeek = function (schedules) {
  let hourFlag = false; // 予定があるかを判断するためのフラグ（時間）
  let minuteFlag = false; // 予定があるかを判断するためのフラグ（分）
  const WEEK = schedules.length; //一週間分
  const HOURS = 24; //時間
  const MINUTES = 60; //分

  const schedulesArea = document.getElementById("schedules-area");
  for (let i = 0; i < WEEK; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    const date = document.createElement("div");
    date.classList.add("date");
    date.innerHTML = "4/1";
    const times = document.createElement("div");
    times.classList.add("times");
    for (let j = 0; j < schedules[i].length; j++) {
      const time = document.createElement("div");
      time.classList.add("time");
      for (let k = 0; k < HOURS; k++) {
        const hour = document.createElement("div");
        hour.classList.add("hour");
        if (k === schedules[i][j][0]) {
          hourFlag = true;
        } else if (k === schedules[i][j][2]) {
          hourFlag = false;
        }
        for (let l = 0; l < MINUTES; l++) {
          const minute = document.createElement("div");
          minute.classList.add("minute");
          if (hourFlag === true && l === schedules[i][j][1]) {
            minuteFlag = true;
          } else if (hourFlag === false && l === schedules[i][j][3]) {
            minuteFlag = false;
          }
          if (minuteFlag === true) {
            minute.classList.add("scheduled");
          }
          hour.appendChild(minute);
        }
        time.appendChild(hour);
      }
      times.appendChild(time);
    }
    // dayに日付要素を追加
    day.appendChild(date);
    // dayに時間要素を追加する
    day.appendChild(times);
    // 一日分をスケジュールエリアに追加する
    schedulesArea.appendChild(day);
  }
};

// 予定取得関数を実行
getSchedule();
