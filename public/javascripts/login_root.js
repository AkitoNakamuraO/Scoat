"use strict";

const displayPart = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/admins/displayPart";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    const data = request.response;
    //セッションに場所があったら、場所入力を表示
    if (data.check == true) showPart();
  };
};

//セッションに名前がなかったら、表示する
const showPart = function () {
  const locationId = document.getElementById("locationPart");
  const locationName = document.createElement("label");
  const locationInput = document.createElement("input");

  locationName.innerHTML = "場所の名前";
  locationName.setAttribute("for", "location");
  locationInput.type = "text";
  locationInput.name = "location";
  locationInput.className = "form-control";
  locationInput.placeholder = "input location";
  locationId.appendChild(locationName);
  locationId.appendChild(locationInput);
};

displayPart();
