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

const copy = function () {
  const copyTarget = document.getElementById("copyTarget");
  copyTarget.select();
  if (document.execCommand("copy")) alert("クリップボードにコピーしました.");
};

const displayData = function (data) {
  const place = document.getElementById("place");
  const description = document.getElementById("description");
  const email = document.getElementById("email");
  const url = document.getElementById("url");
  const copyButton = document.getElementById("copyButton");

  const h3_place = document.createElement("h3");
  const h3_description = document.createElement("h3");
  const h3_email = document.createElement("h3");
  const i_url = document.createElement("input");

  h3_place.innerHTML = data[0].space_name;
  h3_description.innerHTML = data[0].space_description;
  h3_email.innerHTML = data[0].admin_email;
  i_url.value = data[0].space_url;
  i_url.className = "form-control";

  place.appendChild(h3_place);
  description.appendChild(h3_description);
  email.appendChild(h3_email);
  const pUrl = url.insertBefore(i_url, copyButton);

  pUrl.id = "copyTarget";
};

getUserData();
