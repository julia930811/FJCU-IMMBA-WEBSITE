(function () {
  const KEY = "immba-admin-faculty-v1";
  const TYPES = ["full", "visit", "adjunct"];

  function seed() {
    return JSON.parse(JSON.stringify(window.IMMBA.seedFaculty || window.IMMBA.faculty || []));
  }

  function normalize(f, i) {
    const type = TYPES.includes(f.type) ? f.type : "full";
    return {
      id: f.id || ("f" + Date.now() + "-" + i),
      type,
      order: f.order != null && f.order !== "" ? Number(f.order) : i + 1,
      imageUrl: f.imageUrl || "",
      zhName: f.zhName || "",
      enName: f.enName || "",
      deptZh: f.deptZh || "",
      deptEn: f.deptEn || "",
      titleZh: f.titleZh || "",
      titleEn: f.titleEn || "",
      eduZh: f.eduZh || "",
      eduEn: f.eduEn || "",
      fieldsZh: f.fieldsZh || "",
      fieldsEn: f.fieldsEn || "",
      phone: f.phone || "",
      email: f.email || "",
      site: f.site || ""
    };
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
    window.IMMBA.faculty = sortList(list);
  }

  const FacultyStore = {
    all() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return seed().map(normalize);
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return seed().map(normalize);
        return parsed.map(normalize);
      } catch {
        return seed().map(normalize);
      }
    },
    save(list) {
      const next = list.map(normalize);
      localStorage.setItem(KEY, JSON.stringify(next));
      apply(next);
      return next;
    },
    upsert(record) {
      const list = this.all();
      const item = normalize(record, list.length);
      const i = list.findIndex((f) => f.id === item.id);
      if (i >= 0) list[i] = item;
      else list.push(item);
      return this.save(list);
    },
    remove(id) {
      return this.save(this.all().filter((f) => f.id !== id));
    },
    reorder(ids) {
      const list = this.all();
      const byId = Object.fromEntries(list.map((f) => [f.id, f]));
      const next = ids.map((id, i) => {
        const item = byId[id];
        if (!item) return null;
        item.order = i + 1;
        return item;
      }).filter(Boolean);
      list.forEach((f) => {
        if (!ids.includes(f.id)) next.push(f);
      });
      return this.save(next);
    },
    restore() {
      localStorage.removeItem(KEY);
      const list = seed().map(normalize);
      apply(list);
      return list;
    },
    sync() {
      const list = this.all();
      apply(list);
      return list;
    }
  };

  if (!window.IMMBA.seedFaculty) {
    window.IMMBA.seedFaculty = JSON.parse(JSON.stringify(window.IMMBA.faculty || []));
  }
  window.FacultyStore = FacultyStore;
  FacultyStore.sync();
})();
