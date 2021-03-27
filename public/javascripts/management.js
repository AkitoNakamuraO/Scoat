"use strict";

const getUserData = function () {
  const request = new XMLHttpRequest();
  const requestURL = "/management/getData";
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();
  request.onload = function () {
    const data = request.response;
    displayData(data);
  };
};

const displayData = function (data) {
  const place = document.getElementById("place");
  const email = document.getElementById("email");
  const url = document.getElementById("url");
  const p_place = document.createElement("p");
  const p_email = document.createElement("p");
  const p_url = document.createElement("p");
  p_place.innerHTML = data[0].space_name;
  p_email.innerHTML = data[0].admin_email;
  p_url.innerHTML = data[0].space_url;
  place.appendChild(p_place);
  email.appendChild(p_email);
  url.appendChild(p_url);
};

getUserData();
