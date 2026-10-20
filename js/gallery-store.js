(function () {
  const KEY = "immba-gallery-v2";
  let cache = null;

  function seed() {
    return JSON.parse(JSON.stringify(window.IMMBA.gallery || []));
  }

  function normalize(g, i) {
    return {
      id: g.id || ("g" + (i + 1)),
      src: g.src || "",
      zh: g.zh || "",
      en: g.en || ""
    };
  }

  function apply(list) {
    cache = list.map(normalize);
    window.IMMBA.gallery = cache;
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) {}
    return cache;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return apply(parsed);
      }
    } catch (e) {}
    return apply(seed());
  }

  window.GalleryStore = {
    all() {
      return cache ? cache : load();
    },
    add(item) {
      const list = this.all();
      list.unshift(normalize({
        id: "g" + Date.now(),
        src: item.src,
        zh: item.zh || "新增照片",
        en: item.en || "New photo"
      }, 0));
      return apply(list);
    },
    restore() {
      localStorage.removeItem(KEY);
      return apply(seed());
    }
  };

  load();
})();
