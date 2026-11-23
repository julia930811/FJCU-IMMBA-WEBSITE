(function () {
  function isImageFile(file) {
    return !!(file && String(file.type || "").indexOf("image/") === 0);
  }

  function fileFromList(list) {
    return [...(list || [])].find(isImageFile) || null;
  }

  function fileFromClipboard(e) {
    const data = e && e.clipboardData;
    if (!data) return null;
    const fromFiles = fileFromList(data.files);
    if (fromFiles) return fromFiles;
    const items = [...(data.items || [])];
    const item = items.find((i) => i.type && i.type.indexOf("image/") === 0);
    return item ? item.getAsFile() : null;
  }

  function fileFromDrop(e) {
    const data = e && e.dataTransfer;
    if (!data) return null;
    const fromFiles = fileFromList(data.files);
    if (fromFiles) return fromFiles;
    const items = [...(data.items || [])];
    const item = items.find((i) => i.kind === "file" && i.type && i.type.indexOf("image/") === 0);
    return item ? item.getAsFile() : null;
  }

  async function fromClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.read) return null;
    try {
      const items = await navigator.clipboard.read();
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const type = (item.types || []).find((t) => String(t).indexOf("image/") === 0);
        if (!type) continue;
        const blob = await item.getType(type);
        if (!blob) continue;
        return new File([blob], "pasted-image.jpg", { type: blob.type || "image/jpeg" });
      }
    } catch (err) {}
    return null;
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
        function encode(dim, q) {
          const scale = Math.min(1, dim / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", q);
        }
        let data = encode(max, quality);
        if (data.length > 180000) data = encode(Math.min(max, 720), Math.min(quality, 0.62));
        if (data.length > 180000) data = encode(560, 0.5);
        URL.revokeObjectURL(url);
        resolve(data);
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

  window.IMMBAImage = { fileFromClipboard, fileFromDrop, fromClipboard, fromFile, upload };
})();
