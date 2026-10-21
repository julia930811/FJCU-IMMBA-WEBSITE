(function () {
  function fileFromClipboard(e) {
    const items = [...(e.clipboardData && e.clipboardData.items || [])];
    const item = items.find((i) => i.type && i.type.indexOf("image/") === 0);
    return item ? item.getAsFile() : null;
  }

  function fromFile(file, max = 1400, quality = 0.82) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("no file"));
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = function () {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error("image load failed"));
      };
      img.src = url;
    });
  }

  async function upload(file, bucket) {
    const sb = window.IMMBASupabase && window.IMMBASupabase.client;
    const dataUrl = await fromFile(file);
    if (!sb || !bucket) return dataUrl;
    const blob = await (await fetch(dataUrl)).blob();
    const path = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
    const { error } = await sb.storage.from(bucket).upload(path, blob, {
      contentType: "image/jpeg",
      upsert: true
    });
    if (error) return dataUrl;
    const pub = sb.storage.from(bucket).getPublicUrl(path);
    return (pub && pub.data && pub.data.publicUrl) || dataUrl;
  }

  window.IMMBAImage = { fileFromClipboard, fromFile, upload };
})();
