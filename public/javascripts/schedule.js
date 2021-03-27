"use strict";

// 予定を取得
const getSchedule = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/schedule/get-schedules";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  // request.onload = function () {
  //   const schedules = request.response;
  //   printSchedules(schedules);
  // };
};

// 一週間分の列を作る
const createWeek = function (today) {
  const schedulesArea = document.getElementById("schedules-area");
  const WEEK = 7;
  const TIME = 24;
  for (let i = 0; i <= WEEK; i++) {
    const day = document.createElement("div");
    const date = document.createElement("div");
    date.innerHTML = today.getMonth() + 1 + "/" + today.getDate();
    const time = document.createElement("div");
    for (let i = 0; i < TIME * 6; i++) {
      const cell = document.createElement("div");
      cell.innerHTML = "a";
      time.appendChild(cell);
    }
    // dayに日付要素を追加
    day.appendChild(date);
    // dayに時間要素を追加する
    day.appendChild(time);
    // 一日分をスケジュールエリアに追加する
    schedulesArea.appendChild(day);
    // 次の日に設定する
    today.setDate(today.getDate() + 1);
  }
};

createWeek(new Date());
getSchedule();
