(function () {
  const KEY = "immba-admin-news-v1";

  function seed() {
    return JSON.parse(JSON.stringify(window.IMMBA.seedNews || window.IMMBA.news || []));
  }

  function normalize(n, i) {
    return {
      id: n.id || ("n" + Date.now() + "-" + i),
      date: n.date || "",
      href: n.href || "",
      status: n.status === "draft" ? "draft" : "published",
      pinned: !!n.pinned,
      order: n.order != null && n.order !== "" ? Number(n.order) : i + 1,
      zhTitle: n.zhTitle || "",
      enTitle: n.enTitle || "",
      zhBody: n.zhBody || "",
      enBody: n.enBody || "",
      imageUrl: n.imageUrl || n.image_url || "",
      zhTitleAuto: !!n.zhTitleAuto,
      enTitleAuto: !!n.enTitleAuto,
      zhBodyAuto: !!n.zhBodyAuto,
      enBodyAuto: !!n.enBodyAuto
    };
  }

  function sortList(list) {
    return [...list].sort((a, b) =>
      (Number(a.order) - Number(b.order)) ||
      (b.pinned - a.pinned) ||
      String(b.date).localeCompare(String(a.date))
    );
  }

  function apply(list) {
    window.IMMBA.news = sortList(list).filter((n) => n.status === "published");
  }

  const NewsStore = {
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
    published() {
      return sortList(this.all()).filter((n) => n.status === "published");
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
      const i = list.findIndex((n) => n.id === item.id);
      if (i >= 0) list[i] = item;
      else list.unshift(item);
      return this.save(list);
    },
    remove(id) {
      return this.save(this.all().filter((n) => n.id !== id));
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
    },
    syncState(n) {
      const zhT = (n.zhTitle || "").trim();
      const enT = (n.enTitle || "").trim();
      const zhB = (n.zhBody || "").trim();
      const enB = (n.enBody || "").trim();
      const titlesOk = !!(zhT && enT);
      const bodiesOk = (!zhB && !enB) || !!(zhB && enB);
      const distinct = !zhT || zhT !== enT;
      const auto = !!(n.zhTitleAuto || n.enTitleAuto || n.zhBodyAuto || n.enBodyAuto);
      return { titlesOk, bodiesOk, distinct, auto, ok: titlesOk && bodiesOk };
    }
  };

  if (!window.IMMBA.seedNews) {
    window.IMMBA.seedNews = JSON.parse(JSON.stringify(window.IMMBA.news || []));
  }
  window.NewsStore = NewsStore;
  NewsStore.sync();
})();
