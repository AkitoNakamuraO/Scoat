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

  const schedulesColumn = document.getElementById("schedules-column");
  for (let i = 0; i < WEEK; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    const date = document.createElement("div");
    date.classList.add("date");
    date.classList.add("table-header");
    const times = document.createElement("div");
    times.classList.add("times");
    for (let j = 0; j < schedules[i].length; j++) {
      date.innerHTML = schedules[i][j].date;
      const time = document.createElement("div");
      time.classList.add("time");
      for (let k = 0; k < HOURS; k++) {
        const hour = document.createElement("div");
        hour.classList.add("hour");
        if (k == schedules[i][j].startHour) {
          hourFlag = true;
        } else if (k == schedules[i][j].endHour) {
          hourFlag = false;
        }
        for (let l = 0; l < MINUTES; l++) {
          const minute = document.createElement("div");
          minute.classList.add("minute");
          if (hourFlag == true && l == schedules[i][j].startMinute) {
            minuteFlag = true;
          } else if (hourFlag == false && l == schedules[i][j].endMinute) {
            minuteFlag = false;
          }
          if (minuteFlag == true) {
            minute.classList.add("scheduled");
            const scheduleId = schedules[i][j].id; // schedule_idをつける
            minute.setAttribute("onclick", `displayDetails(${scheduleId})`);
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
    schedulesColumn.appendChild(day);
  }
};

// 予定取得関数を実行
getSchedule();

// タップされた予定の詳細表示
const displayDetails = function (scheduleId) {
  const scheduleDetails = document.getElementById("schedule-details");
  scheduleDetails.classList.remove("display-none");
};

// 予定詳細の処理
const goBackBtn = document.getElementById("go-back");
goBackBtn.addEventListener("click", function () {
  const scheduleDetails = document.getElementById("schedule-details");
  scheduleDetails.classList.add("display-none");
});

// 予定の更新ボタン
