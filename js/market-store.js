(function () {
  const KEY = "immba-c2c-market-v1";
  const STATUSES = ["waiting_payment", "ready_to_ship", "shipped", "completed"];
  const STATUS_LABEL = {
    waiting_payment: { zh: "待付款", en: "Waiting for Payment" },
    ready_to_ship: { zh: "待出貨", en: "Ready to Ship" },
    shipped: { zh: "已出貨", en: "Shipped" },
    completed: { zh: "已完成", en: "Completed" }
  };
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

  const seedProducts = [
    { id: "mp1", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "International Marketing (Kotler)", category: "Textbook", description: "imMBA core reading. Highlighted chapters 1–8. Good condition.", price: 680, quantity: 4, imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", status: "active" },
    { id: "mp2", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "Corporate Finance notes (2025)", category: "Notes", description: "Lecture notes and practice sets from Corporate Finance.", price: 220, quantity: 6, imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", status: "active" },
    { id: "mp3", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "Harvard-style case pack: Global Strategy", category: "Case", description: "Course case pack for Global Strategy (teaching demo listing).", price: 150, quantity: 10, imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", status: "active" },
    { id: "mp4", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "Statistics for Managers workbook", category: "Textbook", description: "Workbook with answered problem sets. Spine intact.", price: 380, quantity: 2, imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", status: "active" }
  ];

  const seedOrders = [
    {
      id: "mo-demo-1",
      orderNo: "ORD-202610-1001",
      buyerId: "demo-buyer",
      buyerEmail: "buyer.demo@immba.local",
      sellerId: "demo-seller",
      sellerEmail: "demo.seller@immba.local",
      status: "completed",
      total: 680,
      createdAt: "2026-10-12T10:00:00.000Z",
      items: [{ productId: "mp1", name: "International Marketing (Kotler)", price: 680, quantity: 1 }]
    }
  ];

  let state = { products: [], orders: [], carts: {}, notices: [] };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        state = { products: seedProducts.map((p) => ({ ...p })), orders: seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })), carts: {}, notices: [] };
        save();
        return;
      }
      const parsed = JSON.parse(raw);
      state.products = parsed.products && parsed.products.length ? parsed.products : seedProducts.map((p) => ({ ...p }));
      state.orders = parsed.orders || [];
      state.carts = parsed.carts || {};
      state.notices = parsed.notices || [];
    } catch (e) {
      state = { products: seedProducts.map((p) => ({ ...p })), orders: seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })), carts: {}, notices: [] };
    }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
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
    if (u && (u.id === product.sellerId || u.email === product.sellerEmail)) throw new Error(t("不能購買自己上架的商品。", "Sellers cannot purchase their own listing."));
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
      if (line.quantity > availableStock(product)) throw new Error(t(product.name + " 超過可售庫存。", product.name + " exceeds available stock."));
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
        name: line.product.name,
        price: Number(line.product.price),
        quantity: line.quantity
      }));
      const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
      const order = {
        id: "mo" + Date.now() + Math.floor(Math.random() * 99),
        orderNo: "ORD-" + new Date().toISOString().slice(0, 7).replace("-", "") + "-" + String(Date.now()).slice(-4),
        buyerId: u.id,
        buyerEmail: u.email,
        sellerId: g.sellerId,
        sellerEmail: g.sellerEmail,
        status: "waiting_payment",
        total,
        createdAt: new Date().toISOString(),
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
    return u.id === product.sellerId || (u.email && u.email === product.sellerEmail);
  }

  function isOwnOrder(order) {
    const u = me();
    if (!u || !order) return false;
    return u.id === order.sellerId || (u.email && u.email === order.sellerEmail);
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
    if (j !== i + 1) throw new Error(t("訂單必須依序：待付款 → 待出貨 → 已出貨 → 已完成。", "Orders must move in sequence: Waiting for Payment → Ready to Ship → Shipped → Completed."));
    order.status = next;
    save();
    notify(t("訂單 " + order.orderNo + " 已更新為" + STATUS_LABEL[next].zh + "。", "Order " + order.orderNo + " is now " + STATUS_LABEL[next].en + "."), order.buyerEmail);
    return order;
  }

  function upsertProduct(input) {
    const u = me();
    if (!u) throw new Error(t("請先登入後再上架。", "Please sign in as a seller."));
    const name = String(input.name || "").trim();
    const category = String(input.category || "").trim();
    const description = String(input.description || "").trim();
    const price = Number(input.price);
    const quantity = Number(input.quantity);
    if (!name || !category || !description) throw new Error(t("商品名稱、類別與說明為必填。", "Product name, category and description are required."));
    if (!(price >= 0) || Number.isNaN(price)) throw new Error(t("請填價格。", "Price is required."));
    if (!(quantity >= 0) || Number.isNaN(quantity)) throw new Error(t("請填數量。", "Quantity is required."));
    const status = input.status === "hidden" ? "hidden" : "active";
    if (input.id) {
      const product = state.products.find((p) => p.id === input.id);
      if (!product) throw new Error(t("找不到商品。", "Listing not found."));
      if (!isOwnProduct(product)) throw new Error(t("只能修改自己上傳的商品。", "You can only edit listings you uploaded."));
      Object.assign(product, { name, category, description, price, quantity, imageUrl: input.imageUrl || product.imageUrl || "", status });
      save();
      return product;
    }
    const product = {
      id: "mp" + Date.now(),
      sellerId: u.id,
      sellerEmail: u.email,
      name,
      category,
      description,
      price,
      quantity,
      imageUrl: input.imageUrl || "",
      status
    };
    state.products.unshift(product);
    save();
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
      monthlyRevenue: scoped.reduce((s, o) => s + Number(o.total || 0), 0),
      itemsSold: scoped.reduce((s, o) => s + (o.items || []).reduce((n, i) => n + Number(i.quantity || 0), 0), 0),
      completedCount: completed.length,
      pendingPayments: orders.filter((o) => o.status === "waiting_payment").length,
      waitingShipment: orders.filter((o) => o.status === "ready_to_ship" || o.status === "shipped").length
    };
  }

  function csv(rows) {
    const header = ["Order ID", "Date", "Buyer", "Seller", "Products", "Amount", "Status"];
    const body = rows.map((o) => [
      o.orderNo,
      (o.createdAt || "").slice(0, 10),
      o.buyerEmail,
      o.sellerEmail,
      (o.items || []).map((i) => i.name + " x" + i.quantity).join("; "),
      o.total,
      o.status
    ]);
    return [header].concat(body).map((line) => line.map((cell) => `"${String(cell == null ? "" : cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  }

  load();

  window.MarketStore = {
    ready: Promise.resolve(),
    STATUSES,
    STATUS_LABEL,
    CATEGORIES,
    CATEGORY_LABEL,
    me,
    isPlatformAdmin,
    products: () => state.products,
    catalog: () => state.products.filter((p) => p.status === "active"),
    product: (id) => state.products.find((p) => p.id === id),
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
})();
