"use strict";

const displayParts = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/admins/displayPart";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    const data = request.response;
    //セッションに場所があったら、場所入力を表示
    if(data != null) show();
  };
};

//セッションに名前がなかったら、表示する
const showPrats = function(){
  const locationId = document.getElementById("locationPart");
  const locationName = document.createElement("h2");
  const locationPart = document.createElement("input");
  locationPart.name = "location";
  locationPart.placeholder = "input location";
  locationName.textContent = "場所の名前";
  locationName.appendChild(locationId);
  locationPart.after(locationName);
}
