function emptyAlumni() {
  return {
    id: "a" + Date.now(),
    fullName: "",
    studentId: "",
    department: "",
    degreeProgram: "",
    admissionYear: "",
    graduationYear: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    notes: ""
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
    id: document.getElementById("alId").value,
    fullName: document.getElementById("alFullName").value.trim(),
    studentId: document.getElementById("alStudentId").value.trim(),
    department: document.getElementById("alDepartment").value.trim(),
    degreeProgram: document.getElementById("alDegree").value.trim(),
    admissionYear: document.getElementById("alAdmit").value.trim(),
    graduationYear: document.getElementById("alGrad").value.trim(),
    email: document.getElementById("alEmail").value.trim(),
    phone: document.getElementById("alPhone").value.trim(),
    company: document.getElementById("alCompany").value.trim(),
    jobTitle: document.getElementById("alJob").value.trim(),
    notes: document.getElementById("alNotes").value.trim()
  };
}

function showStatus(msg) {
  const el = document.getElementById("adminStatus");
  if (!el) return;
  el.hidden = !msg;
  el.textContent = msg || "";
}

function fillSelect(el, values, current, blank) {
  const opts = [...values];
  if (current && !opts.includes(current)) opts.push(current);
  el.innerHTML = `<option value="">${blank}</option>` +
    opts.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join("");
  el.value = current || "";
}

function fillForm(a) {
  document.getElementById("alId").value = a.id;
  document.getElementById("alFullName").value = a.fullName || "";
  document.getElementById("alStudentId").value = a.studentId || "";
  fillSelect(document.getElementById("alDepartment"), window.AlumniStore.departments(), a.department || "", locale() === "zh" ? "請選擇系所" : "Select department");
  fillSelect(document.getElementById("alDegree"), window.AlumniStore.programs(), a.degreeProgram || "", locale() === "zh" ? "請選擇學位" : "Select degree");
  document.getElementById("alAdmit").value = a.admissionYear || "";
  document.getElementById("alGrad").value = a.graduationYear || "";
  document.getElementById("alEmail").value = a.email || "";
  document.getElementById("alPhone").value = a.phone || "";
  document.getElementById("alCompany").value = a.company || "";
  document.getElementById("alJob").value = a.jobTitle || "";
  document.getElementById("alNotes").value = a.notes || "";
  const zh = locale() === "zh";
  document.getElementById("formMode").textContent = a._isNew
    ? (zh ? "新增校友" : "Add alumni")
    : (zh ? "編輯校友" : "Edit alumni");
}

function currentFilter() {
  return {
    q: (document.getElementById("alSearch") || {}).value || "",
    department: (document.getElementById("alFilterDept") || {}).value || "",
    year: (document.getElementById("alFilterYear") || {}).value || "",
    program: (document.getElementById("alFilterProgram") || {}).value || ""
  };
}

function fillFilters() {
  const zh = locale() === "zh";
  const dept = document.getElementById("alFilterDept");
  const program = document.getElementById("alFilterProgram");
  const year = document.getElementById("alFilterYear");
  const keepD = dept.value;
  const keepP = program.value;
  const keepY = year.value;
  dept.innerHTML = `<option value="">${zh ? "全部系所" : "All departments"}</option>` +
    window.AlumniStore.departments().map((d) => `<option value="${esc(d)}">${esc(d)}</option>`).join("");
  program.innerHTML = `<option value="">${zh ? "全部學位" : "All degrees"}</option>` +
    window.AlumniStore.programs().map((d) => `<option value="${esc(d)}">${esc(d)}</option>`).join("");
  year.innerHTML = `<option value="">${zh ? "全部畢業年" : "All graduation years"}</option>` +
    window.AlumniStore.years().map((y) => `<option value="${esc(y)}">${esc(y)}</option>`).join("");
  dept.value = keepD;
  program.value = keepP;
  year.value = keepY;
}

function renderList() {
  const zh = locale() === "zh";
  const f = currentFilter();
  const list = window.AlumniStore.search(f.q, f.department, f.year, f.program);
  document.getElementById("alumniTableBody").innerHTML = list.map((a) => `
    <tr>
      <td>${esc(a.fullName)}</td>
      <td>${esc(a.studentId)}</td>
      <td>${esc(a.department)}</td>
      <td>${esc(a.degreeProgram)}</td>
      <td>${esc(a.admissionYear)}</td>
      <td>${esc(a.graduationYear)}</td>
      <td>${esc(a.email)}</td>
      <td>${esc(a.company)}</td>
      <td>${esc(a.jobTitle)}</td>
      <td class="admin-row-actions">
        <button type="button" class="btn btn-line" data-edit="${esc(a.id)}">${zh ? "編輯" : "Edit"}</button>
        <button type="button" class="btn btn-line" data-delete="${esc(a.id)}">${zh ? "刪除" : "Delete"}</button>
      </td>
    </tr>
  `).join("") || `<tr><td colspan="10">${zh ? "沒有符合的校友紀錄" : "No matching alumni records"}</td></tr>`;
  document.getElementById("alumniCount").textContent = zh
    ? `顯示 ${list.length} / ${window.AlumniStore.all().length} 筆`
    : `Showing ${list.length} of ${window.AlumniStore.all().length} records`;
}

async function renderActivity() {
  const zh = locale() === "zh";
  const box = document.getElementById("alumniActivity");
  if (!box || !window.IMMBAAuth || !window.IMMBAAuth.listAudit) return;
  const rows = (await window.IMMBAAuth.listAudit(80)).filter((r) => r.entity === "alumni");
  box.innerHTML = rows.slice(0, 12).map((r) => {
    const when = (r.created_at || "").replace("T", " ").slice(0, 19);
    const who = r.actor_email || (zh ? "管理員" : "admin");
    const act = r.action === "insert" ? (zh ? "新增" : "added") : r.action === "delete" ? (zh ? "刪除" : "deleted") : (zh ? "修改" : "edited");
    return `<li><time>${esc(when)}</time> ${esc(who)} ${act} ${esc(r.summary || "")}</li>`;
  }).join("") || `<li>${zh ? "尚無校友異動紀錄。請先執行 schema.sql。" : "No alumni activity yet. Run schema.sql first."}</li>`;
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return [];
  function split(line) {
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (q && line[i + 1] === '"') { cur += '"'; i++; }
        else q = !q;
      } else if (c === "," && !q) {
        out.push(cur.trim());
        cur = "";
      } else cur += c;
    }
    out.push(cur.trim());
    return out;
  }
  const headers = split(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const map = {
    full_name: "fullName", name: "fullName",
    student_id: "studentId",
    department: "department",
    degree_program: "degreeProgram", degree: "degreeProgram",
    admission_year: "admissionYear",
    graduation_year: "graduationYear",
    email: "email",
    phone: "phone",
    company: "company", current_company: "company",
    job_title: "jobTitle", title: "jobTitle", jobtitle: "jobTitle",
    notes: "notes"
  };
  return lines.slice(1).map((line) => {
    const cols = split(line);
    const rec = {};
    headers.forEach((h, i) => {
      const key = map[h];
      if (key) rec[key] = cols[i] || "";
    });
    return rec;
  });
}

function bindAdminAlumni() {
  const zh = locale() === "zh";
  document.getElementById("main").addEventListener("click", async (e) => {
    const edit = e.target.closest("[data-edit]");
    const del = e.target.closest("[data-delete]");
    if (edit) {
      const a = window.AlumniStore.all().find((x) => x.id === edit.getAttribute("data-edit"));
      if (a) {
        fillForm(a);
        document.getElementById("alumniForm").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    if (del) {
      const id = del.getAttribute("data-delete");
      const a = window.AlumniStore.all().find((x) => x.id === id);
      if (!window.confirm(zh ? `刪除校友：${a ? a.fullName : id}？` : `Delete alumni: ${a ? a.fullName : id}?`)) return;
      await window.AlumniStore.remove(id);
      fillFilters();
      renderList();
      await renderActivity();
      showStatus(zh ? "已刪除。" : "Deleted.");
    }
  });
  document.getElementById("btnNew").addEventListener("click", () => {
    const a = emptyAlumni();
    a._isNew = true;
    fillForm(a);
  });
  document.getElementById("alumniForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const a = formValues();
    if (!a.fullName) {
      showStatus(zh ? "請填寫校友姓名 full_name。" : "Please add full_name.");
      return;
    }
    await window.AlumniStore.upsert(a);
    fillFilters();
    renderList();
    fillForm(window.AlumniStore.all().find((x) => x.studentId && x.studentId === a.studentId && x.fullName === a.fullName) || a);
    await renderActivity();
    showStatus(zh ? "已儲存校友，並同步到前台。" : "Alumni saved and synchronized with the website.");
  });
  document.getElementById("btnDeleteOne").addEventListener("click", async () => {
    const id = document.getElementById("alId").value;
    if (!id) return;
    const a = window.AlumniStore.all().find((x) => x.id === id);
    if (!window.confirm(zh ? `刪除校友：${a ? a.fullName : id}？` : `Delete alumni: ${a ? a.fullName : id}?`)) return;
    await window.AlumniStore.remove(id);
    const n = emptyAlumni();
    n._isNew = true;
    fillForm(n);
    fillFilters();
    renderList();
    await renderActivity();
    showStatus(zh ? "已刪除。" : "Deleted.");
  });
  ["alSearch", "alFilterDept", "alFilterProgram", "alFilterYear"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderList);
    document.getElementById(id).addEventListener("change", renderList);
  });
  document.getElementById("alImport").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (!rows.length) {
      showStatus(zh ? "CSV 沒有可匯入的列。第一列請用欄位名稱。" : "No importable rows. Use a header row with field names.");
      return;
    }
    await window.AlumniStore.importRows(rows);
    fillFilters();
    renderList();
    await renderActivity();
    showStatus(zh ? `已批次匯入 ${rows.length} 列。` : `Imported ${rows.length} rows.`);
  });
}

function initAdminAlumni() {
  const a = emptyAlumni();
  a._isNew = true;
  fillForm(a);
  fillFilters();
  renderList();
  renderActivity();
  bindAdminAlumni();
  const err = window.AlumniStore.lastError();
  if (err && /alumni/.test(err)) {
    showStatus(locale() === "zh"
      ? "雲端還沒有 alumni 資料表。請在 Supabase SQL Editor 再執行一次 supabase/schema.sql，資料才會同步。"
      : "The alumni table is missing. Run supabase/schema.sql in the SQL Editor to sync records.");
  }
}
