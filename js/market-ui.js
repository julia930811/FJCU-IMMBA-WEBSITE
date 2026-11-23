function initMarket() {
  const root = document.getElementById("marketRoot");
  if (!root) return;
  const zh = document.documentElement.lang !== "en";
  const S = window.MarketStore;
  const L = zh ? {
    buyer: "賣場",
    cart: "購物車",
    orders: "我的訂單",
    seller: "賣家",
    admin: "平台管理員",
    adminOnly: "只有平台管理員可以監看交易。",
    stock: "可售庫存",
    browse: "瀏覽商品",
    details: "商品詳情",
    addCart: "加入購物車",
    noListings: "尚無上架商品。",
    notFound: "找不到商品。",
    back: "返回賣場",
    buyerNoInv: "買家不能管理庫存。",
    qty: "購買數量",
    cartTitle: "購物車",
    product: "商品",
    price: "單價",
    qtyCol: "數量",
    remove: "移除",
    total: "合計",
    subtotal: "商品小計",
    shipping: "運費",
    fee: "平台抽成",
    sellerNet: "賣家實收",
    feeNote: "每筆訂單平台抽成 NT$4，運費 NT$60（由買家支付）。",
    checkout: "結帳並建立訂單",
    emptyCart: "購物車是空的。",
    noOrders: "沒有訂單。",
    orderId: "訂單編號",
    date: "日期",
    buyerCol: "買家",
    sellerCol: "賣家",
    items: "商品",
    amount: "金額",
    status: "狀態",
    kept: "已完成紀錄保留，不可刪除",
    buyerOrders: "買家訂單紀錄",
    buyerHistNote: "已完成的交易會留在買家訂單紀錄，不可刪除。",
    lifecycle: "下單 → 待確認付款 → 付款確認 → 待出貨 → 已出貨 → 已完成",
    lifecycleTitle: "訂單生命週期",
    placed: "下單",
    payConfirmed: "付款確認",
    keepRecords: "已完成的交易必須保留，作為商業紀錄。",
    name: "商品名稱",
    nameZh: "中文商品名稱",
    nameEn: "英文商品名稱",
    autoFromEn: "由英文自動翻譯（可再改）",
    autoFromZh: "由中文自動翻譯（可再改）",
    translateNote: "填寫中文或英文即可；另一語會自動翻譯，仍可再改。",
    category: "類別",
    desc: "商品說明",
    descZh: "中文商品說明",
    descEn: "英文商品說明",
    listPrice: "價格",
    listQty: "庫存數量",
    image: "商品圖片",
    chooseFile: "選擇檔案",
    dropHint: "把照片拖到這裡，或先點這框再貼上（Ctrl/Cmd+V，也可右鍵貼上）。",
    pasteHint: "點照片框後可貼上複製的圖片；也可拖曳檔案。",
    listStatus: "上架狀態",
    active: "上架中",
    hidden: "隱藏",
    update: "更新商品",
    create: "上架",
    cancel: "取消",
    markPaid: "已收到付款（待出貨）",
    markShip: "確認出貨",
    markDone: "訂單完成",
    payStatus: "付款狀態",
    orderDate: "下單日期",
    sellerMode: "賣家模式",
    listedN: "上架商品數",
    purchasedN: "已售件數",
    currentMode: "目前模式",
    amountDue: "應付金額",
    none: "目前沒有。",
    sellerTitle: "賣家儀表板：銷售與帳務",
    sellerNote: "賣家只能編輯、隱藏或下架自己上傳的商品，也只能處理自己賣出的訂單。賣掉一筆訂單平台抽成 NT$4，運費 NT$60。",
    rev: "本月實收（已扣抽成）",
    completedN: "完成訂單數",
    pendingPay: "待付款",
    waitShip: "待出貨",
    manage: "賣家訂單管理",
    pendingPayItems: "待付款",
    pendingShipItems: "待出貨",
    completedHist: "已完成訂單（銷售歷史）",
    finance: "財務管理（月報）",
    filterMonth: "依月份篩選",
    allMonths: "全部月份",
    exportCsv: "匯出 CSV",
    soldThis: "本月售出件數",
    revThis: "本月實收",
    feesThis: "本月抽成",
    shipThis: "本月運費",
    listingTitle: "上架／編輯商品（僅限自己上傳）",
    inventory: "庫存",
    invNote: "可售庫存＝目前庫存 − 已售數量。只能改自己上架的庫存。",
    purchased: "已售",
    edit: "編輯",
    show: "顯示",
    hide: "隱藏",
    unlist: "下架",
    noOwn: "尚未上架自己的商品。",
    adminTitle: "平台管理員：交易管理",
    adminLead: "平台管理員可查看所有交易金額、抽成與訂單明細。監看不代表代為編輯訂單。",
    allTx: "全部平台交易",
    feeSetting: "每筆交易抽成（TWD）",
    saveFee: "儲存抽成",
    feeSaved: "已儲存平台抽成。",
    twd: "元",
    txCount: "交易筆數",
    txAmount: "交易總額",
    txFees: "抽成總額",
    lastUpdated: "最後更新",
    totalDue: "應付總額",
    searchPh: "以訂單編號搜尋",
    allStatus: "全部狀態",
    incomplete: "未完成／異常",
    adminNote: "管理員監看交易與歷史，不代替賣家確認付款或出貨。",
    signInFirst: "請先登入後再進入此區。",
    signIn: "登入",
    added: "已加入購物車。",
    created: "已建立訂單",
    sellerNotified: "，賣家已收到通知。",
    confirmDel: "確定下架此商品？",
    needCheckout: "結帳"
  } : {
    buyer: "Store",
    cart: "Cart",
    orders: "My orders",
    seller: "Seller",
    admin: "Platform admin",
    adminOnly: "Only the platform admin can monitor transactions.",
    stock: "Available stock",
    browse: "Browse listings",
    details: "Details",
    addCart: "Add to cart",
    noListings: "No active listings.",
    notFound: "Listing not found.",
    back: "Back to browse",
    buyerNoInv: "Buyers cannot manage inventory.",
    qty: "Quantity",
    cartTitle: "Shopping cart",
    product: "Product",
    price: "Price",
    qtyCol: "Qty",
    remove: "Remove",
    total: "Total",
    subtotal: "Subtotal",
    shipping: "Shipping",
    fee: "Platform fee",
    sellerNet: "Seller net",
    feeNote: "Each order has a NT$4 platform fee. Shipping is NT$60, paid by the buyer.",
    checkout: "Check out",
    emptyCart: "Your cart is empty.",
    noOrders: "No orders.",
    orderId: "Order ID",
    date: "Date",
    buyerCol: "Buyer",
    sellerCol: "Seller",
    items: "Items",
    amount: "Amount",
    status: "Status",
    kept: "Completed record kept; do not delete",
    buyerOrders: "Buyer order history",
    buyerHistNote: "Completed transactions stay in buyer order history and must not be deleted.",
    lifecycle: "Order Placed → Waiting for Payment Confirmation → Payment Confirmed → Ready to Ship → Shipped → Completed",
    lifecycleTitle: "Order lifecycle",
    placed: "Order Placed",
    payConfirmed: "Payment Confirmed",
    keepRecords: "Do not delete completed transactions. Keep them as business records.",
    name: "Product name",
    nameZh: "Chinese product name",
    nameEn: "English product name",
    autoFromEn: "Auto-translate from English (editable)",
    autoFromZh: "Auto-translate from Chinese (editable)",
    translateNote: "Fill in Chinese or English; the other language is auto-translated and stays editable.",
    category: "Category",
    desc: "Description",
    descZh: "Chinese description",
    descEn: "English description",
    listPrice: "Price",
    listQty: "Quantity",
    image: "Product photo",
    chooseFile: "Choose file",
    dropHint: "Drag a photo here, or click this box and paste (Ctrl/Cmd+V or right-click Paste).",
    pasteHint: "Click the photo box, then paste a copied image. You can also drop a file.",
    listStatus: "Listing status",
    active: "Active",
    hidden: "Hidden",
    update: "Update listing",
    create: "Create listing",
    cancel: "Cancel",
    markPaid: "Payment Received (Awaiting Shipment)",
    markShip: "Confirm shipment",
    markDone: "Order Completed",
    payStatus: "Payment status",
    orderDate: "Order date",
    sellerMode: "Seller Mode",
    listedN: "Number of listed products",
    purchasedN: "Number of purchased items",
    currentMode: "Current mode",
    amountDue: "Amount due",
    lastUpdated: "Last updated",
    none: "None.",
    sellerTitle: "Seller dashboard: sales and accounting",
    sellerNote: "Sellers can edit, hide, or remove only listings they uploaded, and can process only their own sales. Each sale takes a NT$4 platform fee; shipping is NT$60.",
    rev: "Monthly net (after fee)",
    completedN: "Completed orders",
    pendingPay: "Pending payments",
    waitShip: "Waiting for shipment",
    manage: "Seller order management",
    pendingPayItems: "Pending Payments",
    pendingShipItems: "Pending Shipments",
    completedHist: "Completed Orders (sales history)",
    finance: "Financial management (monthly report)",
    filterMonth: "Filter by month",
    allMonths: "All months",
    exportCsv: "Export CSV",
    soldThis: "items sold this month",
    revThis: "Net this month",
    feesThis: "Fees this month",
    shipThis: "Shipping this month",
    listingTitle: "Create / edit listing (your uploads only)",
    inventory: "Inventory",
    invNote: "Available stock = current inventory − purchased quantity. You can change inventory only on your own listings.",
    purchased: "Purchased",
    edit: "Edit",
    show: "Show",
    hide: "Hide",
    unlist: "Remove",
    noOwn: "You have not uploaded a listing yet.",
    adminTitle: "Platform admin: transaction management",
    adminLead: "The super admin can view all transaction amounts, platform fees, and order details. Monitoring does not always mean editing.",
    allTx: "All platform transactions",
    feeSetting: "Platform transaction fee setting (per transaction)",
    saveFee: "Save platform fee",
    feeSaved: "Platform fee saved.",
    twd: "TWD",
    txCount: "Number of transactions",
    txAmount: "Total transaction amount",
    txFees: "Total platform transaction fees",
    lastUpdated: "Last updated",
    totalDue: "Total due",
    searchPh: "Search by order ID",
    allStatus: "All statuses",
    incomplete: "Incomplete / abnormal",
    adminNote: "Monitoring does not always mean editing. Admins review transactions and history; they do not confirm payment or shipment for sellers.",
    signInFirst: "Please sign in to open this view.",
    signIn: "Sign in",
    added: "Added to cart.",
    created: "Order created",
    sellerNotified: ". The seller has been notified.",
    confirmDel: "Remove this listing?",
    needCheckout: "check out"
  };

  let view = (location.hash || "#browse").replace("#", "") || "browse";
  let editing = null;
  let listingMemory = null;
  let listingImageUrl = "";
  let listingPasteBound = false;
  let skipDraftCapture = false;
  let adminQuery = "";
  let adminStatus = "";
  let adminIncomplete = false;
  let sellerMonth = new Date().toISOString().slice(0, 7);

  function money(n) {
    return "NT$ " + Number(n || 0).toLocaleString();
  }

  function statusText(id) {
    const row = S.STATUS_LABEL[id];
    return row ? (zh ? row.zh : row.en) : id;
  }

  function catText(id) {
    const row = S.CATEGORY_LABEL[id];
    return row ? (zh ? row.zh : row.en) : id;
  }

  function stamp(o) {
    return (o.updatedAt || o.createdAt || "").replace("T", " ").slice(0, 16);
  }

  function lifecycleHtml() {
    const steps = [L.placed, statusText("waiting_payment"), L.payConfirmed, statusText("ready_to_ship"), statusText("shipped"), statusText("completed")];
    return `<div class="market-life">
      <h3>${L.lifecycleTitle}</h3>
      <ol class="market-lifecycle">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>
      <p class="market-callout">${L.keepRecords}</p>
    </div>`;
  }

  function go(next) {
    view = next;
    location.hash = next;
    render();
  }

  function loginHref() {
    const next = "market.html" + (location.hash && location.hash !== "#browse" ? location.hash : "");
    return "login.html?next=" + encodeURIComponent(next);
  }

  function needUser(action) {
    if (S.me()) return true;
    alert(zh ? "請先登入才能" + action : "Please sign in to " + action);
    location.href = loginHref();
    return false;
  }

  function isBuyerView() {
    return view === "browse" || view === "cart" || view === "orders" || String(view).startsWith("product-");
  }

  function roleBar() {
    const tabs = [
      ["browse", L.buyer],
      ["seller", L.seller],
      ["admin", L.admin]
    ];
    const buyerOn = isBuyerView();
    const buyerTools = buyerOn ? `
      <div class="market-buyer-tools">
        <button type="button" class="market-role${view === "browse" || String(view).startsWith("product-") ? " is-on" : ""}" data-view="browse">${L.browse}</button>
        <button type="button" class="market-role${view === "cart" ? " is-on" : ""}" data-view="cart">${L.cart}</button>
        <button type="button" class="market-role${view === "orders" ? " is-on" : ""}" data-view="orders">${L.orders}</button>
      </div>` : "";
    return `
      <div class="market-roles">
        ${tabs.map(([id, label]) => {
          const on = id === "browse" ? buyerOn : view === id;
          return `<button type="button" class="market-role${on ? " is-on" : ""}" data-view="${id}">${label}</button>`;
        }).join("")}
      </div>
      ${buyerTools}
    `;
  }

  function productImg(url) {
    const src = (url || "").trim();
    if (!src) return "";
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("data:")) return src;
    return (zh ? "" : "../") + src.replace(/^\.\.\//, "");
  }

  function productCard(p, extra) {
    const stock = S.availableStock(p);
    return `
      <article class="card market-card">
        ${p.imageUrl ? `<img src="${productImg(p.imageUrl)}" alt="">` : ""}
        <p class="kicker">${catText(p.category)}</p>
        <h3>${S.productName(p)}</h3>
        <p>${S.productDesc(p)}</p>
        <p><strong>${money(p.price)}</strong> · ${L.stock}: ${stock}</p>
        ${extra || ""}
      </article>
    `;
  }

  function addCartControls(p, withQty) {
    const stock = S.availableStock(p);
    return `
      ${withQty ? `<label class="market-qty">${L.qty}
        <input id="buyQty" type="number" min="1" max="${Math.max(1, stock)}" value="1" ${stock ? "" : "disabled"}>
      </label>` : ""}
      <p class="market-card-actions">
        <button type="button" class="btn btn-navy" data-add="${p.id}" ${stock ? "" : "disabled"}>${L.addCart}</button>
      </p>
    `;
  }

  function browse() {
    const list = S.catalog();
    return `
      <h2>${L.browse}</h2>
      <div class="cards">${list.map((p) => productCard(p, `
        <p class="market-card-actions">
          <button type="button" class="btn btn-line" data-open="${p.id}">${L.details}</button>
          <button type="button" class="btn btn-navy" data-add="${p.id}" data-qty="1" ${S.availableStock(p) ? "" : "disabled"}>${L.addCart}</button>
        </p>
      `)).join("") || `<p>${L.noListings}</p>`}</div>
    `;
  }

  function productView(id) {
    const p = S.product(id);
    if (!p) return `<p>${L.notFound}</p>`;
    return `
      <p><button type="button" class="btn btn-line" data-view="browse">${L.back}</button></p>
      <h2>${L.details}</h2>
      ${productCard(p, `
        <p>${L.buyerNoInv}</p>
        ${addCartControls(p, true)}
      `)}
    `;
  }

  function cartView() {
    const lines = S.cart().map((line) => {
      const p = S.product(line.productId);
      return p ? { ...line, product: p } : null;
    }).filter(Boolean);
    const subtotal = lines.reduce((s, l) => s + Number(l.product.price) * Number(l.quantity), 0);
    const bill = S.totalsFromSubtotal(subtotal);
    return `
      <h2>${L.cartTitle}</h2>
      ${lines.length ? `
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>${L.product}</th><th>${L.price}</th><th>${L.qtyCol}</th><th></th></tr></thead>
          <tbody>${lines.map((l) => `<tr>
            <td>${S.productName(l.product)}<br><small>${L.stock} ${S.availableStock(l.product)}</small></td>
            <td>${money(l.product.price)}</td>
            <td><input type="number" min="1" value="${l.quantity}" data-qty="${l.productId}"></td>
            <td><button type="button" class="btn btn-line" data-remove="${l.productId}">${L.remove}</button></td>
          </tr>`).join("")}</tbody>
        </table></div>
        <p>${L.subtotal} ${money(bill.subtotal)}</p>
        <p>${L.shipping} ${money(bill.shipping)}</p>
        <p class="market-note">${zh ? `每筆訂單平台抽成 NT$${S.platformFee()}，運費 NT$60（由買家支付）。` : `Each order has a NT$${S.platformFee()} platform fee. Shipping is NT$60, paid by the buyer.`}</p>
        <p><strong>${L.total} ${money(bill.total)}</strong></p>
        <p><button type="button" class="btn btn-navy" id="checkoutBtn">${L.checkout}</button></p>
      ` : `<p>${L.emptyCart}</p>`}
    `;
  }

  function orderTable(rows, seller) {
    if (!rows.length) return `<p>${L.noOrders}</p>`;
    return `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr>
        <th>${L.orderId}</th><th>${L.date}</th>
        <th>${seller ? L.buyerCol : L.sellerCol}</th>
        <th>${L.items}</th><th>${L.amount}</th><th>${L.status}</th>${seller ? "<th></th>" : ""}
      </tr></thead>
      <tbody>${rows.map((o) => {
        const next = S.STATUSES[S.STATUSES.indexOf(o.status) + 1];
        const nextLabel = next === "ready_to_ship" ? L.markPaid : next === "shipped" ? L.markShip : next === "completed" ? L.markDone : "";
        return `<tr>
          <td>${o.orderNo}</td>
          <td>${(o.createdAt || "").slice(0, 10)}</td>
          <td>${seller ? o.buyerEmail : o.sellerEmail}</td>
          <td>${(o.items || []).map((i) => `${S.itemName(i)} × ${i.quantity}`).join("<br>")}</td>
          <td>${money(seller ? S.orderMoney(o).sellerNet : S.orderMoney(o).total)}</td>
          <td>${statusText(o.status)}</td>
          ${seller ? `<td>${next ? `<button type="button" class="btn btn-line" data-advance="${o.id}" data-next="${next}">${nextLabel}</button>` : L.kept}</td>` : ""}
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function ordersView() {
    const rows = S.mine("buyer");
    return `
      <h2>${L.buyerOrders}</h2>
      ${lifecycleHtml()}
      <p class="market-note">${L.buyerHistNote}</p>
      ${orderTable(rows, false)}
    `;
  }

  function attr(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

  function draftKey() {
    const u = S.me();
    return "immba-listing-draft:" + ((u && u.email) || "guest");
  }

  function emptyListing() {
    return {
      id: "",
      name: "",
      nameZh: "",
      nameEn: "",
      category: "Textbook",
      description: "",
      descriptionZh: "",
      descriptionEn: "",
      nameZhAuto: false,
      nameEnAuto: false,
      descriptionZhAuto: false,
      descriptionEnAuto: false,
      price: "",
      quantity: "",
      imageUrl: "",
      status: "active"
    };
  }

  function coerceListingRow(row) {
    const base = emptyListing();
    if (!row) return base;
    const name = String(row.name || "").trim();
    const desc = String(row.description || "").trim();
    let nameZh = String(row.nameZh || "").trim();
    let nameEn = String(row.nameEn || "").trim();
    let descriptionZh = String(row.descriptionZh || "").trim();
    let descriptionEn = String(row.descriptionEn || "").trim();
    if (name && !nameZh && !nameEn) {
      if (/[\u3400-\u9fff]/.test(name)) nameZh = name;
      else nameEn = name;
    }
    if (desc && !descriptionZh && !descriptionEn) {
      if (/[\u3400-\u9fff]/.test(desc)) descriptionZh = desc;
      else descriptionEn = desc;
    }
    return {
      ...base,
      ...row,
      nameZh,
      nameEn,
      descriptionZh,
      descriptionEn
    };
  }

  function fieldAuto(id) {
    const el = document.getElementById(id);
    return !!(el && el.dataset.auto === "1");
  }

  function readListingForm() {
    const form = document.getElementById("listingForm");
    if (!form) return null;
    const fd = new FormData(form);
    return {
      id: fd.get("id") || "",
      nameZh: fd.get("nameZh") || "",
      nameEn: fd.get("nameEn") || "",
      category: fd.get("category") || "Textbook",
      descriptionZh: fd.get("descriptionZh") || "",
      descriptionEn: fd.get("descriptionEn") || "",
      nameZhAuto: fieldAuto("listingNameZh"),
      nameEnAuto: fieldAuto("listingNameEn"),
      descriptionZhAuto: fieldAuto("listingDescZh"),
      descriptionEnAuto: fieldAuto("listingDescEn"),
      price: fd.get("price") || "",
      quantity: fd.get("quantity") || "",
      imageUrl: fd.get("imageUrl") || "",
      status: fd.get("status") || "active"
    };
  }

  function saveListingDraft(data) {
    const row = data || readListingForm();
    if (!row) return;
    if (listingImageUrl) row.imageUrl = listingImageUrl;
    listingMemory = row;
    const key = draftKey();
    try {
      localStorage.setItem(key, JSON.stringify(row));
    } catch (err) {
      try {
        localStorage.setItem(key, JSON.stringify({ ...row, imageUrl: "" }));
      } catch (e2) {}
    }
  }

  function loadListingDraft() {
    try {
      const raw = localStorage.getItem(draftKey());
      if (raw) return JSON.parse(raw);
    } catch (err) {}
    return listingMemory;
  }

  function clearListingDraft() {
    listingMemory = null;
    listingImageUrl = "";
    try { localStorage.removeItem(draftKey()); } catch (err) {}
  }

  function listingFormState() {
    const draft = loadListingDraft();
    let row;
    if (editing && editing.id) {
      row = (draft && String(draft.id) === String(editing.id)) ? { ...editing, ...draft } : { ...editing };
    } else {
      row = draft ? { ...draft } : emptyListing();
    }
    row = coerceListingRow(row);
    if (listingImageUrl) row.imageUrl = listingImageUrl;
    else if (row.imageUrl) listingImageUrl = row.imageUrl;
    return row;
  }

  function listingDropInner(src) {
    return src
      ? `<img src="${attr(src)}" alt="" draggable="false">`
      : `<strong>${L.image}</strong><span>${L.dropHint}</span>`;
  }

  function sellerForm(p) {
    p = coerceListingRow(p || emptyListing());
    const src = productImg(p.imageUrl);
    const storedUrl = (p.imageUrl || "").indexOf("data:") === 0 ? "" : attr(p.imageUrl);
    const auto = (on) => (on ? "1" : "0");
    const text = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    return `
      <form id="listingForm" class="market-form">
        <input type="hidden" name="id" value="${attr(p.id)}">
        <input type="hidden" name="imageUrl" value="${storedUrl}">
        <p class="market-note">${L.translateNote}</p>
        <div class="market-bilingual">
          <div>
            <label>${L.nameZh}<input id="listingNameZh" name="nameZh" value="${attr(p.nameZh)}" data-auto="${auto(p.nameZhAuto)}"></label>
            <button type="button" class="btn btn-line" id="btnAutoZhName">${L.autoFromEn}</button>
            <label>${L.descZh}<textarea id="listingDescZh" name="descriptionZh" data-auto="${auto(p.descriptionZhAuto)}">${text(p.descriptionZh)}</textarea></label>
            <button type="button" class="btn btn-line" id="btnAutoZhDesc">${L.autoFromEn}</button>
          </div>
          <div>
            <label>${L.nameEn}<input id="listingNameEn" name="nameEn" value="${attr(p.nameEn)}" data-auto="${auto(p.nameEnAuto)}"></label>
            <button type="button" class="btn btn-line" id="btnAutoEnName">${L.autoFromZh}</button>
            <label>${L.descEn}<textarea id="listingDescEn" name="descriptionEn" data-auto="${auto(p.descriptionEnAuto)}">${text(p.descriptionEn)}</textarea></label>
            <button type="button" class="btn btn-line" id="btnAutoEnDesc">${L.autoFromZh}</button>
          </div>
        </div>
        <label class="market-span">${L.category}
          <select name="category">${S.CATEGORIES.map((c) => `<option value="${c}"${c === p.category ? " selected" : ""}>${catText(c)}</option>`).join("")}</select>
        </label>
        <label>${L.listPrice}<input name="price" type="number" min="0" step="1" required value="${attr(p.price)}"></label>
        <label>${L.listQty}<input name="quantity" type="number" min="0" step="1" required value="${attr(p.quantity)}"></label>
        <div class="market-photo">
          <div class="market-drop${src ? " has-photo" : ""}" id="listingDrop" tabindex="0" contenteditable="true" spellcheck="false" aria-label="${attr(L.image)}">
            ${listingDropInner(src)}
          </div>
          <div class="market-photo-tools">
            <label class="btn btn-navy market-file-btn">${L.chooseFile}<input id="listingFile" type="file" accept="image/*"></label>
            <span>${L.pasteHint}</span>
          </div>
        </div>
        <label>${L.listStatus}
          <select name="status">
            <option value="active"${p.status !== "hidden" ? " selected" : ""}>${L.active}</option>
            <option value="hidden"${p.status === "hidden" ? " selected" : ""}>${L.hidden}</option>
          </select>
        </label>
        <p><button class="btn btn-navy" type="submit">${p.id ? L.update : L.create}</button>
        ${p.id ? `<button class="btn btn-line" type="button" id="cancelEdit">${L.cancel}</button>` : ""}</p>
      </form>
    `;
  }

  function sellerActionLabel(status) {
    if (status === "waiting_payment") return L.markPaid;
    if (status === "ready_to_ship") return L.markShip;
    if (status === "shipped") return L.markDone;
    return "";
  }

  function sellerOrderCard(o) {
    const next = S.STATUSES[S.STATUSES.indexOf(o.status) + 1];
    const names = (o.items || []).map((i) => S.itemName(i) + (i.quantity > 1 ? " × " + i.quantity : "")).join(" · ");
    const m = S.orderMoney(o);
    return `<article class="market-order">
      <p><strong>${names}</strong></p>
      <p>${L.orderId}: ${o.orderNo}</p>
      <p>${L.buyerCol}: ${o.buyerEmail}</p>
      <p>${L.orderDate}: ${(o.createdAt || "").replace("T", " ").slice(0, 16)}</p>
      <p>${L.lastUpdated}: ${stamp(o)}</p>
      <p>${L.payStatus}: ${statusText(o.status)}</p>
      <p>${L.total}: ${money(m.total)}</p>
      ${next ? `<p><button type="button" class="btn btn-navy market-action" data-advance="${o.id}" data-next="${next}">${sellerActionLabel(o.status)}</button></p>` : `<p class="market-note">${L.kept}</p>`}
    </article>`;
  }

  function sellerPanel(title, rows) {
    return `<article class="market-panel">
      <h3>${title}</h3>
      ${rows.length ? rows.map(sellerOrderCard).join("") : `<p class="market-note">${L.none}</p>`}
    </article>`;
  }

  function sellerView() {
    const dash = S.dashboard(sellerMonth);
    const products = S.sellerProducts();
    const mine = S.mine("seller");
    const pendingPay = mine.filter((o) => o.status === "waiting_payment");
    const pendingShip = mine.filter((o) => o.status === "ready_to_ship" || o.status === "shipped");
    const completed = mine.filter((o) => o.status === "completed");
    const months = S.sellerMonths();
    const period = sellerMonth ? sellerMonth.replace("-", "/") : L.allMonths;
    return `
      <h2>${L.sellerTitle}</h2>
      <p class="market-note">${L.sellerNote}</p>
      <section class="market-listing">
        <h3>${L.listingTitle}</h3>
        ${sellerForm(listingFormState())}
      </section>
      ${lifecycleHtml()}
      <div class="stats market-stats">
        <div><strong>${dash.listedCount}</strong><span>${L.listedN}</span></div>
        <div><strong>${dash.purchasedCount}</strong><span>${L.purchasedN}</span></div>
        <div><strong>${L.sellerMode}</strong><span>${L.currentMode}</span></div>
      </div>
      <section class="market-manage">
        <h3>${L.manage}</h3>
        ${sellerPanel(L.pendingPayItems, pendingPay)}
        ${sellerPanel(L.pendingShipItems, pendingShip)}
        ${sellerPanel(L.completedHist, completed)}
      </section>
      <section class="market-finance">
        <div class="market-finance-bar">
          <h3>${L.finance}</h3>
          <label>${L.filterMonth}
            <select id="sellerMonth">
              <option value="">${L.allMonths}</option>
              ${months.map((m) => `<option value="${m}"${m === sellerMonth ? " selected" : ""}>${m.replace("-", "/")}</option>`).join("")}
            </select>
          </label>
          <button type="button" class="btn btn-navy" id="exportSeller">${L.exportCsv}</button>
        </div>
        <p class="market-finance-sum"><strong>${period}</strong> · ${dash.itemsSold} ${L.soldThis} · ${L.revThis}: <strong>${money(dash.monthlyRevenue)}</strong> · ${L.feesThis} ${money(dash.monthlyFees)} · ${L.shipThis} ${money(dash.monthlyShipping)}</p>
      </section>
      <h3>${L.inventory}</h3>
      <p>${L.invNote}</p>
      <div class="admin-table-wrap"><table class="admin-table">
        <thead><tr><th>${L.product}</th><th>${L.status}</th><th>${L.inventory}</th><th>${L.purchased}</th><th>${L.stock}</th><th></th></tr></thead>
        <tbody>${products.map((p) => {
          const purchased = Number(p.quantity) - S.availableStock(p);
          return `<tr>
            <td>${S.productName(p)}<br><small>${catText(p.category)} · ${money(p.price)}</small></td>
            <td>${p.status === "hidden" ? L.hidden : L.active}</td>
            <td>${p.quantity}</td>
            <td>${purchased}</td>
            <td>${S.availableStock(p)}</td>
            <td>
              <button type="button" class="btn btn-line" data-edit="${p.id}">${L.edit}</button>
              <button type="button" class="btn btn-line" data-hide="${p.id}">${p.status === "hidden" ? L.show : L.hide}</button>
              <button type="button" class="btn btn-line" data-del="${p.id}">${L.unlist}</button>
            </td>
          </tr>`;
        }).join("") || `<tr><td colspan="6">${L.noOwn}</td></tr>`}</tbody>
      </table></div>
    `;
  }

  function adminTxCard(o) {
    const m = S.orderMoney(o);
    const names = (o.items || []).map((i) => S.itemName(i) + (i.quantity > 1 ? " × " + i.quantity : "")).join(" · ");
    return `<article class="market-tx">
      <p><strong>${L.orderId}</strong> ${o.orderNo}</p>
      <p>${L.lastUpdated}: ${stamp(o)}</p>
      <p>${names}</p>
      <p>${L.buyerCol}: ${o.buyerEmail} · ${L.sellerCol}: ${o.sellerEmail}</p>
      <p>${L.status}: ${statusText(o.status)}</p>
      <p>${L.subtotal}: ${money(m.subtotal)}</p>
      <p>${L.shipping}: ${money(m.shipping)}</p>
      <p>${L.fee}: ${money(m.fee)}</p>
      <p><strong>${L.totalDue}: ${money(m.total)}</strong></p>
    </article>`;
  }

  function adminView() {
    let rows = S.orders();
    if (adminStatus) rows = rows.filter((o) => o.status === adminStatus);
    if (adminIncomplete) rows = rows.filter((o) => o.status !== "completed");
    if (adminQuery) {
      const q = adminQuery.toLowerCase();
      rows = rows.filter((o) => (o.orderNo || "").toLowerCase().includes(q) || (o.id || "").toLowerCase().includes(q) || (o.buyerEmail || "").toLowerCase().includes(q) || (o.sellerEmail || "").toLowerCase().includes(q));
    }
    const amount = rows.reduce((s, o) => s + Number(S.orderMoney(o).total || 0), 0);
    const fees = rows.reduce((s, o) => s + Number(S.orderMoney(o).fee || 0), 0);
    return `
      <h2>${L.adminTitle}</h2>
      <p class="market-note">${L.adminLead}</p>
      <p class="market-callout">${L.adminNote} ${L.keepRecords}</p>
      <section class="market-panel">
        <h3>${L.allTx}</h3>
        <form id="feeForm" class="market-fee-form">
          <label>${L.feeSetting}
            <span>
              <input id="platformFeeInput" name="platformFee" type="number" min="0" step="1" value="${S.platformFee()}" required>
              <span>${L.twd}</span>
              <button type="submit" class="btn btn-navy">${L.saveFee}</button>
            </span>
          </label>
        </form>
        <div class="stats market-stats">
          <div><strong>${rows.length}</strong><span>${L.txCount}</span></div>
          <div><strong>${money(amount)}</strong><span>${L.txAmount}</span></div>
          <div><strong>${money(fees)}</strong><span>${L.txFees}</span></div>
        </div>
        <div class="market-admin-toolbar">
          <input id="adminQ" type="search" placeholder="${L.searchPh}" value="${adminQuery}">
          <select id="adminStatus">
            <option value="">${L.allStatus}</option>
            ${S.STATUSES.map((s) => `<option value="${s}"${s === adminStatus ? " selected" : ""}>${statusText(s)}</option>`).join("")}
          </select>
          <label class="market-check"><input type="checkbox" id="adminIncomplete"${adminIncomplete ? " checked" : ""}> ${L.incomplete}</label>
          <button type="button" class="btn btn-navy" id="exportAdmin">CSV</button>
        </div>
        ${rows.length ? rows.map(adminTxCard).join("") : `<p class="market-note">${L.noOrders}</p>`}
      </section>
    `;
  }

  function body() {
    if (view === "cart") return cartView();
    if (view === "orders") return ordersView();
    if (view === "seller") return sellerView();
    if (view === "admin") return adminView();
    if (view.startsWith("product-")) return productView(view.slice(8));
    return browse();
  }

  function render() {
    if (!skipDraftCapture) saveListingDraft();
    skipDraftCapture = false;
    if (view === "admin" && !S.isPlatformAdmin()) {
      root.innerHTML = roleBar() + `<p class="market-note">${L.adminOnly} ${S.me() ? "" : `<a href="${loginHref()}">${L.signIn}</a>`}</p>`;
      return;
    }
    if ((view === "seller" || view === "orders") && !S.me()) {
      root.innerHTML = roleBar() + `<p class="market-note">${L.signInFirst} <a href="${loginHref()}">${L.signIn}</a></p>`;
      return;
    }
    root.innerHTML = roleBar() + body();
    bindListingMedia();
    bindListingTranslate();
  }

  async function autoFill(sourceId, targetId, to) {
    const source = document.getElementById(sourceId);
    const target = document.getElementById(targetId);
    if (!source || !target || !window.IMMBATranslate) return "";
    const text = source.value.trim();
    if (!text) return "";
    if (target.value.trim() && target.dataset.auto !== "1") return target.value.trim();
    target.dataset.pending = "1";
    const out = await window.IMMBATranslate.translate(text, to);
    if (target.dataset.pending !== "1") return target.value.trim();
    if (out) {
      target.value = out;
      target.dataset.auto = "1";
      saveListingDraft();
    }
    target.dataset.pending = "0";
    return out || "";
  }

  async function fillMissingTranslations() {
    const pairs = [
      ["listingNameZh", "listingNameEn", "en"],
      ["listingNameEn", "listingNameZh", "zh"],
      ["listingDescZh", "listingDescEn", "en"],
      ["listingDescEn", "listingDescZh", "zh"]
    ];
    for (const [sourceId, targetId, to] of pairs) {
      const source = document.getElementById(sourceId);
      const target = document.getElementById(targetId);
      if (!source || !target || !source.value.trim()) continue;
      if (!target.value.trim() || target.dataset.auto === "1") {
        const out = await autoFill(sourceId, targetId, to);
        if (!out && (!target.value.trim() || target.dataset.auto === "1")) {
          target.value = source.value.trim();
          target.dataset.auto = "1";
        }
      }
    }
  }

  function bindListingTranslate() {
    const nameZh = document.getElementById("listingNameZh");
    const nameEn = document.getElementById("listingNameEn");
    const descZh = document.getElementById("listingDescZh");
    const descEn = document.getElementById("listingDescEn");
    if (!nameZh || !nameEn || !descZh || !descEn) return;
    nameZh.addEventListener("blur", () => autoFill("listingNameZh", "listingNameEn", "en"));
    nameEn.addEventListener("blur", () => autoFill("listingNameEn", "listingNameZh", "zh"));
    descZh.addEventListener("blur", () => autoFill("listingDescZh", "listingDescEn", "en"));
    descEn.addEventListener("blur", () => autoFill("listingDescEn", "listingDescZh", "zh"));
    const btnZhName = document.getElementById("btnAutoZhName");
    const btnEnName = document.getElementById("btnAutoEnName");
    const btnZhDesc = document.getElementById("btnAutoZhDesc");
    const btnEnDesc = document.getElementById("btnAutoEnDesc");
    if (btnZhName) btnZhName.addEventListener("click", () => autoFill("listingNameEn", "listingNameZh", "zh"));
    if (btnEnName) btnEnName.addEventListener("click", () => autoFill("listingNameZh", "listingNameEn", "en"));
    if (btnZhDesc) btnZhDesc.addEventListener("click", () => autoFill("listingDescEn", "listingDescZh", "zh"));
    if (btnEnDesc) btnEnDesc.addEventListener("click", () => autoFill("listingDescZh", "listingDescEn", "en"));
  }

  function refreshListingPreview() {
    const form = document.getElementById("listingForm");
    const drop = document.getElementById("listingDrop");
    if (!form || !drop) return;
    const url = listingImageUrl || form.querySelector("[name=imageUrl]").value;
    const src = productImg(url);
    drop.classList.toggle("has-photo", !!src);
    drop.innerHTML = listingDropInner(src);
  }

  async function applyListingFile(file) {
    if (!file || !window.IMMBAImage) return;
    const form = document.getElementById("listingForm");
    if (!form) return;
    try {
      const data = await window.IMMBAImage.fromFile(file, 960, 0.72);
      listingImageUrl = data;
      const field = form.querySelector("[name=imageUrl]");
      if (field) field.value = "";
      refreshListingPreview();
      saveListingDraft();
    } catch (err) {
      alert(zh ? "圖片無法使用，請改選另一張。" : "That image could not be used. Please choose another.");
    }
  }

  async function applyListingPaste(e) {
    if (!document.getElementById("listingForm") || !window.IMMBAImage) return false;
    const drop = document.getElementById("listingDrop");
    const inField = e.target && e.target.closest && e.target.closest("input:not([type=file]), textarea, select");
    const onDrop = !!(drop && (e.target === drop || drop.contains(e.target) || document.activeElement === drop));
    let picked = window.IMMBAImage.fileFromClipboard(e);
    if (picked || onDrop) e.preventDefault();
    if (!picked && !inField && window.IMMBAImage.fromClipboard) {
      picked = await window.IMMBAImage.fromClipboard();
    }
    if (!picked) return false;
    applyListingFile(picked);
    return true;
  }

  function bindListingMedia() {
    const form = document.getElementById("listingForm");
    const drop = document.getElementById("listingDrop");
    const file = document.getElementById("listingFile");
    if (!form || !drop || !file) return;
    drop.addEventListener("click", () => drop.focus());
    drop.addEventListener("keydown", (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && /^[vacVAC]$/.test(e.key)) return;
      if (e.key === "Tab" || e.key === "Escape" || e.key === "Shift") return;
      e.preventDefault();
    });
    drop.addEventListener("beforeinput", (e) => e.preventDefault());
    drop.addEventListener("dragover", (e) => {
      e.preventDefault();
      drop.classList.add("is-over");
    });
    drop.addEventListener("dragleave", () => drop.classList.remove("is-over"));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.classList.remove("is-over");
      const picked = window.IMMBAImage && window.IMMBAImage.fileFromDrop
        ? window.IMMBAImage.fileFromDrop(e)
        : [...(e.dataTransfer.files || [])].find((f) => String(f.type || "").indexOf("image/") === 0);
      applyListingFile(picked);
    });
    drop.addEventListener("paste", (e) => {
      e.stopPropagation();
      applyListingPaste(e);
    });
    file.addEventListener("change", () => {
      applyListingFile(file.files && file.files[0]);
      file.value = "";
    });
    form.addEventListener("input", (e) => {
      if (e.target === drop || (e.target && drop.contains(e.target))) return;
      if (e.target && e.target.dataset.auto !== undefined) e.target.dataset.auto = "0";
      saveListingDraft();
    });
    form.addEventListener("change", () => saveListingDraft());
    if (listingPasteBound) return;
    listingPasteBound = true;
    document.addEventListener("paste", (e) => {
      applyListingPaste(e);
    });
  }

  function downloadCsv(text, name) {
    const blob = new Blob(["\ufeff" + text], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  root.addEventListener("click", (e) => {
    const t = e.target.closest("[data-view], [data-open], [data-add], [data-remove], [data-advance], [data-edit], [data-hide], [data-del], #checkoutBtn, #exportSeller, #exportAdmin, #cancelEdit");
    if (!t) return;
    try {
      if (t.id === "checkoutBtn") {
        if (!needUser(L.needCheckout)) return;
        const orders = S.checkout();
        alert(L.created + " " + orders.map((o) => o.orderNo).join(", ") + L.sellerNotified);
        go("orders");
        return;
      }
      if (t.id === "exportSeller") {
        downloadCsv(S.exportSellerCsv(sellerMonth), "seller-sales.csv");
        return;
      }
      if (t.id === "exportAdmin") {
        downloadCsv(S.exportAdminCsv(), "platform-transactions.csv");
        return;
      }
      if (t.id === "cancelEdit") {
        editing = null;
        clearListingDraft();
        skipDraftCapture = true;
        render();
        return;
      }
      if (t.dataset.view) {
        go(t.dataset.view);
        return;
      }
      if (t.dataset.open) {
        go("product-" + t.dataset.open);
        return;
      }
      if (t.dataset.add) {
        const qtyEl = document.getElementById("buyQty");
        S.addToCart(t.dataset.add, t.dataset.qty || (qtyEl && qtyEl.value) || 1);
        alert(L.added);
        go("cart");
        return;
      }
      if (t.dataset.remove) {
        S.updateCartQty(t.dataset.remove, 0);
        render();
        return;
      }
      if (t.dataset.advance) {
        S.setStatus(t.dataset.advance, t.dataset.next);
        render();
        return;
      }
      if (t.dataset.edit) {
        editing = S.product(t.dataset.edit);
        if (editing) {
          saveListingDraft(coerceListingRow({
            id: editing.id || "",
            name: editing.name || "",
            nameZh: editing.nameZh || "",
            nameEn: editing.nameEn || "",
            category: editing.category || "Textbook",
            description: editing.description || "",
            descriptionZh: editing.descriptionZh || "",
            descriptionEn: editing.descriptionEn || "",
            nameZhAuto: !!editing.nameZhAuto,
            nameEnAuto: !!editing.nameEnAuto,
            descriptionZhAuto: !!editing.descriptionZhAuto,
            descriptionEnAuto: !!editing.descriptionEnAuto,
            price: editing.price,
            quantity: editing.quantity,
            imageUrl: editing.imageUrl || "",
            status: editing.status || "active"
          }));
        }
        skipDraftCapture = true;
        render();
        return;
      }
      if (t.dataset.hide) {
        const p = S.product(t.dataset.hide);
        S.upsertProduct({ ...p, status: p.status === "hidden" ? "active" : "hidden" });
        render();
        return;
      }
      if (t.dataset.del) {
        if (confirm(L.confirmDel)) {
          S.removeProduct(t.dataset.del);
          editing = null;
          render();
        }
      }
    } catch (err) {
      alert(err.message || String(err));
    }
  });

  root.addEventListener("change", (e) => {
    const t = e.target;
    try {
      if (t.dataset.qty) {
        S.updateCartQty(t.dataset.qty, t.value);
        render();
      }
      if (t.id === "adminQ") {
        adminQuery = t.value.trim();
        render();
        const el = document.getElementById("adminQ");
        if (el) { el.focus(); el.setSelectionRange(adminQuery.length, adminQuery.length); }
      }
      if (t.id === "adminStatus") {
        adminStatus = t.value;
        render();
      }
      if (t.id === "adminIncomplete") {
        adminIncomplete = t.checked;
        render();
      }
      if (t.id === "sellerMonth") {
        sellerMonth = t.value;
        render();
      }
    } catch (err) {
      alert(err.message || String(err));
    }
  });

  root.addEventListener("input", (e) => {
    if (e.target.id === "adminQ") adminQuery = e.target.value.trim();
  });

  root.addEventListener("submit", async (e) => {
    if (e.target.id === "feeForm") {
      e.preventDefault();
      try {
        S.setPlatformFee(document.getElementById("platformFeeInput").value);
        alert(L.feeSaved);
        render();
      } catch (err) {
        alert(err.message || String(err));
      }
      return;
    }
    if (e.target.id !== "listingForm") return;
    e.preventDefault();
    try {
      await fillMissingTranslations();
      const row = readListingForm();
      S.upsertProduct({
        ...row,
        name: (row && (row.nameZh || row.nameEn)) || "",
        description: (row && (row.descriptionZh || row.descriptionEn)) || "",
        imageUrl: listingImageUrl || (row && row.imageUrl) || ""
      });
      editing = null;
      clearListingDraft();
      skipDraftCapture = true;
      go("browse");
    } catch (err) {
      alert(err.message || String(err));
    }
  });

  window.addEventListener("hashchange", () => {
    view = (location.hash || "#browse").replace("#", "") || "browse";
    render();
  });
  window.addEventListener("pagehide", () => saveListingDraft());
  window.addEventListener("immba-auth", render);
  window.addEventListener("immba-market", () => {
    skipDraftCapture = true;
    render();
  });
  if (window.IMMBAAuth && window.IMMBAAuth.ready) {
    window.IMMBAAuth.ready.then(render).catch(() => {});
  }

  render();
}
