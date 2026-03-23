const USER = "admin";
const PASS = "123";

let config = JSON.parse(localStorage.getItem("config")) || {};

function login() {
  let u = document.getElementById("user").value;
  let p = document.getElementById("pass").value;

  if (u === USER && p === PASS) {
    document.getElementById("panel").style.display = "block";
    load();
  } else {
    alert("Login gagal.");
  }
}

function load() {
  document.getElementById("banner").value = config.banner || "";
  document.getElementById("ssr").value = config.rateSSR || 1;
  document.getElementById("sr").value = config.rateSR || 9;
  document.getElementById("rateup").value = config.rateUp || "";
}

function save() {
  config.banner = document.getElementById("banner").value;
  config.rateSSR = parseFloat(document.getElementById("ssr").value);
  config.rateSR = parseFloat(document.getElementById("sr").value);
  config.rateUp = document.getElementById("rateup").value;

  localStorage.setItem("config", JSON.stringify(config));
  alert("Disimpan.");
}

window.login = login;
window.save = save;
