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

  const seedProducts = [
    { id: "mp1", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "International Marketing (Kotler)", category: "Textbook", description: "imMBA core reading. Highlighted chapters 1–8. Good condition.", price: 680, quantity: 4, imageUrl: "img/market/international-marketing.jpg", status: "active" },
    { id: "mp2", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "Corporate Finance notes (2025)", category: "Notes", description: "Lecture notes and practice sets from Corporate Finance.", price: 220, quantity: 6, imageUrl: "img/market/corporate-finance-notes.jpg", status: "active" },
    { id: "mp3", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "Harvard-style case pack: Global Strategy", category: "Case", description: "Course case pack for Global Strategy (teaching demo listing).", price: 150, quantity: 10, imageUrl: "img/market/global-strategy-case.jpg", status: "active" },
    { id: "mp4", sellerId: "demo-seller", sellerEmail: "demo.seller@immba.local", name: "Statistics for Managers workbook", category: "Textbook", description: "Workbook with answered problem sets. Spine intact.", price: 380, quantity: 2, imageUrl: "img/market/statistics-workbook.jpg", status: "active" }
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
      subtotal: 680,
      fee: 4,
      shipping: 60,
      total: 740,
      sellerNet: 676,
      createdAt: "2026-10-12T10:00:00.000Z",
      updatedAt: "2026-10-12T10:00:00.000Z",
      items: [{ productId: "mp1", name: "International Marketing (Kotler)", price: 680, quantity: 1 }]
    },
    {
      id: "mo-demo-2",
      orderNo: "ORD-202611-1002",
      buyerId: "demo-buyer",
      buyerEmail: "buyer.demo@immba.local",
      sellerId: "demo-seller",
      sellerEmail: "demo.seller@immba.local",
      status: "waiting_payment",
      subtotal: 220,
      fee: 4,
      shipping: 60,
      total: 280,
      sellerNet: 216,
      createdAt: "2026-11-17T02:10:00.000Z",
      updatedAt: "2026-11-17T02:10:00.000Z",
      items: [{ productId: "mp2", name: "Corporate Finance notes (2025)", price: 220, quantity: 1 }]
    },
    {
      id: "mo-demo-3",
      orderNo: "ORD-202611-1003",
      buyerId: "demo-buyer-2",
      buyerEmail: "buyer.two@immba.local",
      sellerId: "demo-seller",
      sellerEmail: "demo.seller@immba.local",
      status: "shipped",
      subtotal: 150,
      fee: 4,
      shipping: 60,
      total: 210,
      sellerNet: 146,
      createdAt: "2026-11-16T09:40:00.000Z",
      updatedAt: "2026-11-16T09:40:00.000Z",
      items: [{ productId: "mp3", name: "Harvard-style case pack: Global Strategy", price: 150, quantity: 1 }]
    }
  ];

  let state = { products: [], orders: [], carts: {}, notices: [], platformFee: PLATFORM_FEE };

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
      save();
    } catch (e) {
      state = {
        products: seedProducts.map((p) => ({ ...p })),
        orders: seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) })),
        carts: {},
        notices: [],
        platformFee: PLATFORM_FEE
      };
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
        (o.items || []).map((i) => i.name + " x" + i.quantity).join("; "),
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
