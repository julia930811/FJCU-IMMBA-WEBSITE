(function () {
  const KEY = "immba-admin-faculty-v1";
  const TYPES = ["full", "visit", "adjunct"];
  let cache = null;
  let remoteError = "";

  function seed() {
    return JSON.parse(JSON.stringify(window.IMMBA.seedFaculty || window.IMMBA.faculty || []));
  }

  function normalize(f, i) {
    const type = TYPES.includes(f.type) ? f.type : "full";
    return {
      id: f.id != null && f.id !== "" ? String(f.id) : ("f" + Date.now() + "-" + i),
      type,
      order: f.order != null && f.order !== "" ? Number(f.order) : i + 1,
      imageUrl: f.imageUrl || f.image_url || "",
      zhName: f.zhName || f.zh_name || "",
      enName: f.enName || f.en_name || f.name || "",
      deptZh: f.deptZh || f.dept_zh || "",
      deptEn: f.deptEn || f.dept_en || "",
      titleZh: f.titleZh || f.title_zh || "",
      titleEn: f.titleEn || f.title_en || f.title || "",
      eduZh: f.eduZh || f.edu_zh || "",
      eduEn: f.eduEn || f.edu_en || "",
      fieldsZh: f.fieldsZh || f.fields_zh || "",
      fieldsEn: f.fieldsEn || f.fields_en || "",
      phone: f.phone || "",
      email: f.email || "",
      site: f.site || ""
    };
  }

  function fromRow(row) {
    return normalize({
      id: row.id,
      type: row.type,
      order: row.sort_order,
      imageUrl: row.image_url,
      zhName: row.zh_name,
      enName: row.en_name || row.name,
      deptZh: row.dept_zh,
      deptEn: row.dept_en,
      titleZh: row.title_zh,
      titleEn: row.title_en || row.title,
      eduZh: row.edu_zh,
      eduEn: row.edu_en,
      fieldsZh: row.fields_zh,
      fieldsEn: row.fields_en,
      phone: row.phone,
      email: row.email,
      site: row.site
    });
  }

  function toRow(f, i) {
    const item = normalize(f, i);
    const row = {
      name: item.enName || item.zhName,
      title: item.titleEn || item.titleZh,
      email: item.email || null,
      image_url: item.imageUrl || null,
      zh_name: item.zhName || null,
      en_name: item.enName || null,
      title_zh: item.titleZh || null,
      title_en: item.titleEn || null,
      dept_zh: item.deptZh || null,
      dept_en: item.deptEn || null,
      edu_zh: item.eduZh || null,
      edu_en: item.eduEn || null,
      fields_zh: item.fieldsZh || null,
      fields_en: item.fieldsEn || null,
      phone: item.phone || null,
      site: item.site || null,
      type: item.type,
      sort_order: item.order
    };
    if (/^\d+$/.test(String(item.id))) row.id = Number(item.id);
    return row;
  }

  function sortList(list) {
    const rank = { full: 0, visit: 1, adjunct: 2 };
    return [...list].sort((a, b) =>
      (Number(a.order) - Number(b.order)) ||
      ((rank[a.type] ?? 9) - (rank[b.type] ?? 9)) ||
      String(a.enName).localeCompare(String(b.enName))
    );
  }

  function apply(list) {
    cache = sortList(list.map(normalize));
    window.IMMBA.faculty = cache;
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch {}
    return cache;
  }

  function withMissingSeed(list) {
    const names = new Set(list.map((f) => f.zhName));
    seed().forEach((s, i) => {
      if (s.zhName && !names.has(s.zhName)) list.push(normalize(s, list.length));
    });
    return list;
  }

  function client() {
    return window.IMMBASupabase && window.IMMBASupabase.client;
  }

  async function pushSeed(sb) {
    const rows = seed().map((f, i) => toRow(f, i));
    const { error } = await sb.from("faculty").insert(rows);
    if (error) remoteError = error.message;
  }

  async function refresh() {
    remoteError = "";
    const sb = client();
    if (!sb) {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) return apply(withMissingSeed(parsed));
        }
      } catch {}
      return apply(seed());
    }
    const { data, error } = await sb.from("faculty").select("*").order("sort_order");
    if (error) {
      remoteError = error.message;
      return apply(seed());
    }
    if (!data.length) {
      await pushSeed(sb);
      const again = await sb.from("faculty").select("*").order("sort_order");
      if (again.error) {
        remoteError = again.error.message;
        return apply(seed());
      }
      return apply(withMissingSeed((again.data || []).map(fromRow)));
    }
    const list = withMissingSeed(data.map(fromRow));
    const existing = new Set((data || []).map((row) => row.zh_name || row.zhName));
    for (const item of list) {
      if (item.zhName && !existing.has(item.zhName)) {
        const { error: insertError } = await sb.from("faculty").insert(toRow(item, list.length));
        if (insertError) remoteError = insertError.message;
      }
    }
    return apply(list);
  }

  const FacultyStore = {
    all() {
      return cache ? cache : apply(seed());
    },
    lastError() {
      return remoteError;
    },
    usingCloud() {
      return !!(client() && !remoteError);
    },
    async save(list) {
      return apply(list);
    },
    async upsert(record) {
      const list = this.all();
      const item = normalize(record, list.length);
      const sb = client();
      if (sb) {
        const row = toRow(item, list.length);
        const { data, error } = await sb.from("faculty").upsert(row).select("*").single();
        if (error) {
          remoteError = error.message;
        } else if (data) {
          remoteError = "";
          const next = fromRow(data);
          const i = list.findIndex((f) => f.id === item.id || f.id === next.id);
          if (i >= 0) list[i] = next;
          else list.push(next);
          return apply(list);
        }
      }
      const i = list.findIndex((f) => f.id === item.id);
      if (i >= 0) list[i] = item;
      else list.push(item);
      return apply(list);
    },
    async remove(id) {
      const sb = client();
      if (sb && /^\d+$/.test(String(id))) {
        const { error } = await sb.from("faculty").delete().eq("id", Number(id));
        if (error) remoteError = error.message;
      }
      return apply(this.all().filter((f) => f.id !== String(id)));
    },
    async reorder(ids) {
      const list = this.all();
      const byId = Object.fromEntries(list.map((f) => [f.id, f]));
      const next = ids.map((id, i) => {
        const item = byId[id];
        if (!item) return null;
        item.order = i + 1;
        return item;
      }).filter(Boolean);
      list.forEach((f) => { if (!ids.includes(f.id)) next.push(f); });
      const sb = client();
      if (sb) {
        for (const item of next) {
          if (/^\d+$/.test(item.id)) {
            const { error } = await sb.from("faculty").update({ sort_order: item.order }).eq("id", Number(item.id));
            if (error) remoteError = error.message;
          }
        }
      }
      return apply(next);
    },
    async restore() {
      const sb = client();
      if (sb) {
        const { error } = await sb.from("faculty").delete().neq("id", 0);
        if (error) remoteError = error.message;
        else await pushSeed(sb);
        return refresh();
      }
      localStorage.removeItem(KEY);
      return apply(seed());
    },
    async sync() {
      return refresh();
    },
    ready: refresh()
  };

  if (!window.IMMBA.seedFaculty) {
    window.IMMBA.seedFaculty = JSON.parse(JSON.stringify(window.IMMBA.faculty || []));
  }
  window.FacultyStore = FacultyStore;
})();
