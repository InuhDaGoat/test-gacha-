let config = JSON.parse(localStorage.getItem("config")) || {
  banner: "Galactic Banner",
  rateSSR: 1,
  rateSR: 9,
  items: ["Nova","Orion","Nebula","Quasar","Vortex","Zenith","Astra","Cosmo","Luna","Sol"],
  rateUp: "Nova"
};

let currency = parseInt(localStorage.getItem("currency")) || 100;
let pity = parseInt(localStorage.getItem("pity")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];
let user = null;

async function start() {
  let name = document.getElementById("username").value;
  user = await loginUser(name);

  currency = user.currency;
  pity = user.pity;

  update("-");
}

function roll() {
  let r = Math.random() * 100;

  if (pity >= 50) {
    pity = 0;
    return getSSR();
  }

  if (r < config.rateSSR) return getSSR();
  if (r < config.rateSSR + config.rateSR) return "SR ⭐";
  return "R 🔹";
}

function getSSR() {
  if (Math.random() < 0.5) return "SSR 🌟 RATE UP: " + config.rateUp;

  let pool = config.items.filter(i => i !== config.rateUp);
  return "SSR 🌟 " + pool[Math.floor(Math.random() * pool.length)];
}

function gacha() {
  if (currency < 10) return alert("Miskin.");

  currency -= 10;
  pity++;

  let res = roll();
  if (res.includes("SSR")) pity = 0;

  addHistory(res);
  update(res);
}

function multiGacha() {
  if (currency < 100) return alert("Ga cukup.");

  currency -= 100;
  let results = [];

  for (let i = 0; i < 10; i++) {
    pity++;
    let r = roll();
    if (r.includes("SSR")) pity = 0;
    results.push(r);
    addHistory(r);
  }

  update(results.join(" | "));
}

function addHistory(r) {
  history.unshift(r);
  if (history.length > 50) history.pop();
  save();
}

function update(text) {
  document.getElementById("result").innerText = text;
  document.getElementById("currency").innerText = currency;
  document.getElementById("pity").innerText = pity;
  document.getElementById("banner").innerText = config.banner;

  document.getElementById("log").innerHTML =
    history.map((h,i)=>`${i+1}. ${h}`).join("<br>");
}

function addCurrency() {
  currency += 50;
  save();
  update("-");
}

function save() {
  localStorage.setItem("currency", currency);
  localStorage.setItem("pity", pity);
  localStorage.setItem("history", JSON.stringify(history));
}

update("-");

window.gacha = gacha;
window.multiGacha = multiGacha;
window.addCurrency = addCurrency;
