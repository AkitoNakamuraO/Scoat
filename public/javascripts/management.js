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

const copy = function(){
  const copyTarget = document.getElementById("copyTarget");
  copyTarget.select();
  if(document.execCommand('copy')) alert('クリップボードにコピーしました.');
};

const displayData = function (data) {
  const place = document.getElementById("place");
  const description = document.getElementById("description");
  const email = document.getElementById("email");
  const url = document.getElementById("url");
  const copyButton = document.getElementById("copyButton");

  const p_place = document.createElement("p");
  const p_description = document.createElement("p");
  const p_email = document.createElement("p");
  const p_url = document.createElement("input");

  p_place.innerHTML = data[0].space_name;
  p_description.innerHTML = data[0].space_description;
  p_email.innerHTML = data[0].admin_email;
  p_url.value = data[0].space_url;

  place.appendChild(p_place);
  description.appendChild(p_description);
  email.appendChild(p_email);
  const pUrl = url.insertBefore(p_url, copyButton);

  pUrl.id = "copyTarget";
};

getUserData();
