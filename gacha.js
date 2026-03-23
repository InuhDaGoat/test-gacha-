let user = null;
let currency = 0;
let pity = 0;

async function loadUser() {
  const { data: currentUser } = await supabase.auth.getUser();
  if (!currentUser) { window.location.href = "login.html"; return; }
  const uid = currentUser.user.id;

  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("owner_id", uid)
    .maybeSingle();

  if (!data) {
    let res = await supabase.from("users").insert([
      { owner_id: uid, currency: 100, pity: 0 }
    ]).select().single();
    data = res.data;
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
  if (pity >= 9 || chance < 20) { pity = 0; return "⭐ RATE UP ITEM"; }
  pity++;
  return "Item Biasa";
}

async function gacha() {
  if (currency <= 0) return alert("Habis.");
  currency--;
  document.getElementById("result").innerText = getRandomItem();
  await save();
  updateUI();
}

async function multiGacha() {
  if (currency < 10) return alert("Butuh 10.");
  let hasil = [];
  for (let i=0; i<10; i++){ currency--; hasil.push(getRandomItem()); }
  document.getElementById("result").innerText = hasil.join(", ");
  await save();
  updateUI();
}

async function save() {
  const { error } = await supabase
    .from("users")
    .update({ currency, pity })
    .eq("owner_id", user.owner_id);
  console.log("SAVE:", error ? error : "OK");
}

loadUser();
window.gacha = gacha;
window.multiGacha = multiGacha;
