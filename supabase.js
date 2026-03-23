const SUPABASE_URL = https://galsberhhslhbnesagcc.supabase.co;
const SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhbHNiZXJoaHNsaGJuZXNhZ2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNDg5MTMsImV4cCI6MjA4OTgyNDkxM30.IZzm9ukiyolJm0uUlZfGIqkRpbQvetGhCNI-bP7dtJk;

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===== LOGIN SIMPLE =====
async function login(username) {
  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    // kalau belum ada user → bikin baru
    let res = await supabase.from("users").insert([
      { username: username, currency: 100, pity: 0 }
    ]).select().single();

    return res.data;
  }

  return data;
}

// ===== SAVE =====
async function saveUser(id, currency, pity) {
  await supabase
    .from("users")
    .update({ currency, pity })
    .eq("id", id);
}

window.loginUser = login;
window.saveUser = saveUser;
