// ============================================================
// Splathon東西戦(東西戦ポータル) — 共通設定・APIヘルパー
// ============================================================

// ★★★ ここを、GASデプロイ後に発行される Web App の URL に書き換えてください ★★★
// 例: https://script.google.com/macros/s/AKfycb.../exec
// const GAS_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
const GAS_URL = "https://script.google.com/macros/s/AKfycbyNBLvFQTlxoDgLJnY7jjLAqq2rHW2aZNDF6SO3DsGXa0YZNCsgtxRQ_EZDnTpvMQZ-pA/exec";

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// GET リクエスト(一時的な失敗に備えて最大3回リトライ)
async function apiGet(action, params = {}) {
  const url = new URL(GAS_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url.toString());
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (attempt < 2) await sleep(600 * (attempt + 1));
    }
  }
  throw lastErr;
}

// POST リクエスト(text/plainで送信し、プリフライトを回避。一時的な失敗に備えて最大2回リトライ)
async function apiPost(action, payload = {}) {
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, ...payload }),
      });
      return await res.json();
    } catch (err) {
      lastErr = err;
      if (attempt < 1) await sleep(600);
    }
  }
  throw lastErr;
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
