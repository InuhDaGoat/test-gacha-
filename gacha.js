let user = null;
let currency = 0;
let pity = 0;

const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (!username) {
  alert("Login dulu.");
  window.location.href = "login.html";
}

async function loadUser() {
  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    alert("User tidak ditemukan.");
    return;
  }

  user = data;
  currency = user.currency;
  pity = user.pity;

  updateUI();
}

function updateUI() {
  document.getElementById("currency").innerText = currency;
  document.getElementById("pity").innerText = pity;
}

function getRandomItem() {
  let chance = Math.random() * 100;

  if (pity >= 9) {
    pity = 0;
    return "⭐ RATE UP ITEM";
  }

  if (chance < 20) {
    pity = 0;
    return "⭐ RATE UP ITEM";
  }

  pity++;
  return "Item Biasa";
}

async function gacha() {
  if (currency <= 0) return alert("Habis.");

  currency--;
  let item = getRandomItem();

  document.getElementById("result").innerText = item;

  await save();
  updateUI();
}

async function multiGacha() {
  if (currency < 10) return alert("Butuh 10.");

  let hasil = [];

  for (let i = 0; i < 10; i++) {
    currency--;
    hasil.push(getRandomItem());
  }

  document.getElementById("result").innerText = hasil.join(", ");

  await save();
  updateUI();
}

async function save() {
  let { error } = await supabase
    .from("users")
    .update({
      currency: currency,
      pity: pity
    })
    .eq("id", user.id);

  console.log("SAVE:", error ? error : "OK");
}

loadUser();

window.gacha = gacha;
window.multiGacha = multiGacha;
