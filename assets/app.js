// ============================================================
// Splathon東西戦 2026夏 — 共通設定・APIヘルパー
// ============================================================

// ★★★ ここを、GASデプロイ後に発行される Web App の URL に書き換えてください ★★★
// 例: https://script.google.com/macros/s/AKfycb.../exec
// const GAS_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

const GAS_URL = "https://script.google.com/macros/s/AKfycbxKErjhCNvLgs0RAH0sIWBooyjCz6B-rpOL3YfbOTAnPWYe36u4psbs4JVaX0OMrzYq/exec";

// GET リクエスト（パラメータ付き）
async function apiGet(action, params = {}) {
  const url = new URL(GAS_URL);
  url.searchParams.set("action", action);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  return res.json();
}

// POST リクエスト（JSON本文）
// Apps Script側のプリフライト回避のため text/plain で送信し、
// サーバー側で e.postData.contents を JSON.parse する構成に合わせています。
async function apiPost(action, payload = {}) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  return res.json();
}

// ヘッダーのミニ戦況ゲージを更新（standings取得できるページで呼び出し）
async function renderMiniGauge(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  try {
    const data = await apiGet("standings");
    const e = data.armyTotals?.東 || 0;
    const w = data.armyTotals?.西 || 0;
    const total = e + w;
    const ePct = total === 0 ? 50 : (e / total) * 100;
    el.innerHTML = `<div class="e" style="width:${ePct}%"></div><div class="w" style="width:${100 - ePct}%"></div>`;
  } catch (err) {
    // 取得失敗時は静かに無視（設定前のプレースホルダーURLなど）
  }
}

function showStatus(elId, message, ok = true) {
  const el = document.getElementById(elId);
  el.textContent = message;
  el.className = "status-msg " + (ok ? "ok" : "err");
}
