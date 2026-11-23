(function () {
  const KEY = "immba-c2c-market-v2";
  const STATUSES = ["waiting_payment", "ready_to_ship", "shipped", "completed"];
  const STATUS_LABEL = {
    waiting_payment: { zh: "待確認付款", en: "Waiting for Payment Confirmation" },
    ready_to_ship: { zh: "待出貨", en: "Ready to Ship" },
    shipped: { zh: "已出貨", en: "Shipped" },
    completed: { zh: "已完成", en: "Completed" }
  };
  const PLATFORM_FEE = 4;
  const SHIPPING_FEE = 60;
  const CATEGORIES = ["Textbook", "Notes", "Case", "Other"];
  const CATEGORY_LABEL = {
    Textbook: { zh: "教科書", en: "Textbook" },
    Notes: { zh: "筆記", en: "Notes" },
    Case: { zh: "個案", en: "Case" },
    Other: { zh: "其他", en: "Other" }
  };

  function t(zh, en) {
    return document.documentElement.lang !== "en" ? zh : en;
  }

  function isZh() {
    return document.documentElement.lang !== "en";
  }

  function hasHan(s) {
    return /[\u3400-\u9fff]/.test(String(s || ""));
  }

  function splitLegacyText(value, zhVal, enVal) {
    const src = String(value || "").trim();
    let zh = String(zhVal || "").trim();
    let en = String(enVal || "").trim();
    if (src && !zh && !en) {
      if (hasHan(src)) zh = src;
      else en = src;
    } else if (src) {
      if (!zh && hasHan(src)) zh = src;
      if (!en && !hasHan(src)) en = src;
    }
    return { zh, en };
  }

  function normalizeProduct(p) {
    if (!p) return p;
    const names = splitLegacyText(p.name, p.nameZh, p.nameEn);
    const descs = splitLegacyText(p.description, p.descriptionZh, p.descriptionEn);
    p.nameZh = names.zh;
    p.nameEn = names.en;
    p.descriptionZh = descs.zh;
    p.descriptionEn = descs.en;
    p.name = names.en || names.zh || String(p.name || "").trim();
    p.description = descs.en || descs.zh || String(p.description || "").trim();
    return p;
  }

  function fillPair(zhVal, enVal) {
    let zh = String(zhVal || "").trim();
    let en = String(enVal || "").trim();
    if (!zh && en) zh = en;
    if (!en && zh) en = zh;
    return { zh, en };
  }

  function productName(p) {
    if (!p) return "";
    return isZh() ? (p.nameZh || p.name || p.nameEn || "") : (p.nameEn || p.name || p.nameZh || "");
  }

  function productDesc(p) {
    if (!p) return "";
    return isZh() ? (p.descriptionZh || p.description || p.descriptionEn || "") : (p.descriptionEn || p.description || p.descriptionZh || "");
  }

  function itemName(item) {
    if (!item) return "";
    return isZh() ? (item.nameZh || item.name || item.nameEn || "") : (item.nameEn || item.name || item.nameZh || "");
  }

  const JIAYI_EMAIL = "jiayiwu009@gmail.com";
  const seedProducts = [
    { id: "mp1", sellerId: "jiayi", sellerEmail: JIAYI_EMAIL, name: "International Marketing (Kotler)", nameZh: "國際行銷（Kotler）", nameEn: "International Marketing (Kotler)", category: "Textbook", description: "imMBA core reading. Highlighted chapters 1–8. Good condition.", descriptionZh: "imMBA 核心讀本。第 1–8 章有畫線，狀況良好。", descriptionEn: "imMBA core reading. Highlighted chapters 1–8. Good condition.", price: 680, quantity: 4, imageUrl: "img/market/international-marketing.jpg", status: "active" },
    { id: "mp2", sellerId: "jiayi", sellerEmail: JIAYI_EMAIL, name: "Corporate Finance notes (2025)", nameZh: "公司理財筆記（2025）", nameEn: "Corporate Finance notes (2025)", category: "Notes", description: "Lecture notes and practice sets from Corporate Finance.", descriptionZh: "公司理財課程講義與習題。", descriptionEn: "Lecture notes and practice sets from Corporate Finance.", price: 220, quantity: 6, imageUrl: "img/market/corporate-finance-notes.jpg", status: "active" },
    { id: "mp3", sellerId: "jiayi", sellerEmail: JIAYI_EMAIL, name: "Harvard-style case pack: Global Strategy", nameZh: "哈佛式個案包：全球策略", nameEn: "Harvard-style case pack: Global Strategy", category: "Case", description: "Course case pack for Global Strategy (teaching demo listing).", descriptionZh: "全球策略課程個案包（教學示範上架）。", descriptionEn: "Course case pack for Global Strategy (teaching demo listing).", price: 150, quantity: 10, imageUrl: "img/market/global-strategy-case.jpg", status: "active" },
    { id: "mp4", sellerId: "jiayi", sellerEmail: JIAYI_EMAIL, name: "Statistics for Managers workbook", nameZh: "管理者統計學習作本", nameEn: "Statistics for Managers workbook", category: "Textbook", description: "Workbook with answered problem sets. Spine intact.", descriptionZh: "含解答的習作本，書脊完好。", descriptionEn: "Workbook with answered problem sets. Spine intact.", price: 380, quantity: 2, imageUrl: "img/market/statistics-workbook.jpg", status: "active" }
  ];

  const seedOrders = [
    {
      id: "mo-demo-1",
      orderNo: "ORD-202610-1001",
      buyerId: "demo-buyer",
      buyerEmail: "buyer.demo@immba.local",
      sellerId: "jiayi",
      sellerEmail: JIAYI_EMAIL,
      status: "completed",
      subtotal: 680,
      fee: 4,
      shipping: 60,
      total: 740,
      sellerNet: 676,
      createdAt: "2026-10-12T10:00:00.000Z",
      updatedAt: "2026-10-12T10:00:00.000Z",
      items: [{ productId: "mp1", name: "International Marketing (Kotler)", nameZh: "國際行銷（Kotler）", nameEn: "International Marketing (Kotler)", price: 680, quantity: 1 }]
    },
    {
      id: "mo-demo-2",
      orderNo: "ORD-202611-1002",
      buyerId: "demo-buyer",
      buyerEmail: "buyer.demo@immba.local",
      sellerId: "jiayi",
      sellerEmail: JIAYI_EMAIL,
      status: "waiting_payment",
      subtotal: 220,
      fee: 4,
      shipping: 60,
      total: 280,
      sellerNet: 216,
      createdAt: "2026-11-17T02:10:00.000Z",
      updatedAt: "2026-11-17T02:10:00.000Z",
      items: [{ productId: "mp2", name: "Corporate Finance notes (2025)", nameZh: "公司理財筆記（2025）", nameEn: "Corporate Finance notes (2025)", price: 220, quantity: 1 }]
    },
    {
      id: "mo-demo-3",
      orderNo: "ORD-202611-1003",
      buyerId: "demo-buyer-2",
      buyerEmail: "buyer.two@immba.local",
      sellerId: "jiayi",
      sellerEmail: JIAYI_EMAIL,
      status: "shipped",
      subtotal: 150,
      fee: 4,
      shipping: 60,
      total: 210,
      sellerNet: 146,
      createdAt: "2026-11-16T09:40:00.000Z",
      updatedAt: "2026-11-16T09:40:00.000Z",
      items: [{ productId: "mp3", name: "Harvard-style case pack: Global Strategy", nameZh: "哈佛式個案包：全球策略", nameEn: "Harvard-style case pack: Global Strategy", price: 150, quantity: 1 }]
    }
  ];

  let state = { products: [], orders: [], carts: {}, notices: [], platformFee: PLATFORM_FEE };
  const SEED_IDS = { mp1: 1, mp2: 1, mp3: 1, mp4: 1 };
  const SEED_ORDER_IDS = { "mo-demo-1": 1, "mo-demo-2": 1, "mo-demo-3": 1 };

  function sameEmail(a, b) {
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  }

  function isDemoOwned(row) {
    if (!row) return false;
    return row.sellerId === "demo-seller" || sameEmail(row.sellerEmail, "demo.seller@immba.local");
  }

  function migrateSeedOwner() {
    const u = me();
    const id = (u && sameEmail(u.email, JIAYI_EMAIL) && u.id) || "jiayi";
    let changed = false;
    (state.products || []).forEach((p) => {
      if (!SEED_IDS[p.id] && !isDemoOwned(p)) return;
      if (p.sellerId === id && sameEmail(p.sellerEmail, JIAYI_EMAIL)) return;
      p.sellerId = id;
      p.sellerEmail = JIAYI_EMAIL;
      changed = true;
    });
    (state.orders || []).forEach((o) => {
      if (!SEED_ORDER_IDS[o.id] && !isDemoOwned(o)) return;
      if (o.sellerId === id && sameEmail(o.sellerEmail, JIAYI_EMAIL)) return;
      o.sellerId = id;
      o.sellerEmail = JIAYI_EMAIL;
      changed = true;
    });
    return changed;
  }

  function migrateProductI18n() {
    let changed = false;
    const seedById = {};
    seedProducts.forEach((s) => { seedById[s.id] = s; });
    (state.products || []).forEach((p) => {
      const before = JSON.stringify([p.name, p.nameZh, p.nameEn, p.description, p.descriptionZh, p.descriptionEn]);
      const seed = seedById[p.id];
      if (seed && !p.updatedAt) {
        const nameMatches = !p.name || p.name === seed.name || p.name === seed.nameEn || p.name === seed.nameZh;
        const descMatches = !p.description || p.description === seed.description || p.description === seed.descriptionEn || p.description === seed.descriptionZh;
        if (nameMatches && !String(p.nameZh || "").trim()) p.nameZh = seed.nameZh;
        if (nameMatches && !String(p.nameEn || "").trim()) p.nameEn = seed.nameEn;
        if (descMatches && !String(p.descriptionZh || "").trim()) p.descriptionZh = seed.descriptionZh;
        if (descMatches && !String(p.descriptionEn || "").trim()) p.descriptionEn = seed.descriptionEn;
      }
      normalizeProduct(p);
      const after = JSON.stringify([p.name, p.nameZh, p.nameEn, p.description, p.descriptionZh, p.descriptionEn]);
      if (before !== after) changed = true;
    });
    (state.orders || []).forEach((o) => {
      (o.items || []).forEach((item) => {
        if (String(item.nameZh || "").trim() && String(item.nameEn || "").trim()) return;
        const p = (state.products || []).find((x) => x.id === item.productId);
        const seed = seedById[item.productId];
        const src = p || seed;
        if (src) {
          if (!String(item.nameZh || "").trim()) item.nameZh = src.nameZh || item.name || "";
          if (!String(item.nameEn || "").trim()) item.nameEn = src.nameEn || item.name || "";
          changed = true;
        } else if (item.name) {
          const split = splitLegacyText(item.name, item.nameZh, item.nameEn);
          item.nameZh = split.zh;
          item.nameEn = split.en;
          changed = true;
        }
      });
    });
    return changed;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        state = {
          products: seedProducts.map((p) => ({ ...p })),
          orders: seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })),
          carts: {},
          notices: [],
          platformFee: PLATFORM_FEE
        };
        migrateSeedOwner();
        migrateProductI18n();
        save();
        return;
      }
      const parsed = JSON.parse(raw);
      state.products = parsed.products && parsed.products.length ? parsed.products : seedProducts.map((p) => ({ ...p }));
      state.orders = parsed.orders || [];
      state.carts = parsed.carts || {};
      state.notices = parsed.notices || [];
      const fee = Number(parsed.platformFee);
      state.platformFee = Number.isFinite(fee) && fee >= 0 ? fee : PLATFORM_FEE;
      const byId = {};
      state.orders.forEach((o) => { byId[o.id] = o; });
      seedOrders.forEach((row) => {
        const cur = byId[row.id];
        if (!cur) state.orders.push({ ...row, items: row.items.map((i) => ({ ...i })) });
        else if (cur.subtotal == null) {
          cur.subtotal = row.subtotal;
          cur.fee = row.fee;
          cur.shipping = row.shipping;
          cur.total = row.total;
          cur.sellerNet = row.sellerNet;
        }
      });
      migrateSeedOwner();
      migrateProductI18n();
      save();
    } catch (e) {
      state = {
        products: seedProducts.map((p) => ({ ...p })),
        orders: seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })),
        carts: {},
        notices: [],
        platformFee: PLATFORM_FEE
      };
      migrateSeedOwner();
      migrateProductI18n();
    }
  }

  function notifyChange() {
    try {
      window.dispatchEvent(new Event("immba-market"));
    } catch (err) {}
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return;
    } catch (err) {
      const compact = {
        products: state.products.map((p) => {
          const url = String(p.imageUrl || "");
          if (url.indexOf("data:") === 0 && url.length > 120000) return { ...p, imageUrl: "" };
          return p;
        }),
        orders: state.orders,
        carts: state.carts,
        notices: (state.notices || []).slice(0, 20),
        platformFee: state.platformFee
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(compact));
        state.products = compact.products;
        state.notices = compact.notices;
        return;
      } catch (err2) {
        throw new Error(t("圖片太大，請改用較小的照片後再上架。", "The photo is too large. Use a smaller image and try again."));
      }
    }
  }

  function auth() {
    return window.IMMBAAuth || {};
  }

  function me() {
    const u = auth().user && auth().user();
    if (!u) return null;
    return { id: u.id, email: u.email || "" };
  }

  function isPlatformAdmin() {
    return !!(auth().canEdit && auth().canEdit());
  }

  function purchasedQty(productId, exceptOrderId) {
    return state.orders.reduce((sum, order) => {
      if (exceptOrderId && order.id === exceptOrderId) return sum;
      return sum + (order.items || []).reduce((s, item) => item.productId === productId ? s + Number(item.quantity || 0) : s, 0);
    }, 0);
  }

  function platformFee() {
    const n = Number(state.platformFee);
    return Number.isFinite(n) && n >= 0 ? n : PLATFORM_FEE;
  }

  function setPlatformFee(value) {
    if (!isPlatformAdmin()) throw new Error(t("只有平台管理員可以設定抽成。", "Only the platform admin can set the fee."));
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) throw new Error(t("抽成必須是 0 以上的數字。", "Fee must be a number of 0 or more."));
    state.platformFee = Math.round(n);
    save();
    return state.platformFee;
  }

  function totalsFromSubtotal(subtotal) {
    const n = Number(subtotal || 0);
    const fee = platformFee();
    return {
      subtotal: n,
      fee,
      shipping: SHIPPING_FEE,
      total: n + SHIPPING_FEE,
      sellerNet: Math.max(0, n - fee)
    };
  }

  function orderMoney(order) {
    if (order && order.subtotal != null) {
      const subtotal = Number(order.subtotal || 0);
      const fee = Number(order.fee != null ? order.fee : platformFee());
      const shipping = Number(order.shipping != null ? order.shipping : SHIPPING_FEE);
      return {
        subtotal,
        fee,
        shipping,
        total: Number(order.total != null ? order.total : subtotal + shipping),
        sellerNet: Number(order.sellerNet != null ? order.sellerNet : Math.max(0, subtotal - fee))
      };
    }
    const subtotal = Number(order && order.total || 0);
    return { subtotal, fee: 0, shipping: 0, total: subtotal, sellerNet: subtotal };
  }

  function availableStock(product) {
    return Math.max(0, Number(product.quantity || 0) - purchasedQty(product.id));
  }

  function cartKey() {
    const u = me();
    return u ? u.id : "visitor";
  }

  function cart() {
    return state.carts[cartKey()] || [];
  }

  function setCart(items) {
    state.carts[cartKey()] = items;
    save();
  }

  function notify(message, toEmail) {
    state.notices.unshift({
      id: "n" + Date.now(),
      toEmail: toEmail || "",
      message,
      at: new Date().toISOString()
    });
    state.notices = state.notices.slice(0, 80);
    save();
  }

  function addToCart(productId, qty) {
    const product = state.products.find((p) => p.id === productId);
    if (!product || product.status !== "active") throw new Error(t("此商品目前無法購買。", "Product is not available."));
    const u = me();
    if (u && (u.id === product.sellerId || sameEmail(u.email, product.sellerEmail))) throw new Error(t("不能購買自己上架的商品。", "Sellers cannot purchase their own listing."));
    const n = Math.max(1, Number(qty || 1));
    const items = cart().slice();
    const existing = items.find((i) => i.productId === productId);
    const nextQty = (existing ? Number(existing.quantity) : 0) + n;
    if (nextQty > availableStock(product)) throw new Error(t("數量超過可售庫存。", "Requested quantity exceeds available stock."));
    if (existing) existing.quantity = nextQty;
    else items.push({ productId, quantity: n });
    setCart(items);
  }

  function updateCartQty(productId, qty) {
    const product = state.products.find((p) => p.id === productId);
    const n = Math.max(0, Number(qty || 0));
    let items = cart().slice();
    if (!n) items = items.filter((i) => i.productId !== productId);
    else {
      if (product && n > availableStock(product)) throw new Error(t("數量超過可售庫存。", "Requested quantity exceeds available stock."));
      const row = items.find((i) => i.productId === productId);
      if (row) row.quantity = n;
    }
    setCart(items);
  }

  function checkout() {
    const u = me();
    if (!u) throw new Error(t("請先登入再結帳。", "Please sign in to check out."));
    const items = cart();
    if (!items.length) throw new Error(t("購物車是空的。", "Cart is empty."));
    const groups = {};
    items.forEach((line) => {
      const product = state.products.find((p) => p.id === line.productId);
      if (!product || product.status !== "active") throw new Error(t("有商品已下架，無法結帳。", "A listing is no longer available."));
      if (line.quantity > availableStock(product)) throw new Error(t(productName(product) + " 超過可售庫存。", productName(product) + " exceeds available stock."));
      const key = product.sellerId || product.sellerEmail;
      if (!groups[key]) groups[key] = { product, lines: [] };
      groups[key].lines.push({ product, quantity: Number(line.quantity) });
      groups[key].sellerId = product.sellerId;
      groups[key].sellerEmail = product.sellerEmail;
    });
    const created = [];
    Object.keys(groups).forEach((key) => {
      const g = groups[key];
      const orderItems = g.lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name || line.product.nameEn || line.product.nameZh,
        nameZh: line.product.nameZh || line.product.name || "",
        nameEn: line.product.nameEn || line.product.name || "",
        price: Number(line.product.price),
        quantity: line.quantity
      }));
      const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const money = totalsFromSubtotal(subtotal);
      const order = {
        id: "mo" + Date.now() + Math.floor(Math.random() * 99),
        orderNo: "ORD-" + new Date().toISOString().slice(0, 7).replace("-", "") + "-" + String(Date.now()).slice(-4),
        buyerId: u.id,
        buyerEmail: u.email,
        sellerId: g.sellerId,
        sellerEmail: g.sellerEmail,
        status: "waiting_payment",
        subtotal: money.subtotal,
        fee: money.fee,
        shipping: money.shipping,
        total: money.total,
        sellerNet: money.sellerNet,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: orderItems
      };
      state.orders.unshift(order);
      created.push(order);
      notify(t("新訂單 " + order.orderNo + " 待確認付款。", "New order " + order.orderNo + " is waiting for payment."), g.sellerEmail);
    });
    setCart([]);
    save();
    return created;
  }

  function isOwnProduct(product) {
    const u = me();
    if (!u || !product) return false;
    return u.id === product.sellerId || sameEmail(u.email, product.sellerEmail);
  }

  function isOwnOrder(order) {
    const u = me();
    if (!u || !order) return false;
    return u.id === order.sellerId || sameEmail(u.email, order.sellerEmail);
  }

  function requireSeller(order) {
    const u = me();
    if (!u) throw new Error(t("請先登入。", "Please sign in."));
    if (!isOwnOrder(order)) throw new Error(t("只能處理自己賣出的訂單。", "You can only update orders for listings you uploaded."));
  }

  function setStatus(orderId, next) {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) throw new Error(t("找不到訂單。", "Order not found."));
    requireSeller(order);
    const i = STATUSES.indexOf(order.status);
    const j = STATUSES.indexOf(next);
    if (order.status === "completed") throw new Error(t("已完成的訂單必須保留，不能再改或刪除。", "Completed transactions must be kept as business records."));
    if (j !== i + 1) throw new Error(t("訂單必須依序：下單 → 待確認付款 → 待出貨 → 已出貨 → 已完成。", "Orders must move in sequence: Order Placed → Waiting for Payment → Ready to Ship → Shipped → Completed."));
    order.status = next;
    order.updatedAt = new Date().toISOString();
    save();
    notify(t("訂單 " + order.orderNo + " 已更新為" + STATUS_LABEL[next].zh + "。", "Order " + order.orderNo + " is now " + STATUS_LABEL[next].en + "."), order.buyerEmail);
    return order;
  }

  function upsertProduct(input) {
    const u = me();
    if (!u) throw new Error(t("請先登入後再上架。", "Please sign in as a seller."));
    const splitN = splitLegacyText(input.name, input.nameZh, input.nameEn);
    const splitD = splitLegacyText(input.description, input.descriptionZh, input.descriptionEn);
    let nameZh = splitN.zh;
    let nameEn = splitN.en;
    let descriptionZh = splitD.zh;
    let descriptionEn = splitD.en;
    const existing = input.id ? state.products.find((p) => String(p.id) === String(input.id)) : null;
    if (existing) {
      const oldZh = String(existing.nameZh || "").trim();
      const oldEn = String(existing.nameEn || "").trim();
      const zhChanged = !!nameZh && nameZh !== oldZh;
      const enChanged = !!nameEn && nameEn !== oldEn;
      if (zhChanged && !enChanged) nameEn = nameZh;
      if (enChanged && !zhChanged) nameZh = nameEn;
      const oldDz = String(existing.descriptionZh || "").trim();
      const oldDe = String(existing.descriptionEn || "").trim();
      const dzChanged = !!descriptionZh && descriptionZh !== oldDz;
      const deChanged = !!descriptionEn && descriptionEn !== oldDe;
      if (dzChanged && !deChanged) descriptionEn = descriptionZh;
      if (deChanged && !dzChanged) descriptionZh = descriptionEn;
    }
    const names = fillPair(nameZh, nameEn);
    const descs = fillPair(descriptionZh, descriptionEn);
    nameZh = names.zh;
    nameEn = names.en;
    descriptionZh = descs.zh;
    descriptionEn = descs.en;
    const name = nameEn || nameZh;
    const description = descriptionEn || descriptionZh;
    const category = String(input.category || "").trim();
    const price = Number(input.price);
    const quantity = Number(input.quantity);
    if (!name || !category || !description) throw new Error(t("商品名稱、類別與說明為必填。", "Product name, category and description are required."));
    if (!(price >= 0) || Number.isNaN(price)) throw new Error(t("請填價格。", "Price is required."));
    if (!(quantity >= 0) || Number.isNaN(quantity)) throw new Error(t("請填數量。", "Quantity is required."));
    const status = input.status === "hidden" ? "hidden" : "active";
    const stamp = new Date().toISOString();
    const i18n = {
      name,
      nameZh,
      nameEn,
      description,
      descriptionZh,
      descriptionEn,
      nameZhAuto: !!input.nameZhAuto,
      nameEnAuto: !!input.nameEnAuto,
      descriptionZhAuto: !!input.descriptionZhAuto,
      descriptionEnAuto: !!input.descriptionEnAuto
    };
    const patch = {
      ...i18n,
      category,
      price,
      quantity,
      imageUrl: input.imageUrl || (existing && existing.imageUrl) || "",
      status,
      updatedAt: stamp
    };
    if (input.id) {
      if (!existing) throw new Error(t("找不到商品。", "Listing not found."));
      if (!isOwnProduct(existing)) throw new Error(t("只能編輯自己上傳的商品。", "You can only update listings you uploaded."));
      Object.assign(existing, patch);
      const idx = state.products.indexOf(existing);
      if (idx > 0) {
        state.products.splice(idx, 1);
        state.products.unshift(existing);
      }
      save();
      notifyChange();
      return existing;
    }
    const product = {
      id: "mp" + Date.now(),
      sellerId: u.id,
      sellerEmail: u.email,
      ...patch
    };
    state.products.unshift(product);
    save();
    notifyChange();
    return product;
  }

  function removeProduct(id) {
    const u = me();
    if (!u) throw new Error(t("請先登入。", "Please sign in."));
    const product = state.products.find((p) => p.id === id);
    if (!product) return;
    if (!isOwnProduct(product)) throw new Error(t("只能下架自己上傳的商品。", "You can only remove listings you uploaded."));
    state.products = state.products.filter((p) => p.id !== id);
    save();
    notifyChange();
  }

  function mine(kind) {
    const u = me();
    if (!u) return [];
    if (kind === "seller") return state.orders.filter((o) => isOwnOrder(o));
    return state.orders.filter((o) => o.buyerId === u.id || o.buyerEmail === u.email);
  }

  function sellerProducts() {
    const u = me();
    if (!u) return [];
    return state.products.filter((p) => isOwnProduct(p));
  }

  function sellerMonths() {
    const months = {};
    mine("seller").forEach((o) => {
      const m = (o.createdAt || "").slice(0, 7);
      if (m) months[m] = true;
    });
    months[new Date().toISOString().slice(0, 7)] = true;
    return Object.keys(months).sort().reverse();
  }

  function dashboard(month) {
    const orders = mine("seller");
    const completed = orders.filter((o) => o.status === "completed");
    const scoped = month ? completed.filter((o) => (o.createdAt || "").slice(0, 7) === month) : completed;
    return {
      month: month || "all",
      monthlyRevenue: scoped.reduce((s, o) => s + Number(orderMoney(o).sellerNet || 0), 0),
      monthlyFees: scoped.reduce((s, o) => s + Number(orderMoney(o).fee || 0), 0),
      monthlyShipping: scoped.reduce((s, o) => s + Number(orderMoney(o).shipping || 0), 0),
      itemsSold: scoped.reduce((s, o) => s + (o.items || []).reduce((n, i) => n + Number(i.quantity || 0), 0), 0),
      completedCount: completed.length,
      listedCount: sellerProducts().length,
      purchasedCount: completed.reduce((s, o) => s + (o.items || []).reduce((n, i) => n + Number(i.quantity || 0), 0), 0),
      pendingPayments: orders.filter((o) => o.status === "waiting_payment").length,
      waitingShipment: orders.filter((o) => o.status === "ready_to_ship" || o.status === "shipped").length
    };
  }

  function csv(rows) {
    const header = ["Order ID", "Date", "Buyer", "Seller", "Products", "Subtotal", "Platform fee", "Shipping", "Buyer total", "Seller net", "Status"];
    const body = rows.map((o) => {
      const m = orderMoney(o);
      return [
        o.orderNo,
        (o.createdAt || "").slice(0, 10),
        o.buyerEmail,
        o.sellerEmail,
        (o.items || []).map((i) => itemName(i) + " x" + i.quantity).join("; "),
        m.subtotal,
        m.fee,
        m.shipping,
        m.total,
        m.sellerNet,
        o.status
      ];
    });
    return [header].concat(body).map((line) => line.map((cell) => `"${String(cell == null ? "" : cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  }

  load();

  window.MarketStore = {
    ready: window.IMMBAAuth && window.IMMBAAuth.ready ? window.IMMBAAuth.ready : Promise.resolve(),
    STATUSES,
    STATUS_LABEL,
    CATEGORIES,
    CATEGORY_LABEL,
    PLATFORM_FEE,
    SHIPPING_FEE,
    platformFee,
    setPlatformFee,
    totalsFromSubtotal,
    orderMoney,
    me,
    isPlatformAdmin,
    products: () => state.products,
    catalog() {
      return state.products
        .map((p, i) => ({ p, i }))
        .filter((row) => (row.p.status || "active") === "active")
        .sort((a, b) => {
          const ta = a.p.updatedAt || "";
          const tb = b.p.updatedAt || "";
          if (ta === tb) return a.i - b.i;
          if (!ta) return 1;
          if (!tb) return -1;
          return tb.localeCompare(ta);
        })
        .map((row) => row.p);
    },
    product: (id) => state.products.find((p) => String(p.id) === String(id)),
    productName,
    productDesc,
    itemName,
    availableStock,
    cart,
    addToCart,
    updateCartQty,
    checkout,
    orders: () => state.orders.slice(),
    mine,
    sellerProducts,
    notices: () => {
      const u = me();
      if (!u) return [];
      return state.notices.filter((n) => !n.toEmail || n.toEmail === u.email);
    },
    isOwnProduct,
    isOwnOrder,
    setStatus,
    upsertProduct,
    removeProduct,
    dashboard,
    sellerMonths,
    csv,
    exportSellerCsv(month) {
      const rows = mine("seller");
      return csv(month ? rows.filter((o) => (o.createdAt || "").slice(0, 7) === month) : rows);
    },
    exportAdminCsv(rows) { return csv(rows || state.orders); }
  };

  window.addEventListener("immba-auth", () => {
    const owner = migrateSeedOwner();
    const i18n = migrateProductI18n();
    if (owner || i18n) save();
  });

  window.addEventListener("storage", (e) => {
    if (e.key !== KEY || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue);
      if (!parsed || !Array.isArray(parsed.products)) return;
      state.products = parsed.products;
      state.orders = parsed.orders || state.orders;
      state.carts = parsed.carts || state.carts;
      state.notices = parsed.notices || state.notices;
      if (parsed.platformFee != null) state.platformFee = parsed.platformFee;
      notifyChange();
    } catch (err) {}
  });
})();
