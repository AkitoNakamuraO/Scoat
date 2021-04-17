"use strict";

let schedules; //予定

// 予定を取得
const getSchedule = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/schedule/get-schedules";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    schedules = request.response;
    createWeek(schedules);
  };
};

// 一週間分の予定を表示
const createWeek = function (schedules) {
  let hourFlag = false; // 予定があるかを判断するためのフラグ（時間）
  let minuteFlag = false; // 予定があるかを判断するためのフラグ（分）
  const today = new Date();
  const WEEK = schedules.length; //一週間分
  const HOURS = 24; //時間
  const MINUTES = 60; //分

  const schedulesColumn = document.getElementById("schedules-column");
  for (let i = 0; i < WEEK; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    const date = document.createElement("div");
    date.classList.add("date");
    date.classList.add("table-header");
    date.innerHTML = today.getMonth() + 1 + "/" + today.getDate();
    const times = document.createElement("div");
    times.classList.add("times");
    let j = 0;
    while (true) {
      if (j >= 3 && schedules[i].length <= 3) break;
      if (j >= 3 && j == schedules[i].length) break;
      const time = document.createElement("div");
      time.classList.add("time");
      for (let k = 0; k < HOURS; k++) {
        const hour = document.createElement("div");
        hour.classList.add("hour");
        if (schedules[i][j] != undefined) {
          if (k == schedules[i][j].startHour) {
            hourFlag = true;
          } else if (k == schedules[i][j].endHour) {
            hourFlag = false;
          }
        }
        for (let l = 0; l < MINUTES; l++) {
          const minute = document.createElement("div");
          minute.classList.add("minute");
          if (schedules[i][j] != undefined) {
            if (hourFlag == true && l == schedules[i][j].startMinute) {
              minuteFlag = true;
            } else if (hourFlag == false && l == schedules[i][j].endMinute) {
              minuteFlag = false;
            }
          }
          if (minuteFlag == true) {
            minute.classList.add("scheduled");
            const scheduleId = schedules[i][j].id;
            minute.setAttribute("onclick", `displayDetails(${scheduleId})`);
          }
          hour.appendChild(minute);
        }
        time.appendChild(hour);
      }
      times.appendChild(time);
      j++;
    }
    // dayに日付要素を追加
    day.appendChild(date);
    // dayに時間要素を追加する
    day.appendChild(times);
    // 一日分をスケジュールエリアに追加する
    schedulesColumn.appendChild(day);
    // 次の日に設定
    today.setDate(today.getDate() + 1);
  }
};

// 予定取得関数を実行
getSchedule();

// タップされた予定の詳細表示
const displayDetails = function (scheduleId) {
  const scheduleDetails = document.getElementById("schedule-details");
  scheduleDetails.classList.remove("display-none");
  const scheduleDate = document.getElementById("schedule-date");
  const scheduleStartHour = document.getElementById("schedule-start-hour");
  const scheduleStartMinute = document.getElementById("schedule-start-minute");
  const scheduleEndHour = document.getElementById("schedule-end-hour");
  const scheduleEndMinute = document.getElementById("schedule-end-minute");
  const scheduleContent = document.getElementById("schedule-content");
  for (let i = 0; i < schedules.length; i++) {
    for (let j = 0; j < schedules[i].length; j++) {
      if (schedules[i][j].id == scheduleId) {
        scheduleDate.innerHTML = schedules[i][j].date;
        scheduleStartHour.innerHTML = schedules[i][j].startHour;
        scheduleStartMinute.innerHTML = schedules[i][j].startMinute;
        scheduleEndHour.innerHTML = schedules[i][j].endHour;
        scheduleEndMinute.innerHTML = schedules[i][j].endMinute;
        scheduleContent.innerHTML = schedules[i][j].content;
      }
    }
  }
};

// 予定詳細の処理
const goBackBtn = document.getElementById("go-back");
goBackBtn.addEventListener("click", function () {
  const scheduleDetails = document.getElementById("schedule-details");
  scheduleDetails.classList.add("display-none");
});

// 予定の更新ボタン
const updateBtn = document.getElementById("update-schedule");
updateBtn.addEventListener("click", function () {});
