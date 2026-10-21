function emptyFaculty() {
  const n = (window.FacultyStore.all().length || 0) + 1;
  return {
    id: "f" + Date.now(),
    type: "full",
    order: n,
    imageUrl: "",
    zhName: "",
    enName: "",
    deptZh: "",
    deptEn: "",
    titleZh: "",
    titleEn: "",
    eduZh: "",
    eduEn: "",
    fieldsZh: "",
    fieldsEn: "",
    phone: "",
    email: "",
    site: ""
  };
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function typeLabel(type, zh) {
  if (type === "visit") return zh ? "客座教師" : "Visiting Faculty";
  if (type === "adjunct") return zh ? "兼任教師" : "Adjunct Faculty";
  return zh ? "專任教師" : "Full-time Faculty";
}

function formValues() {
  return {
    id: document.getElementById("facId").value,
    type: document.getElementById("facType").value,
    order: Number(document.getElementById("facOrder").value || 1),
    imageUrl: document.getElementById("facImage").value.trim(),
    zhName: document.getElementById("facZhName").value.trim(),
    enName: document.getElementById("facEnName").value.trim(),
    deptZh: document.getElementById("facDeptZh").value.trim(),
    deptEn: document.getElementById("facDeptEn").value.trim(),
    titleZh: document.getElementById("facTitleZh").value.trim(),
    titleEn: document.getElementById("facTitleEn").value.trim(),
    eduZh: document.getElementById("facEduZh").value.trim(),
    eduEn: document.getElementById("facEduEn").value.trim(),
    fieldsZh: document.getElementById("facFieldsZh").value.trim(),
    fieldsEn: document.getElementById("facFieldsEn").value.trim(),
    phone: document.getElementById("facPhone").value.trim(),
    email: document.getElementById("facEmail").value.trim(),
    site: document.getElementById("facSite").value.trim()
  };
}

function showStatus(msg) {
  const el = document.getElementById("adminStatus");
  if (!el) return;
  el.hidden = !msg;
  el.textContent = msg || "";
}

function photoPreview(url, name, record) {
  const initials = (name || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (record && typeof facultyPhotoMarkup === "function") {
    return facultyPhotoMarkup(record, name);
  }
  const src = url || "";
  if (!src) return `<div class="faculty-photo-fallback">${esc(initials)}</div>`;
  return `<img class="faculty-photo" src="${esc(src)}" alt="${esc(name)}" referrerpolicy="no-referrer" onerror="this.style.display='none'; this.nextElementSibling.removeAttribute('hidden')"><div class="faculty-photo-fallback" hidden>${esc(initials)}</div>`;
}

function fillForm(f) {
  document.getElementById("facId").value = f.id;
  document.getElementById("facType").value = f.type || "full";
  document.getElementById("facOrder").value = f.order || 1;
  document.getElementById("facImage").value = f.imageUrl || "";
  document.getElementById("facZhName").value = f.zhName || "";
  document.getElementById("facEnName").value = f.enName || "";
  document.getElementById("facDeptZh").value = f.deptZh || "";
  document.getElementById("facDeptEn").value = f.deptEn || "";
  document.getElementById("facTitleZh").value = f.titleZh || "";
  document.getElementById("facTitleEn").value = f.titleEn || "";
  document.getElementById("facEduZh").value = f.eduZh || "";
  document.getElementById("facEduEn").value = f.eduEn || "";
  document.getElementById("facFieldsZh").value = f.fieldsZh || "";
  document.getElementById("facFieldsEn").value = f.fieldsEn || "";
  document.getElementById("facPhone").value = f.phone || "";
  document.getElementById("facEmail").value = f.email || "";
  document.getElementById("facSite").value = f.site || "";
  document.getElementById("formMode").textContent = f._isNew
    ? (locale() === "zh" ? "新增師資（中英同一筆，含照片網址）" : "Create faculty (one record, two languages, photo URL)")
    : (locale() === "zh" ? "編輯師資（同一筆含照片網址）" : "Edit faculty (one record including photo URL)");
  document.getElementById("facultyForm").classList.toggle("is-editing", !f._isNew);
  refreshPhotoPreview();
}

function refreshPhotoPreview() {
  const url = document.getElementById("facImage").value.trim();
  const name = document.getElementById("facEnName").value.trim() || document.getElementById("facZhName").value.trim();
  document.getElementById("photoPreview").innerHTML = photoPreview(url, name, { imageUrl: url, enName: name });
}

function renderList() {
  const zh = locale() === "zh";
  const list = window.FacultyStore.all();
  const rows = list.map((f) => `
    <li class="admin-faculty-row" draggable="true" data-id="${esc(f.id)}">
      <span class="admin-drag" title="${zh ? "拖曳排序" : "Drag to reorder"}" aria-hidden="true">⋮⋮</span>
      <div class="admin-faculty-thumb">${photoPreview(f.imageUrl, f.enName || f.zhName, f)}</div>
      <div class="admin-faculty-meta">
        <p class="admin-faculty-type">${typeLabel(f.type, zh)}</p>
        <h3>${esc(zh ? f.zhName : f.enName)} <span>${esc(zh ? f.enName : f.zhName)}</span></h3>
        <p>${esc(zh ? f.titleZh : f.titleEn)}</p>
      </div>
      <div class="admin-row-actions">
        <button type="button" class="btn btn-line btn-edit" data-edit="${esc(f.id)}">${zh ? "編輯" : "Edit"}</button>
        <button type="button" class="btn btn-danger" data-delete="${esc(f.id)}">${zh ? "刪除" : "Delete"}</button>
      </div>
    </li>`).join("");
  document.getElementById("facultyBoard").innerHTML = rows || `<li class="admin-faculty-empty">${zh ? "目前沒有師資" : "No faculty records"}</li>`;
  document.getElementById("facultyCount").textContent = zh
    ? `目前 ${list.length} 位教師（與前台師資頁同步）`
    : `${list.length} faculty members (synchronized with the front-end page)`;
  bindDrag();
}

function startNew() {
  const f = emptyFaculty();
  f._isNew = true;
  fillForm(f);
  document.getElementById("facZhName").focus();
  showStatus("");
}

function editById(id) {
  const f = window.FacultyStore.all().find((x) => x.id === id);
  if (!f) {
    showStatus(locale() === "zh" ? "找不到這位教師。" : "That faculty record was not found.");
    return;
  }
  fillForm(f);
  document.getElementById("facZhName").focus();
  showStatus(locale() === "zh" ? "正在編輯此筆師資，改完請按儲存。" : "Editing this faculty record. Save when finished.");
  document.getElementById("facultyForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteById(id) {
  const zh = locale() === "zh";
  if (!id) return;
  const item = window.FacultyStore.all().find((x) => x.id === id);
  const label = item ? `${item.zhName} / ${item.enName}` : id;
  if (!window.confirm(zh ? `刪除一次即可，中文與英文會一起移除：\n${label}` : `Delete once. Both languages will be removed:\n${label}`)) return;
  await window.FacultyStore.remove(id);
  renderList();
  startNew();
  showStatus(cloudNote(zh ? "已刪除，並已同步到前台師資頁。" : "Deleted and synchronized with the faculty page."));
}

function cloudNote(msg) {
  const zh = locale() === "zh";
  const err = window.FacultyStore.lastError && window.FacultyStore.lastError();
  if (err) return (zh ? "Supabase 尚未就緒：" : "Supabase is not ready: ") + err;
  if (window.FacultyStore.usingCloud && window.FacultyStore.usingCloud()) {
    return msg + (zh ? "（已寫入 Supabase faculty 資料表）" : " (saved to the Supabase faculty table)");
  }
  return msg + (zh ? "（目前僅存在本機，請先在 Supabase 執行 supabase/schema.sql）" : " (local only; run supabase/schema.sql first)");
}

function bindDrag() {
  const board = document.getElementById("facultyBoard");
  let dragId = null;
  board.querySelectorAll(".admin-faculty-row").forEach((row) => {
    row.addEventListener("dragstart", () => {
      dragId = row.dataset.id;
      row.classList.add("is-dragging");
    });
    row.addEventListener("dragend", async () => {
      row.classList.remove("is-dragging");
      const ids = [...board.querySelectorAll(".admin-faculty-row")].map((el) => el.dataset.id);
      await window.FacultyStore.reorder(ids);
      dragId = null;
      renderList();
      showStatus(cloudNote(locale() === "zh" ? "已更新排序，並同步到前台。" : "Order updated and synchronized with the website."));
    });
    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      const over = e.currentTarget;
      if (!dragId || over.dataset.id === dragId) return;
      const dragging = board.querySelector(`[data-id="${dragId}"]`);
      const rows = [...board.querySelectorAll(".admin-faculty-row")];
      const from = rows.indexOf(dragging);
      const to = rows.indexOf(over);
      if (from < to) over.after(dragging);
      else over.before(dragging);
    });
    row.addEventListener("drop", async (e) => {
      e.preventDefault();
      const ids = [...board.querySelectorAll(".admin-faculty-row")].map((el) => el.dataset.id);
      await window.FacultyStore.reorder(ids);
      renderList();
      showStatus(cloudNote(locale() === "zh" ? "已更新排序，並同步到前台。" : "Order updated and synchronized with the website."));
    });
  });
}

function bindAdminFaculty() {
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
  document.getElementById("btnRestore").addEventListener("click", async () => {
    if (!window.confirm(zh ? "還原為預設師資清單？目前後台修改會被清掉。" : "Restore the default faculty list? Current back-office edits will be cleared.")) return;
    await window.FacultyStore.restore();
    renderList();
    startNew();
    showStatus(cloudNote(zh ? "已還原預設清單，並已同步到前台。" : "Default list restored and synchronized with the website."));
  });
  document.getElementById("btnSync").addEventListener("click", async () => {
    await window.FacultyStore.sync();
    renderList();
    showStatus(cloudNote(zh ? "已將後台變更同步到前台師資頁。" : "Back-office changes are synchronized with the faculty page."));
  });
  document.getElementById("facultyForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = formValues();
    if (!f.zhName || !f.enName) {
      showStatus(zh ? "請同時填寫中文姓名與英文姓名。" : "Please add both Chinese and English names.");
      return;
    }
    await window.FacultyStore.upsert(f);
    renderList();
    const saved = window.FacultyStore.all().find((x) => x.enName === f.enName && x.zhName === f.zhName) || f;
    fillForm(saved);
    showStatus(cloudNote(zh ? "已儲存為一筆雙語師資（含照片網址），並同步到前台。" : "Saved as one bilingual faculty record with photo URL and synchronized with the website."));
  });
  document.getElementById("btnDeleteOne").addEventListener("click", () => {
    deleteById(document.getElementById("facId").value);
  });
  ["facImage", "facEnName", "facZhName"].forEach((id) => {
    document.getElementById(id).addEventListener("input", refreshPhotoPreview);
  });
  async function applyPastedPhoto(file) {
    if (!file || !window.IMMBAImage) return;
    const canCloud = window.IMMBAAuth && window.IMMBAAuth.canEdit();
    const url = canCloud
      ? await window.IMMBAImage.upload(file, "faculty-photos")
      : await window.IMMBAImage.fromFile(file);
    document.getElementById("facImage").value = url;
    refreshPhotoPreview();
    const cloud = canCloud && url.indexOf("data:") !== 0;
    showStatus(locale() === "zh"
      ? (cloud ? "已上傳到 Supabase Storage，儲存後會同步到前台師資頁。" : "已貼上影像，儲存後會同步到前台。")
      : (cloud ? "Uploaded to Supabase Storage. Save to sync it to the faculty page." : "Pasted image added. Save to sync it to the website."));
  }
  function onPasteImage(e) {
    const file = window.IMMBAImage && window.IMMBAImage.fileFromClipboard(e);
    if (!file) return;
    e.preventDefault();
    applyPastedPhoto(file);
  }
  document.getElementById("facImage").addEventListener("paste", onPasteImage);
  const preview = document.getElementById("photoPreview");
  if (preview) {
    preview.tabIndex = 0;
    preview.addEventListener("paste", onPasteImage);
    preview.addEventListener("dragover", (e) => e.preventDefault());
    preview.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = [...(e.dataTransfer.files || [])].find((f) => String(f.type || "").startsWith("image/"));
      applyPastedPhoto(file);
    });
  }
}

function initAdminFaculty() {
  const f = emptyFaculty();
  f._isNew = true;
  fillForm(f);
  renderList();
  bindAdminFaculty();
  showStatus(cloudNote(locale() === "zh" ? "師資後台已載入。" : "AdminFaculty is ready."));
}
