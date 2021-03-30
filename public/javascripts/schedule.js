"use strict";

// 予定を取得
const getSchedule = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/schedule/get-schedules";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    const schedules = request.response;
    console.log(schedules);
    printSchedules(schedules);
  };
};

// 一週間分の列を作る
const createWeek = function (today) {
  const schedulesArea = document.getElementById("schedules-area");
  const WEEK = 7;
  const HOURS = 24;
  const MINUTES = 60;
  for (let i = 0; i <= WEEK; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    const date = document.createElement("div");
    date.classList.add("date");
    date.innerHTML = today.getMonth() + 1 + "/" + today.getDate();
    const time = document.createElement("div");
    time.classList.add("time");
    for (let i = 0; i < HOURS; i++) {
      const hour = document.createElement("div");
      hour.classList.add("hour");
      for (let i = 0; i < MINUTES; i++) {
        const minute = document.createElement("div");
        minute.classList.add("minute");
        hour.appendChild(minute);
      }
      time.appendChild(hour);
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

// 予定よ表示
const printSchedules = function (schedules) {};

createWeek(new Date());
getSchedule();
