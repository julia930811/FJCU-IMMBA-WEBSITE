(function () {
  const KEY = "immba-admin-alumni-v2";
  let cache = null;
  let remoteError = "";

  function seed() {
    return [
      { id: "a1", fullName: "Alex Wang", studentId: "11010001", department: "International Business and Trade", degreeProgram: "Master's Program", admissionYear: 114, graduationYear: 116, email: "alex.wang@example.com", phone: "0912-345-678", company: "Formosa Global Co., Ltd.", jobTitle: "Project Manager", notes: "" },
      { id: "a2", fullName: "Emily Lee", studentId: "10920002", department: "Business Administration", degreeProgram: "Bachelor's Program", admissionYear: 110, graduationYear: 114, email: "emily.lee@example.com", phone: "", company: "", jobTitle: "", notes: "" },
      { id: "a3", fullName: "Daniel Chang", studentId: "10830003", department: "Accounting", degreeProgram: "Doctoral Program", admissionYear: 113, graduationYear: "", email: "daniel.chang@example.com", phone: "0922-111-222", company: "Insight Consulting Group", jobTitle: "Consultant", notes: "" },
      { id: "a4", fullName: "Michael Chen", studentId: "11110001", department: "International Business and Trade", degreeProgram: "Master's Program", admissionYear: 111, graduationYear: 113, email: "michael.chen@example.com", phone: "0912-111-222", company: "Acer Inc.", jobTitle: "Project Manager", notes: "" },
      { id: "a5", fullName: "Grace Lin", studentId: "11020002", department: "Business Administration", degreeProgram: "Bachelor's Program", admissionYear: 110, graduationYear: 114, email: "grace.lin@example.com", phone: "0928-333-444", company: "Cathay Life Insurance", jobTitle: "Marketing Specialist", notes: "" },
      { id: "a6", fullName: "David Huang", studentId: "10930003", department: "Accounting", degreeProgram: "Doctoral Program", admissionYear: 109, graduationYear: 115, email: "david.huang@example.com", phone: "0933-555-666", company: "Deloitte Taiwan", jobTitle: "Senior Auditor", notes: "" },
      { id: "a7", fullName: "Tiffany Chang", studentId: "11210004", department: "Finance", degreeProgram: "Master's Program", admissionYear: 112, graduationYear: 114, email: "tiffany.chang@example.com", phone: "0910-777-888", company: "Fubon Financial Holding", jobTitle: "Financial Analyst", notes: "" },
      { id: "a8", fullName: "Jason Lee", studentId: "11020005", department: "Information Management", degreeProgram: "Bachelor's Program", admissionYear: 110, graduationYear: 114, email: "jason.lee@example.com", phone: "0919-222-333", company: "TSMC", jobTitle: "Systems Engineer", notes: "" },
      { id: "a9", fullName: "Mandy Wang", studentId: "11120006", department: "Economics", degreeProgram: "Bachelor's Program", admissionYear: 111, graduationYear: 115, email: "mandy.wang@example.com", phone: "0955-444-555", company: "SinoPac Bank", jobTitle: "Banking Officer", notes: "" },
      { id: "a10", fullName: "Kevin Wu", studentId: "10810007", department: "Law", degreeProgram: "Master's Program", admissionYear: 108, graduationYear: 111, email: "kevin.wu@example.com", phone: "0972-666-777", company: "Lee and Li Attorneys-at-Law", jobTitle: "Attorney", notes: "" },
      { id: "a11", fullName: "Claire Liu", studentId: "11230008", department: "Statistics", degreeProgram: "Doctoral Program", admissionYear: 112, graduationYear: 117, email: "claire.liu@example.com", phone: "0988-888-999", company: "MediaTek", jobTitle: "Data Scientist", notes: "" },
      { id: "a12", fullName: "Tony Chao", studentId: "11020009", department: "Business Administration", degreeProgram: "Bachelor's Program", admissionYear: 110, graduationYear: 114, email: "tony.chao@example.com", phone: "0911-000-111", company: "Uni-President Enterprises", jobTitle: "Procurement Manager", notes: "" },
      { id: "a13", fullName: "Steven Hsu", studentId: "11110010", department: "International Business and Trade", degreeProgram: "Master's Program", admissionYear: 111, graduationYear: 113, email: "steven.hsu@example.com", phone: "0920-222-444", company: "ASUS", jobTitle: "International Sales Specialist", notes: "" },
      { id: "a14", fullName: "Sophia Tsai", studentId: "11310011", department: "Finance", degreeProgram: "Master's Program", admissionYear: 113, graduationYear: 115, email: "sophia.tsai@example.com", phone: "0935-123-456", company: "CTBC Bank", jobTitle: "Risk Analyst", notes: "" },
      { id: "a15", fullName: "Brian Kuo", studentId: "10920012", department: "Information Management", degreeProgram: "Bachelor's Program", admissionYear: 109, graduationYear: 113, email: "brian.kuo@example.com", phone: "0966-321-654", company: "Trend Micro", jobTitle: "Product Specialist", notes: "" },
      { id: "a16", fullName: "Natalie Cheng", studentId: "11020013", department: "Economics", degreeProgram: "Bachelor's Program", admissionYear: 110, graduationYear: 114, email: "natalie.cheng@example.com", phone: "0981-654-321", company: "E.SUN Bank", jobTitle: "Customer Experience Specialist", notes: "" },
      { id: "a17", fullName: "Eric Ho", studentId: "11130014", department: "Statistics", degreeProgram: "Master's Program", admissionYear: 111, graduationYear: 113, email: "eric.ho@example.com", phone: "0908-246-810", company: "Appier", jobTitle: "Data Analyst", notes: "" },
      { id: "a18", fullName: "Olivia Yang", studentId: "10820015", department: "Accounting", degreeProgram: "Bachelor's Program", admissionYear: 108, graduationYear: 112, email: "olivia.yang@example.com", phone: "0977-135-790", company: "PwC Taiwan", jobTitle: "Audit Associate", notes: "" },
      { id: "a19", fullName: "Ryan Su", studentId: "11210016", department: "International Business and Trade", degreeProgram: "Master's Program", admissionYear: 112, graduationYear: 114, email: "ryan.su@example.com", phone: "0918-864-200", company: "Delta Electronics", jobTitle: "Business Development Specialist", notes: "" },
      { id: "a20", fullName: "Ivy Chen", studentId: "11330017", department: "Business Administration", degreeProgram: "Doctoral Program", admissionYear: 113, graduationYear: "", email: "ivy.chen@example.com", phone: "0926-468-135", company: "Academic Research Institute", jobTitle: "Research Associate", notes: "" }
    ];
  }

  function yearNum(v) {
    if (v === "" || v == null) return "";
    const n = Number(v);
    return Number.isFinite(n) ? n : "";
  }

  function normalize(a, i) {
    return {
      id: a.id != null && a.id !== "" ? String(a.id) : ("a" + Date.now() + "-" + i),
      fullName: a.fullName || a.full_name || "",
      studentId: a.studentId || a.student_id || "",
      department: a.department || "",
      degreeProgram: a.degreeProgram || a.degree_program || "",
      admissionYear: yearNum(a.admissionYear != null ? a.admissionYear : a.admission_year),
      graduationYear: yearNum(a.graduationYear != null ? a.graduationYear : a.graduation_year),
      email: a.email || "",
      phone: a.phone || "",
      company: a.company || "",
      jobTitle: a.jobTitle || a.job_title || "",
      notes: a.notes || ""
    };
  }

  function fromRow(row) {
    return normalize(row);
  }

  function toRow(a) {
    const item = normalize(a, 0);
    const row = {
      full_name: item.fullName || null,
      student_id: item.studentId || null,
      department: item.department || null,
      degree_program: item.degreeProgram || null,
      admission_year: item.admissionYear === "" ? null : item.admissionYear,
      graduation_year: item.graduationYear === "" ? null : item.graduationYear,
      email: item.email || null,
      phone: item.phone || null,
      company: item.company || null,
      job_title: item.jobTitle || null,
      notes: item.notes || null
    };
    if (/^\d+$/.test(String(item.id))) row.id = Number(item.id);
    return row;
  }

  function sortList(list) {
    return [...list].sort((a, b) =>
      String(b.graduationYear).localeCompare(String(a.graduationYear)) ||
      String(a.fullName).localeCompare(String(b.fullName), "zh")
    );
  }

  function apply(list) {
    cache = sortList(list.map(normalize));
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch {}
    return cache;
  }

  function client() {
    return window.IMMBASupabase && window.IMMBASupabase.client;
  }

  async function refresh() {
    remoteError = "";
    const sb = client();
    if (!sb) {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) return apply(parsed);
        }
      } catch {}
      return apply(seed());
    }
    const { data, error } = await sb.from("alumni").select("*").order("graduation_year", { ascending: false });
    if (error) {
      remoteError = error.message;
      return apply(seed());
    }
    if (!data.length) {
      const rows = seed().map(toRow);
      const { error: ins } = await sb.from("alumni").insert(rows);
      if (ins) {
        remoteError = ins.message;
        return apply(seed());
      }
      const again = await sb.from("alumni").select("*").order("graduation_year", { ascending: false });
      return apply((again.data || []).map(fromRow));
    }
    return apply(data.map(fromRow));
  }

  const AlumniStore = {
    all() {
      return cache ? cache : apply(seed());
    },
    lastError() {
      return remoteError;
    },
    usingCloud() {
      return !!(client() && !remoteError);
    },
    departments() {
      return [...new Set(this.all().map((a) => a.department).filter(Boolean))].sort();
    },
    programs() {
      return [...new Set(this.all().map((a) => a.degreeProgram).filter(Boolean))].sort();
    },
    years() {
      return [...new Set(this.all().map((a) => String(a.graduationYear)).filter((y) => y && y !== "undefined"))].sort().reverse();
    },
    search(q, department, year, program) {
      const needle = (q || "").trim().toLowerCase();
      return this.all().filter((a) => {
        if (department && a.department !== department) return false;
        if (program && a.degreeProgram !== program) return false;
        if (year && String(a.graduationYear) !== String(year)) return false;
        if (!needle) return true;
        const blob = [a.fullName, a.studentId, a.department, a.degreeProgram, a.email, a.company, a.jobTitle, a.notes].join(" ").toLowerCase();
        return blob.includes(needle);
      });
    },
    async upsert(record) {
      const list = this.all();
      const item = normalize(record, list.length);
      const sb = client();
      if (sb) {
        const { data, error } = await sb.from("alumni").upsert(toRow(item)).select("*").single();
        if (error) {
          remoteError = error.message;
        } else if (data) {
          remoteError = "";
          const next = fromRow(data);
          const i = list.findIndex((a) => a.id === item.id || a.id === next.id);
          if (i >= 0) list[i] = next;
          else list.push(next);
          return apply(list);
        }
      }
      const i = list.findIndex((a) => a.id === item.id);
      if (i >= 0) list[i] = item;
      else list.push(item);
      return apply(list);
    },
    async remove(id) {
      const sb = client();
      if (sb && /^\d+$/.test(String(id))) {
        const { error } = await sb.from("alumni").delete().eq("id", Number(id));
        if (error) remoteError = error.message;
      }
      return apply(this.all().filter((a) => a.id !== String(id)));
    },
    async importRows(rows) {
      const list = this.all();
      for (const raw of rows) {
        const item = normalize(raw, list.length);
        if (!item.fullName && !item.studentId) continue;
        const match = list.findIndex((a) => item.studentId && a.studentId === item.studentId);
        if (match >= 0) item.id = list[match].id;
        await this.upsert(item);
      }
      return this.all();
    },
    async sync() {
      return refresh();
    },
    ready: (window.IMMBAAuth && window.IMMBAAuth.ready ? window.IMMBAAuth.ready : Promise.resolve()).then(refresh)
  };

  window.AlumniStore = AlumniStore;
})();
