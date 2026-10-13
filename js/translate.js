(function () {
  const ZH_EN = [
    ["國際經營管理碩士學位學程", "International MBA program"],
    ["國際經營管理碩士班", "International MBA"],
    ["輔仁大學", "Fu Jen Catholic University"],
    ["管理學院", "College of Management"],
    ["國際經管", "imMBA"],
    ["甄試招生", "screening admission"],
    ["碩士招生", "graduate admission"],
    ["外國學生", "international students"],
    ["申請入學", "application"],
    ["口試通知", "interview notice"],
    ["報名", "application period"],
    ["雙碩士", "dual master’s"],
    ["雙聯碩士", "dual degree"],
    ["海外交換", "overseas exchange"],
    ["姊妹校", "sister school"],
    ["招生說明會", "admissions briefing"],
    ["學習環境", "learning environment"],
    ["最新公告", "latest announcement"],
    ["跨國", "cross-border"],
    ["合作", "partnership"],
    ["課程", "course"],
    ["論文", "thesis"],
    ["獎學金", "scholarship"],
    ["職涯", "career"],
    ["工作職缺", "job openings"],
    ["下一站", "next stop"],
    ["持續推進中", "moving forward"],
    ["重點回顧", "highlights"],
    ["明天開始", "starts tomorrow"],
    ["不只一個學位", "more than one degree"],
    ["黃金海岸", "Gold Coast"],
    ["澳洲", "Australia"]
  ];
  const EN_ZH = ZH_EN.map(([zh, en]) => [en, zh]);

  function hasHan(s) {
    return /[\u3400-\u9fff]/.test(s);
  }

  function replacePhrases(text, pairs) {
    let out = text;
    const sorted = [...pairs].sort((a, b) => b[0].length - a[0].length);
    sorted.forEach(([from, to]) => {
      if (!from) return;
      out = out.split(from).join(to);
    });
    return out;
  }

  function localTranslate(text, to) {
    const src = (text || "").trim();
    if (!src) return "";
    if (to === "en") return replacePhrases(src, ZH_EN);
    return replacePhrases(src, EN_ZH);
  }

  async function remoteTranslate(text, from, to) {
    const q = (text || "").trim().slice(0, 500);
    if (!q) return "";
    const langpair = (from === "zh" ? "zh-TW" : "en") + "|" + (to === "zh" ? "zh-TW" : "en");
    const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(q) + "&langpair=" + encodeURIComponent(langpair);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      const data = await res.json();
      const out = (data && data.responseData && data.responseData.translatedText) || "";
      if (out && out.toLowerCase() !== q.toLowerCase()) return out;
    } catch {
      /* use local fallback */
    } finally {
      clearTimeout(timer);
    }
    return "";
  }

  window.IMMBATranslate = {
    hasHan,
    local: localTranslate,
    async translate(text, to) {
      const from = to === "en" ? "zh" : "en";
      const remote = await remoteTranslate(text, from, to);
      if (remote) return remote;
      return localTranslate(text, to);
    }
  };
})();
