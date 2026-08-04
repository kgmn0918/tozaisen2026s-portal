// ============================================================
// Splathon東西戦(東西戦ポータル) — 共通設定・APIヘルパー
// ============================================================

// ★★★ ここを、GASデプロイ後に発行される Web App の URL に書き換えてください ★★★
// 例: https://script.google.com/macros/s/AKfycb.../exec
// const GAS_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
const GAS_URL = "https://script.google.com/macros/s/AKfycbyNBLvFQTlxoDgLJnY7jjLAqq2rHW2aZNDF6SO3DsGXa0YZNCsgtxRQ_EZDnTpvMQZ-pA/exec";

// GET リクエスト
async function apiGet(action, params = {}) {
  const url = new URL(GAS_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  return res.json();
}

// POST リクエスト(text/plainで送信し、プリフライトを回避)
async function apiPost(action, payload = {}) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  return res.json();
}

function showStatus(elId, message, ok = true) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = message;
  el.className = "status-msg " + (ok ? "ok" : "err");
}

// 管理者用の合言葉をセッション内に保持
function getAdminPass() {
  return sessionStorage.getItem("tozaisen_admin_pass") || "";
}
function setAdminPass(pass) {
  sessionStorage.setItem("tozaisen_admin_pass", pass);
}
