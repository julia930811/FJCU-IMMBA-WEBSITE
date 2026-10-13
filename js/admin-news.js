function emptyRecord() {
  return {
    id: "n" + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    href: "",
    status: "published",
    pinned: false,
    order: 1,
    zhTitle: "",
    enTitle: "",
    zhBody: "",
    enBody: "",
    zhTitleAuto: false,
    enTitleAuto: false,
    zhBodyAuto: false,
    enBodyAuto: false
  };
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formValues() {
  return {
    id: document.getElementById("newsId").value,
    date: document.getElementById("newsDate").value,
    href: document.getElementById("newsHref").value.trim(),
    status: document.getElementById("newsStatus").value,
    pinned: document.getElementById("newsPinned").checked,
    order: Number(document.getElementById("newsOrder").value || 1),
    zhTitle: document.getElementById("newsZhTitle").value,
    enTitle: document.getElementById("newsEnTitle").value,
    zhBody: document.getElementById("newsZhBody").value,
    enBody: document.getElementById("newsEnBody").value,
    zhTitleAuto: document.getElementById("newsZhTitle").dataset.auto === "1",
    enTitleAuto: document.getElementById("newsEnTitle").dataset.auto === "1",
    zhBodyAuto: document.getElementById("newsZhBody").dataset.auto === "1",
    enBodyAuto: document.getElementById("newsEnBody").dataset.auto === "1"
  };
}

function showStatus(msg) {
  const el = document.getElementById("adminStatus");
  if (!el) return;
  el.hidden = !msg;
  el.textContent = msg || "";
}

function fillForm(n) {
  document.getElementById("newsId").value = n.id;
  document.getElementById("newsDate").value = n.date;
  document.getElementById("newsHref").value = n.href || "";
  document.getElementById("newsStatus").value = n.status || "published";
  document.getElementById("newsPinned").checked = !!n.pinned;
  document.getElementById("newsOrder").value = n.order || 1;
  const map = [
    ["newsZhTitle", n.zhTitle, n.zhTitleAuto],
    ["newsEnTitle", n.enTitle, n.enTitleAuto],
    ["newsZhBody", n.zhBody, n.zhBodyAuto],
    ["newsEnBody", n.enBody, n.enBodyAuto]
  ];
  map.forEach(([id, val, auto]) => {
    const el = document.getElementById(id);
    el.value = val || "";
    el.dataset.auto = auto ? "1" : "0";
  });
  document.getElementById("formMode").textContent = n._isNew
    ? (locale() === "zh" ? "新增公告（中英同一筆）" : "Create announcement (one record, two languages)")
    : (locale() === "zh" ? "編輯公告（同一頁改中或英，存成一筆）" : "Edit either language on this page; save as one record");
  refreshSyncBox();
  refreshPreview();
  document.getElementById("newsForm").classList.toggle("is-editing", !n._isNew);
}

function refreshSyncBox() {
  const n = formValues();
  const s = window.NewsStore.syncState(n);
  const zh = locale() === "zh";
  const bits = [];
  bits.push(s.titlesOk
    ? (zh ? "中英標題皆已填寫" : "Chinese and English titles are both filled")
    : (zh ? "尚缺中文或英文標題" : "Chinese or English title is missing"));
  bits.push(s.bodiesOk
    ? (zh ? "中英內文已對齊（皆空或皆有）" : "Chinese and English content are aligned")
    : (zh ? "僅有單語內文，尚未同步" : "Only one language has content"));
  bits.push(s.distinct
    ? (zh ? "兩語標題已分開撰寫" : "The two titles are distinct")
    : (zh ? "兩語標題相同，建議再編輯自動翻譯" : "Titles match; edit the automatic translation if needed"));
  bits.push(s.auto
    ? (zh ? "含預設自動翻譯，可再人工修改" : "Includes default automatic translation, which can still be edited")
    : (zh ? "目前為人工編輯內容" : "Content is currently editor-reviewed"));
  document.getElementById("syncBox").innerHTML = `
    <strong>${s.ok ? (zh ? "雙語已同步，可發布" : "Both versions are synchronized") : (zh ? "雙語尚未完全同步" : "The two versions are not fully synchronized")}</strong>
    <ul>${bits.map((b) => `<li>${b}</li>`).join("")}</ul>
  `;
  document.getElementById("syncBox").className = "admin-sync " + (s.ok ? "is-ok" : "is-warn");
}

function refreshPreview() {
  const n = formValues();
  document.getElementById("previewZh").innerHTML = `
    <p class="admin-kicker">中文預覽</p>
    <time>${esc(n.date)}</time>
    <h3>${esc(n.zhTitle) || "（尚未填寫中文標題）"}</h3>
    <p>${esc(n.zhBody) || "（尚未填寫中文內文）"}</p>
  `;
  document.getElementById("previewEn").innerHTML = `
    <p class="admin-kicker">English preview</p>
    <time>${esc(n.date)}</time>
    <h3>${esc(n.enTitle) || "(English title not yet filled)"}</h3>
    <p>${esc(n.enBody) || "(English content not yet filled)"}</p>
  `;
}

function renderList() {
  const zh = locale() === "zh";
  const list = window.NewsStore.all();
  const rows = list.map((n) => {
    const s = window.NewsStore.syncState(n);
    return `<tr>
      <td>${esc(n.order)}</td>
      <td>${esc(n.date)}</td>
      <td>${n.pinned ? "TOP" : ""}</td>
      <td>${n.status === "published" ? (zh ? "已發布" : "Published") : (zh ? "草稿" : "Draft")}</td>
      <td>${esc(n.zhTitle)}</td>
      <td>${esc(n.enTitle)}</td>
      <td><span class="admin-badge ${s.ok ? "ok" : "warn"}">${s.ok ? (zh ? "已同步" : "Synced") : (zh ? "未齊" : "Gap")}</span></td>
      <td class="admin-row-actions">
        <button type="button" class="btn btn-line" data-edit="${esc(n.id)}">${zh ? "編輯" : "Edit"}</button>
        <button type="button" class="btn btn-line" data-delete="${esc(n.id)}">${zh ? "刪除" : "Delete"}</button>
      </td>
    </tr>`;
  }).join("");
  document.getElementById("newsTableBody").innerHTML = rows || `<tr><td colspan="8">${zh ? "目前沒有公告" : "No announcements"}</td></tr>`;
  document.getElementById("newsCount").textContent = zh
    ? `目前 ${list.length} 則（前台顯示 ${window.NewsStore.published().length} 則已發布）`
    : `${list.length} records (${window.NewsStore.published().length} published on the website)`;
}

async function autoFill(sourceId, targetId, to) {
  const source = document.getElementById(sourceId);
  const target = document.getElementById(targetId);
  const text = source.value.trim();
  if (!text) return;
  if (target.value.trim() && target.dataset.auto !== "1") return;
  target.dataset.pending = "1";
  const out = await window.IMMBATranslate.translate(text, to);
  if (target.dataset.pending !== "1") return;
  if (out) {
    target.value = out;
    target.dataset.auto = "1";
  }
  target.dataset.pending = "0";
  refreshSyncBox();
  refreshPreview();
}

function startNew() {
  const n = emptyRecord();
  n._isNew = true;
  fillForm(n);
  document.getElementById("newsZhTitle").focus();
  showStatus("");
}

function editById(id) {
  const n = window.NewsStore.all().find((x) => x.id === id);
  if (!n) {
    showStatus(locale() === "zh" ? "找不到這則公告。" : "That announcement was not found.");
    return;
  }
  fillForm(n);
  document.getElementById("newsZhTitle").focus();
  showStatus(locale() === "zh" ? "正在編輯此則公告，改完請按儲存。" : "Editing this announcement. Save when finished.");
}

function deleteById(id) {
  const zh = locale() === "zh";
  if (!id) return;
  const item = window.NewsStore.all().find((x) => x.id === id);
  const label = item ? (item.zhTitle || item.enTitle) : id;
  if (!window.confirm(zh ? `刪除一次即可，中文與英文會一起移除：\n${label}` : `Delete once. Both languages will be removed:\n${label}`)) return;
  window.NewsStore.remove(id);
  renderList();
  startNew();
  showStatus(zh ? "已刪除，並已同步到前台。" : "Deleted and synchronized with the website.");
}

function bindAdmin() {
  const zh = locale() === "zh";
  const main = document.getElementById("main");
  main.addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    const del = e.target.closest("[data-delete]");
    if (edit) {
      e.preventDefault();
      editById(edit.getAttribute("data-edit"));
    }
    if (del) {
      e.preventDefault();
      deleteById(del.getAttribute("data-delete"));
    }
  });
  document.getElementById("btnNew").addEventListener("click", startNew);
  document.getElementById("btnRestore").addEventListener("click", () => {
    if (!window.confirm(zh ? "還原為預設公告清單？目前後台修改會被清掉。" : "Restore the default announcement list? Current back-office edits will be cleared.")) return;
    window.NewsStore.restore();
    renderList();
    startNew();
    showStatus(zh ? "已還原預設清單，並已同步到前台。" : "Default list restored and synchronized with the website.");
  });
  document.getElementById("btnSync").addEventListener("click", () => {
    window.NewsStore.sync();
    renderList();
    showStatus(zh ? "已將後台變更同步到前台網站。" : "Back-office changes are synchronized with the website.");
  });
  document.getElementById("newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = formValues();
    if (!n.zhTitle.trim() || !n.enTitle.trim()) {
      showStatus(zh ? "請同時填寫中文標題與英文標題。" : "Please add both Chinese and English titles.");
      return;
    }
    window.NewsStore.upsert(n);
    renderList();
    fillForm(n);
    showStatus(zh ? "已儲存為一筆雙語公告，並同步到前台。" : "Saved as one bilingual announcement and synchronized with the website.");
  });
  document.getElementById("btnDeleteOne").addEventListener("click", () => {
    deleteById(document.getElementById("newsId").value);
  });
  ["newsZhTitle", "newsEnTitle", "newsZhBody", "newsEnBody", "newsDate", "newsHref", "newsStatus", "newsOrder"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      const el = document.getElementById(id);
      if (el.dataset.auto !== undefined) el.dataset.auto = "0";
      refreshSyncBox();
      refreshPreview();
    });
  });
  document.getElementById("newsPinned").addEventListener("change", () => {
    refreshSyncBox();
    refreshPreview();
  });
  document.getElementById("newsZhTitle").addEventListener("blur", () => autoFill("newsZhTitle", "newsEnTitle", "en"));
  document.getElementById("newsEnTitle").addEventListener("blur", () => autoFill("newsEnTitle", "newsZhTitle", "zh"));
  document.getElementById("newsZhBody").addEventListener("blur", () => autoFill("newsZhBody", "newsEnBody", "en"));
  document.getElementById("newsEnBody").addEventListener("blur", () => autoFill("newsEnBody", "newsZhBody", "zh"));
  document.getElementById("btnAutoEnTitle").addEventListener("click", () => autoFill("newsZhTitle", "newsEnTitle", "en"));
  document.getElementById("btnAutoZhTitle").addEventListener("click", () => autoFill("newsEnTitle", "newsZhTitle", "zh"));
  document.getElementById("btnAutoEnBody").addEventListener("click", () => autoFill("newsZhBody", "newsEnBody", "en"));
  document.getElementById("btnAutoZhBody").addEventListener("click", () => autoFill("newsEnBody", "newsZhBody", "zh"));
}

function initAdminNews() {
  const n = emptyRecord();
  n._isNew = true;
  fillForm(n);
  renderList();
  bindAdmin();
}
