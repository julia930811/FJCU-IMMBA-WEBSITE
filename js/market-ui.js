function initMarketShelf() {
  const el = document.getElementById("usedBookShelf");
  const S = window.MarketStore;
  if (!el || !S) return;
  const zh = document.documentElement.lang !== "en";
  const prefix = zh ? "" : "../";
  function img(url) {
    const src = String(url || "").trim();
    if (!src) return "";
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("data:")) return src;
    return prefix + src.replace(/^\.\.\//, "");
  }
  function paint() {
    const list = S.catalog();
    const title = zh ? "賣場上架商品" : "Marketplace listings";
    const open = zh ? "看商品" : "View listing";
    if (!list.length) {
      el.innerHTML = `<h2>${title}</h2><p>${zh ? "尚無上架商品。" : "No listings yet."}</p>`;
      return;
    }
    el.innerHTML = `<h2>${title}</h2><div class="cards">${list.map((p) => `
      <article class="card market-card">
        ${p.imageUrl ? `<img src="${img(p.imageUrl)}" alt="">` : ""}
        <p class="kicker">${S.CATEGORY_LABEL[p.category] ? S.CATEGORY_LABEL[p.category][zh ? "zh" : "en"] : p.category}${S.isOwnProduct(p) ? `<span class="market-mine">${zh ? "我的上架" : "Your listing"}</span>` : ""}</p>
        <h3>${S.productName(p)}</h3>
        <p>${S.productDesc(p)}</p>
        <p><strong>NT$${Number(p.price).toLocaleString()}</strong></p>
        <p><a class="btn btn-navy" href="${prefix}market.html#product-${encodeURIComponent(p.id)}">${open}</a></p>
      </article>
    `).join("")}</div>`;
  }
  window.addEventListener("immba-market", paint);
  paint();
  if (S.ready && S.ready.then) S.ready.then(paint).catch(() => paint());
}

function initMarket() {
  const root = document.getElementById("marketRoot");
  if (!root) {
    initMarketShelf();
    return;
  }
  const LISTED_KEY = "immba-just-listed";
  const CART_ADDED_KEY = "immba-cart-added";
  const ORDER_MADE_KEY = "immba-order-made";
  let justListedId = "";
  let cartJustAdded = false;
  let orderJustMade = "";
  try { justListedId = sessionStorage.getItem(LISTED_KEY) || ""; } catch (err) {}
  try { cartJustAdded = sessionStorage.getItem(CART_ADDED_KEY) === "1"; } catch (err) {}
  try { orderJustMade = sessionStorage.getItem(ORDER_MADE_KEY) || ""; } catch (err) {}
  function setCartAdded(on) {
    cartJustAdded = !!on;
    try {
      if (cartJustAdded) sessionStorage.setItem(CART_ADDED_KEY, "1");
      else sessionStorage.removeItem(CART_ADDED_KEY);
    } catch (err) {}
  }
  function setOrderMade(text) {
    orderJustMade = text || "";
    try {
      if (orderJustMade) sessionStorage.setItem(ORDER_MADE_KEY, orderJustMade);
      else sessionStorage.removeItem(ORDER_MADE_KEY);
    } catch (err) {}
  }
  function setJustListed(id) {
    justListedId = id ? String(id) : "";
    try {
      if (justListedId) sessionStorage.setItem(LISTED_KEY, justListedId);
      else sessionStorage.removeItem(LISTED_KEY);
    } catch (err) {}
  }
  const zh = document.documentElement.lang !== "en";
  const S = window.MarketStore;
  const L = zh ? {
    buyer: "買家",
    cart: "購物車",
    orders: "我的訂單",
    seller: "賣家",
    visitor: "訪客",
    visitorMode: "訪客模式",
    visitorModeHint: "未登入是訪客，只能瀏覽公開商品。市集請用「市集登入」，與學校後台登入分開。",
    threeRoles: "市集角色與學校後台角色分開。登入市集後可切換買家／賣家；平台管理員只有 jiayi。",
    buyerFns: "瀏覽商品 · 商品詳情 · 加入購物車 · 下單 · 訂單紀錄",
    sellerFns: "新增商品 · 編輯商品 · 管理庫存 · 確認付款 · 出貨 · 銷售紀錄",
    adminFns: "監看交易 · 管理使用者 · 審視市集活動",
    confirmPay: "確認付款",
    shipOrders: "出貨",
    salesRecords: "銷售紀錄",
    saveStock: "更新庫存",
    stockSaved: "已更新庫存。",
    reviewActivity: "市集活動",
    admin: "平台管理員",
    adminOnly: "只有平台管理員可以監看交易。",
    manageUsers: "管理使用者",
    stock: "可售庫存",
    browse: "瀏覽商品",
    details: "商品詳情",
    addCart: "加入購物車",
    noListings: "尚無上架商品。",
    notFound: "找不到商品。",
    back: "返回賣場",
    buyerNoInv: "買家不能管理庫存。",
    buyerSees: "買家看商品，賣家管商品。",
    buyerBrowseHint: "買家可瀏覽上架商品、看詳情、核對價格與庫存、選擇數量並加入購物車。",
    cartFn: "買家功能：購物車與結帳",
    cartSteps: "加入購物車 → 核對商品 → 確認數量 → 送出訂單",
    cartAdded: "已成功加入購物車。請到「我的訂單」查看付款與出貨狀態。",
    orderFlow: "訂單建立 → 通知賣家",
    crossUser: "一方操作會帶動另一方流程（買家下單後，賣家會收到待確認付款）。",
    proceedCheckout: "送出訂單",
    shipFeeLine: "運費",
    orderTotal: "訂單合計",
    inPerson: "面交（免運）",
    homeDelivery: "寄出（運費 NT$60）",
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
    checkout: "送出訂單",
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
    buyerOrders: "我的訂單",
    buyerHistNote: "已完成的交易會留在買家訂單紀錄、賣家銷售紀錄、平台交易紀錄，不可刪除。",
    myOrders: "我的訂單",
    purchaseHist: "購買紀錄",
    orderStatus: "訂單狀態",
    ordersToProcess: "待處理訂單",
    payToConfirm: "待確認付款",
    productsToShip: "待出貨商品",
    salesHist: "銷售紀錄",
    threeViews: "同一筆交易。不同角色，不同畫面。",
    remainIn: "已完成交易會同時留在：買家訂單紀錄、賣家銷售紀錄、平台交易紀錄。",
    txStatus: "交易狀態",
    txAmountLabel: "交易金額",
    lifecycle: "下單 → 待確認付款 → 付款確認 → 待出貨 → 已出貨 → 已完成",
    lifecycleTitle: "訂單生命週期",
    nowStatus: "目前訂單狀態",
    placed: "下單",
    payConfirmed: "付款確認",
    keepRecords: "已完成的交易不可刪除，必須保留作為商業紀錄。",
    name: "商品名稱",
    nameZh: "中文商品名稱",
    nameEn: "英文商品名稱",
    autoFromEn: "由英文自動翻譯（可再改）",
    autoFromZh: "由中文自動翻譯（可再改）",
    translateNote: "填寫中文或英文即可；另一語會自動翻譯，仍可再改。",
    cloudOk: "商品與照片會寫進雲端，和師資一樣刷新後仍會顯示。",
    cloudFail: "雲端尚未就緒：",
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
    listed: "上架中",
    active: "上架中",
    hidden: "隱藏／下架",
    fn1: "賣家功能 1：上架商品",
    fn2: "賣家功能 2：管理庫存",
    invManage: "庫存管理",
    totalAvail: "可售庫存合計",
    itemsUnit: "件",
    stockFormula: "可售庫存＝目前庫存 − 已售數量",
    availQty: "可售數量",
    lowAlert: "庫存緊張：只剩",
    leftOnly: "只剩",
    statusListed: "狀態：上架中",
    statusHidden: "狀態：已隱藏",
    update: "更新商品",
    create: "上架",
    listedDone: "上架完成",
    listAnother: "再上一件",
    addNew: "新增商品",
    activeListings: "進行中的上架",
    editItem: "編輯商品",
    markSold: "標為已售",
    qtyLeft: "可售數量",
    lowStock: "庫存緊張",
    viewListing: "去瀏覽商品",
    cancel: "取消",
    markPaid: "標為已付款（轉待出貨）",
    markShip: "確認出貨",
    markDone: "標為已完成",
    payToShip: "待確認付款 → 待出貨",
    shipToShipped: "待出貨 → 已出貨",
    shippedToDone: "已出貨 → 已完成",
    sellerPayHint: "買家下單後，賣家會看到訂單編號、買家、商品、金額、付款狀態、下單日期，並執行「確認付款」。",
    sellerShipHint: "確認付款後訂單進入待出貨。備貨後按「確認出貨」：待出貨 → 已出貨。",
    orderLifeNote: "訂單狀態：下單 → 待確認付款 → 付款確認 → 待出貨 → 已出貨 → 已完成",
    payStatus: "付款狀態",
    orderDate: "下單日期",
    sellerMode: "賣家模式",
    listedN: "上架商品數",
    purchasedN: "已售件數",
    currentMode: "目前模式",
    amountDue: "應付金額",
    none: "目前沒有。",
    sellerTitle: "賣家儀表板：銷售與帳務",
    monthlyRev: "本月銷售實收",
    pendingPayN: "待確認付款筆數",
    waitShipN: "待出貨筆數",
    sellerNote: "任何已登入同學都可以上架自己的二手書。只能編輯、隱藏或下架自己上傳的商品，也只能處理自己賣出的訂單。賣掉一筆訂單平台抽成 NT$4，運費 NT$60。",
    rev: "本月實收（已扣抽成）",
    completedN: "完成訂單數",
    pendingPay: "待付款",
    waitShip: "待出貨",
    manage: "賣家訂單管理",
    pendingPayItems: "待確認付款",
    pendingShipItems: "待出貨訂單",
    completedHist: "已完成訂單",
    finance: "財務管理（月報）",
    filterMonth: "依月份篩選",
    allMonths: "全部月份",
    exportCsv: "匯出 CSV",
    soldThis: "本月售出件數",
    revThis: "本月營收",
    feesThis: "本月抽成",
    shipThis: "本月運費",
    listingTitle: "上架商品（名稱、類別、說明、價格、數量、圖片、上架狀態）",
    inventory: "庫存",
    invNote: "可售庫存＝目前庫存 − 已售數量。只能改自己上架的庫存。",
    purchased: "已售",
    edit: "編輯",
    show: "顯示",
    hide: "隱藏",
    unlist: "下架",
    noOwn: "尚未上架自己的商品。",
    adminTitle: "平台管理員：交易管理",
    adminLead: "平台管理員可查看所有交易金額、平台抽成與訂單明細。",
    allTx: "全部平台交易",
    feeSetting: "每筆交易平台抽成設定",
    saveFee: "儲存抽成",
    feeSaved: "已儲存平台抽成。",
    twd: "元",
    txCount: "交易筆數",
    txAmount: "交易總額",
    txFees: "平台抽成總額",
    lastUpdated: "最後更新",
    totalDue: "應付總額",
    searchPh: "以訂單編號搜尋",
    allStatus: "全部狀態",
    incomplete: "未完成／異常交易",
    adminNote: "監看不代表一定會編輯。",
    signInFirst: "請先用市集登入口登入後再進入此區。",
    signIn: "市集登入",
    marketLogout: "市集登出",
    visitorHint: "目前是訪客模式：只能瀏覽公開商品。",
    added: "已加入購物車。",
    created: "已建立訂單",
    sellerNotified: "，賣家已收到通知。",
    confirmDel: "確定下架此商品？",
    needCheckout: "結帳",
    currentRole: "目前模式",
    buyerMode: "買家模式",
    adminMode: "平台管理員模式",
    sellerModeHint: "新增／編輯商品、管理庫存、確認付款、出貨，並查看銷售紀錄。",
    buyerModeHint: "瀏覽商品與詳情、加入購物車、下單，並查看訂單紀錄。",
    adminModeHint: "監看交易、管理使用者、審視市集活動。不代替買家下單或賣家出貨。",
    shipMethod: "取貨方式",
    pickup: "面交（免運）",
    shipOut: "寄出（運費 NT$60）",
    pickupShort: "面交",
    shipShort: "寄出"
  } : {
    buyer: "Buyer",
    cart: "Cart",
    orders: "My orders",
    seller: "Seller",
    visitor: "Visitor",
    visitorMode: "Visitor Mode",
    visitorModeHint: "If you are not signed in, you are a visitor and can only browse public listings. Use Market login, separate from the school website login.",
    threeRoles: "Marketplace roles are separate from school website roles. After market login you can switch Buyer/Seller. Platform Admin is jiayi only.",
    buyerFns: "Browse products · View details · Add to cart · Place orders · View order history",
    sellerFns: "Add products · Edit products · Manage inventory · Confirm payment · Ship orders · View sales records",
    adminFns: "Monitor transactions · Manage users · Review marketplace activities",
    confirmPay: "Confirm payment",
    shipOrders: "Ship orders",
    salesRecords: "Sales records",
    saveStock: "Update Stock",
    stockSaved: "Inventory updated.",
    reviewActivity: "Marketplace activity",
    admin: "Platform admin",
    adminOnly: "Only the platform admin can monitor transactions.",
    manageUsers: "Manage users",
    stock: "Available stock",
    browse: "Browse listings",
    details: "Details",
    addCart: "Add to cart",
    noListings: "No active listings.",
    notFound: "Listing not found.",
    back: "Back to browse",
    buyerNoInv: "Buyers cannot manage inventory.",
    buyerSees: "The buyer sees products. The seller manages products.",
    buyerBrowseHint: "Buyers can browse listings, view details, check price and availability, select quantity, and add items to the cart.",
    cartFn: "Buyer Function: Cart and Checkout",
    cartSteps: "Add to cart → Review items → Confirm quantity → Submit the order",
    cartAdded: "You have successfully added items to your cart. Please open My orders to view payment details and shipment status.",
    orderFlow: "Order created → Seller notified",
    crossUser: "One user action can trigger changes in another user’s workflow.",
    proceedCheckout: "Proceed to Checkout",
    shipFeeLine: "Shipping Fee",
    orderTotal: "Order Total",
    inPerson: "In-Person Pickup (Free)",
    homeDelivery: "Home Delivery (Shipping Fee NT$ 60)",
    qty: "Quantity",
    cartTitle: "Shopping Cart",
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
    checkout: "Proceed to Checkout",
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
    buyerOrders: "My Orders",
    buyerHistNote: "Completed transactions stay in buyer order history, seller sales history, and platform transaction records. Do not delete them.",
    myOrders: "My Orders",
    purchaseHist: "Purchase History",
    orderStatus: "Order Status",
    ordersToProcess: "Orders to Process",
    payToConfirm: "Payments to Confirm",
    productsToShip: "Products to Ship",
    salesHist: "Sales History",
    threeViews: "Same transaction. Different role. Different view.",
    remainIn: "Completed transactions remain in buyer order history, seller sales history, and platform transaction records.",
    txStatus: "Transaction Status",
    txAmountLabel: "Transaction Amount",
    lifecycle: "Order Placed → Waiting for Payment Confirmation → Payment Confirmed → Ready to Ship → Shipped → Completed",
    lifecycleTitle: "Order Lifecycle",
    nowStatus: "Current order status",
    placed: "Order Placed",
    payConfirmed: "Payment Confirmed",
    keepRecords: "Do not delete completed transactions. Keep them as business records.",
    name: "Product name",
    nameZh: "Chinese product name",
    nameEn: "English product name",
    autoFromEn: "Auto-translate from English (editable)",
    autoFromZh: "Auto-translate from Chinese (editable)",
    translateNote: "Fill in Chinese or English; the other language is auto-translated and stays editable.",
    cloudOk: "Listings and photos save to the cloud, like faculty, and stay after refresh.",
    cloudFail: "Cloud is not ready: ",
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
    listStatus: "Listing Status",
    listed: "Listed",
    active: "Listed",
    hidden: "Hidden / remove",
    fn1: "Seller Function 1: List a Product",
    fn2: "Seller Function 2: Manage Inventory",
    invManage: "Inventory Management",
    totalAvail: "Total Available Stock",
    itemsUnit: "items",
    stockFormula: "Available Stock = Current Inventory − Purchased Quantity",
    availQty: "Available Quantity",
    lowAlert: "Low Stock Alert: Only",
    leftOnly: "Only",
    statusListed: "Status: Listed",
    statusHidden: "Status: Hidden",
    update: "Update listing",
    create: "Create listing",
    listedDone: "Listing complete",
    listAnother: "List another",
    addNew: "Add New Item",
    activeListings: "Active Listings",
    editItem: "Edit Item",
    markSold: "Mark as Sold",
    qtyLeft: "Available Quantity",
    lowStock: "Low Stock",
    viewListing: "View in browse",
    cancel: "Cancel",
    markPaid: "Mark as Paid (Move to Pending Shipment)",
    markShip: "Confirm shipment",
    markDone: "Mark Order as Completed",
    payToShip: "Waiting for Payment → Ready to Ship",
    shipToShipped: "Ready to Ship → Shipped",
    shippedToDone: "Shipped → Completed",
    sellerPayHint: "After a buyer places an order, the seller sees Order ID, Buyer, Products, Total amount, Payment status, and Order date, then confirms payment.",
    sellerShipHint: "After payment is confirmed, move the order to Ready to Ship, prepare the product, and confirm shipment: Ready to Ship → Shipped.",
    orderLifeNote: "Order status: Order Placed → Waiting for Payment Confirmation → Payment Confirmed → Ready to Ship → Shipped → Completed",
    payStatus: "Payment status",
    orderDate: "Order date",
    sellerMode: "Seller Mode",
    listedN: "Number of Listed Products",
    purchasedN: "Number of Purchased Items",
    currentMode: "Current Mode",
    amountDue: "Amount due",
    lastUpdated: "Last updated",
    none: "None.",
    sellerTitle: "Seller Dashboard: Sales & Accounting",
    monthlyRev: "Monthly sales revenue",
    pendingPayN: "Pending payments",
    waitShipN: "Orders waiting for shipment",
    sellerNote: "Any signed-in classmate can list their own used books. You can edit, hide, or remove only listings you uploaded, and can process only your own sales. Each sale takes a NT$4 platform fee; shipping is NT$60.",
    rev: "Monthly net (after fee)",
    completedN: "Number of completed orders",
    pendingPay: "Pending payments",
    waitShip: "Orders waiting for shipment",
    manage: "Seller Order Management",
    pendingPayItems: "Pending Payment Items",
    pendingShipItems: "Pending Shipment Items",
    completedHist: "Completed Orders",
    finance: "Financial Management (Monthly Report)",
    filterMonth: "Filter by Month",
    allMonths: "All Months",
    exportCsv: "Export CSV",
    soldThis: "items sold this month",
    revThis: "Revenue This Month",
    feesThis: "Fees this month",
    shipThis: "Shipping this month",
    listingTitle: "List a product (name, category, description, price, quantity, image, listing status)",
    inventory: "Inventory",
    invNote: "Available stock = current inventory − purchased quantity. You can change inventory only on your own listings.",
    purchased: "Purchased",
    edit: "Edit",
    show: "Show",
    hide: "Hide",
    unlist: "Remove",
    noOwn: "You have not uploaded a listing yet.",
    adminTitle: "Platform Admin: Transaction Management",
    adminLead: "Super admin can view all transaction amounts, platform transaction fees, and order details.",
    allTx: "All Platform Transactions",
    feeSetting: "Platform Transaction Fee Setting (Per Transaction)",
    saveFee: "Save Platform Fee",
    feeSaved: "Platform fee saved.",
    twd: "TWD",
    txCount: "Number of Transactions",
    txAmount: "Total Transaction Amount",
    txFees: "Total Platform Transaction Fees",
    lastUpdated: "Last updated",
    totalDue: "Total due",
    searchPh: "Search by order ID",
    allStatus: "All statuses",
    incomplete: "Incomplete / abnormal",
    adminNote: "Monitoring does not always mean editing.",
    signInFirst: "Please use Market login before opening this view.",
    signIn: "Market login",
    marketLogout: "Market logout",
    visitorHint: "You are a visitor: browse public listings only.",
    added: "Added to cart.",
    created: "Order created",
    sellerNotified: ". The seller has been notified.",
    confirmDel: "Remove this listing?",
    needCheckout: "check out",
    currentRole: "Current Role",
    buyerMode: "Buyer Mode",
    adminMode: "Platform Admin Mode",
    sellerModeHint: "Add/edit products, manage inventory, confirm payment, ship orders, and view sales records.",
    buyerModeHint: "Browse products, view details, add to cart, place orders, and view order history.",
    adminModeHint: "Monitor transactions, manage users, and review marketplace activities. Do not buy or ship as admin.",
    shipMethod: "Shipping Method",
    pickup: "In-Person Pickup (Free)",
    shipOut: "Home Delivery (Shipping Fee NT$ 60)",
    pickupShort: "Pickup",
    shipShort: "Ship"
  };

  let view = (location.hash || "#browse").replace("#", "") || "browse";
  let shipMethod = "pickup";
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

  function lifeSteps() {
    return [
      { id: "placed", label: L.placed },
      { id: "waiting_payment", label: statusText("waiting_payment") },
      { id: "pay_confirmed", label: L.payConfirmed },
      { id: "ready_to_ship", label: statusText("ready_to_ship") },
      { id: "shipped", label: statusText("shipped") },
      { id: "completed", label: statusText("completed") }
    ];
  }

  function lifeIndex(status) {
    if (status === "waiting_payment") return 1;
    if (status === "ready_to_ship") return 3;
    if (status === "shipped") return 4;
    if (status === "completed") return 5;
    return 0;
  }

  function lifecycleHtml(orders) {
    const rows = (orders || []).slice();
    if (!rows.length) return "";
    const open = rows.filter((o) => o.status !== "completed");
    const current = (open.length ? open : rows).slice().sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || "")))[0];
    if (!current) return "";
    const idx = lifeIndex(current.status);
    const steps = lifeSteps();
    const nowLabel = steps[idx] ? steps[idx].label : statusText(current.status);
    return `<div class="market-life">
      <h3>${L.lifecycleTitle}</h3>
      <p class="market-note">${L.orderLifeNote}</p>
      <p class="market-life-now">${L.nowStatus}：${nowLabel}${current.orderNo ? " · " + current.orderNo : ""}</p>
      <ol class="market-lifecycle">${steps.map((s, i) => {
        const cls = i < idx ? "is-done" : (i === idx ? "is-on" : "is-wait");
        return `<li class="${cls}">${s.label}</li>`;
      }).join("")}</ol>
    </div>`;
  }

  function threeViewsNote() {
    return "";
  }

  function go(next) {
    view = next;
    location.hash = next;
    render();
  }

  function loginHref(hash) {
    const dest = hash || (location.hash && location.hash !== "#browse" ? location.hash : "");
    const next = "market.html" + dest;
    return (zh ? "" : "../") + "market-login.html?next=" + encodeURIComponent(next);
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

  function modeBox() {
    const loggedIn = !!S.me();
    const sellerOn = loggedIn && view === "seller";
    const adminOn = loggedIn && view === "admin";
    const visitorOn = !loggedIn;
    const buyerOn = loggedIn && !sellerOn && !adminOn;
    const showAdmin = !!(S.isMarketAdmin && S.isMarketAdmin());
    const hint = visitorOn ? L.visitorHint : (adminOn ? L.adminModeHint : (sellerOn ? L.sellerModeHint : L.buyerModeHint));
    const fns = visitorOn ? L.visitorHint : (adminOn ? L.adminFns : (sellerOn ? L.sellerFns : L.buyerFns));
    const mail = loggedIn ? (S.me().email || "") : "";
    return `
      <div class="market-mode-box">
        <p class="market-mode-label">${L.currentRole}</p>
        <div class="market-mode-row">
          ${visitorOn ? `<label class="market-mode-opt"><input type="radio" name="marketMode" data-view="browse" checked> <span>${L.visitorMode}</span></label>` : ""}
          <label class="market-mode-opt"><input type="radio" name="marketMode" ${loggedIn ? `data-view="browse"${buyerOn ? " checked" : ""}` : `data-market-login="#browse"`}> <span>${L.buyerMode}</span></label>
          <label class="market-mode-opt"><input type="radio" name="marketMode" ${loggedIn ? `data-view="seller"${sellerOn ? " checked" : ""}` : `data-market-login="#seller"`}> <span>${L.sellerMode}</span></label>
          ${showAdmin ? `<label class="market-mode-opt"><input type="radio" name="marketMode" data-view="admin"${adminOn ? " checked" : ""}> <span>${L.adminMode}</span></label>` : ""}
        </div>
        ${buyerOn ? "" : `<p class="market-note">${hint}</p>
        <p class="market-note"><strong>${fns}</strong></p>`}
        <p class="market-card-actions">
          ${loggedIn
            ? `<span class="market-note">${mail}${showAdmin ? " · " + L.admin : ""}</span><button type="button" class="btn btn-line" id="marketLogoutBtn">${L.marketLogout}</button>`
            : `<a class="btn btn-navy" href="${loginHref()}">${L.signIn}</a>`}
        </p>
      </div>
    `;
  }

  function buyerTitles() {
    if (!isBuyerView()) return "";
    const onBrowse = view === "browse" || String(view).startsWith("product-");
    return `
      <nav class="market-page-titles">
        <h2 class="market-page-title${onBrowse ? " is-on" : ""}" data-view="browse">${L.browse}</h2>
        <h2 class="market-page-title${view === "cart" ? " is-on" : ""}" data-view="cart">${L.cart}</h2>
        <h2 class="market-page-title${view === "orders" ? " is-on" : ""}" data-view="orders">${L.orders}</h2>
      </nav>
    `;
  }

  function shipLabel(method) {
    return method === "pickup" ? L.pickupShort : L.shipShort;
  }

  function productImg(url) {
    const src = (url || "").trim();
    if (!src) return "";
    if (/^(https?:)?\/\//i.test(src) || src.startsWith("/") || src.startsWith("data:")) return src;
    return (zh ? "" : "../") + src.replace(/^\.\.\//, "");
  }

  function productCard(p, extra) {
    const stock = S.availableStock(p);
    const mine = justListedId && String(p.id) === String(justListedId)
      ? `<span class="market-mine">${L.listedDone}</span>`
      : (S.isOwnProduct(p) ? `<span class="market-mine">${zh ? "我的上架" : "Your listing"}</span>` : "");
    return `
      <article class="card market-card">
        ${p.imageUrl ? `<img src="${productImg(p.imageUrl)}" alt="">` : ""}
        <p class="kicker">${catText(p.category)}${mine}</p>
        <h3>${S.productName(p)}</h3>
        <p>${S.productDesc(p)}</p>
        <p><strong>${money(p.price)}</strong></p>
        <p>${L.availQty}: ${stock}${stock <= 1 && stock > 0 ? ` · ${L.lowStock}` : ""}</p>
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
    let list = S.catalog();
    if (justListedId) {
      const hit = S.product(justListedId);
      if (hit && String(hit.status || "active") !== "hidden") {
        list = [hit].concat(list.filter((p) => String(p.id) !== String(hit.id)));
      }
    }
    const canBuy = !!S.me();
    return `
      ${justListedId ? `<p class="market-listed-done-kicker">${L.listedDone}</p>` : ""}
      ${canBuy ? "" : `<p class="market-note">${L.visitorModeHint} <a href="${loginHref()}">${L.signIn}</a></p>`}
      <div class="cards">${list.map((p) => productCard(p, `
        <p class="market-card-actions">
          <button type="button" class="btn btn-line" data-open="${p.id}">${L.details}</button>
          ${canBuy
            ? (S.isOwnProduct(p)
              ? `<span class="market-note">${L.buyerSees}</span>`
              : `<button type="button" class="btn btn-navy" data-add="${p.id}" data-qty="1" ${S.availableStock(p) ? "" : "disabled"}>${L.addCart}</button>`)
            : `<a class="btn btn-navy" href="${loginHref()}">${L.signIn}</a>`}
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
      <p class="market-note">${L.buyerSees}</p>
      ${productCard(p, `
        ${S.me() ? addCartControls(p, true) : `<p class="market-note">${L.visitorModeHint} <a href="${loginHref()}">${L.signIn}</a></p>`}
      `)}
    `;
  }

  function cartView() {
    const lines = S.cart().map((line) => {
      const p = S.product(line.productId);
      return p ? { ...line, product: p } : null;
    }).filter(Boolean);
    const subtotal = lines.reduce((s, l) => s + Number(l.product.price) * Number(l.quantity), 0);
    const bill = S.totalsFromSubtotal(subtotal, shipMethod);
    return `
      <section class="market-cart-box">
        ${cartJustAdded ? `<p class="market-ok">${L.cartAdded}</p>` : ""}
        <h3>${L.cartTitle}</h3>
        <p class="market-note">${L.cartFn} · ${L.cartSteps}</p>
        ${lines.length ? `
        <ul class="market-cart-list">${lines.map((l) => {
          const img = productImg(l.product.imageUrl);
          return `<li class="market-cart-line">
            ${img ? `<img src="${img}" alt="">` : `<span class="market-cart-ph"></span>`}
            <div>
              <p><strong>${S.productName(l.product)}</strong></p>
              <p>${money(l.product.price)} × ${l.quantity}</p>
            </div>
            <div class="market-cart-tools">
              <div class="market-cart-step">
                <button type="button" data-qty-step="${l.productId}" data-delta="-1" aria-label="-">−</button>
                <span>${l.quantity}</span>
                <button type="button" data-qty-step="${l.productId}" data-delta="1" aria-label="+">+</button>
              </div>
              <button type="button" class="btn btn-line" data-remove="${l.productId}">${L.remove}</button>
            </div>
          </li>`;
        }).join("")}</ul>
        <fieldset class="market-ship">
          <legend>${L.shipMethod}</legend>
          <label><input type="radio" name="shipMethod" value="pickup"${shipMethod === "pickup" ? " checked" : ""}> ${L.pickup}</label>
          <label><input type="radio" name="shipMethod" value="ship"${shipMethod === "ship" ? " checked" : ""}> ${L.shipOut}</label>
        </fieldset>
        <dl class="market-cart-totals">
          <div><dt>${L.subtotal}</dt><dd>${money(bill.subtotal)}</dd></div>
          <div><dt>${L.shipFeeLine}</dt><dd>${money(bill.shipping)}</dd></div>
          <div class="is-total"><dt>${L.orderTotal}</dt><dd>${money(bill.total)}</dd></div>
        </dl>
        <p><button type="button" class="btn btn-navy" id="checkoutBtn">${L.proceedCheckout}</button></p>
        <p class="market-note">${L.orderFlow} · ${L.crossUser}</p>
        ` : `<p>${L.emptyCart}</p>`}
      </section>
    `;
  }

  function orderTable(rows, seller) {
    if (!rows.length) return `<p>${L.noOrders}</p>`;
    return `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr>
        <th>${L.orderId}</th><th>${L.date}</th>
        <th>${seller ? L.buyerCol : L.sellerCol}</th>
        <th>${L.items}</th><th>${L.shipMethod}</th><th>${L.amount}</th><th>${L.status}</th>${seller ? "<th></th>" : ""}
      </tr></thead>
      <tbody>${rows.map((o) => {
        const next = S.STATUSES[S.STATUSES.indexOf(o.status) + 1];
        const nextLabel = next === "ready_to_ship" ? L.markPaid : next === "shipped" ? L.markShip : next === "completed" ? L.markDone : "";
        return `<tr>
          <td>${o.orderNo}</td>
          <td>${(o.createdAt || "").slice(0, 10)}</td>
          <td>${seller ? o.buyerEmail : o.sellerEmail}</td>
          <td>${(o.items || []).map((i) => `${S.itemName(i)} × ${i.quantity}`).join("<br>")}</td>
          <td>${shipLabel(o.shipMethod)}</td>
          <td>${money(seller ? S.orderMoney(o).sellerNet : S.orderMoney(o).total)}</td>
          <td>${statusText(o.status)}</td>
          ${seller ? `<td>${next ? `<button type="button" class="btn btn-line" data-advance="${o.id}" data-next="${next}">${nextLabel}</button>` : L.kept}</td>` : ""}
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function ordersView() {
    const rows = S.mine("buyer");
    const open = rows.filter((o) => o.status !== "completed");
    const hist = rows.filter((o) => o.status === "completed");
    return `
      <h2>${L.myOrders}</h2>
      ${orderJustMade ? `<p class="market-ok">${L.orderFlow}${orderJustMade}</p>` : ""}
      ${threeViewsNote()}
      ${rows.length ? `<section class="market-manage">
        <h3>${L.orderStatus}</h3>
        ${lifecycleHtml(rows)}
      </section>` : ""}
      <section class="market-manage">
        <h3>${L.myOrders}</h3>
        ${open.length ? open.map((o) => sellerOrderCard(o, "buyer")).join("") : `<p class="market-note">${L.noOrders}</p>`}
      </section>
      <section class="market-manage">
        <h3>${L.purchaseHist}</h3>
        ${hist.length ? hist.map((o) => sellerOrderCard(o, "buyer")).join("") : `<p class="market-note">${L.none}</p>`}
      </section>
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
        <p class="market-note"><strong>${L.fn1}</strong> · ${L.name} · ${L.category} · ${L.desc} · ${L.listPrice} · ${L.listQty} · ${L.image} · ${L.listStatus}</p>
        <p class="market-note">${S.lastError && S.lastError() ? L.cloudFail + S.lastError() : L.cloudOk}</p>
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
            <option value="active"${p.status !== "hidden" ? " selected" : ""}>${L.listed}</option>
            <option value="hidden"${p.status === "hidden" ? " selected" : ""}>${L.hidden}</option>
          </select>
        </label>
        <p><button class="btn btn-navy" type="submit">${p.id ? L.update : L.create}</button>
        ${p.id ? `<button class="btn btn-line" type="button" id="cancelEdit">${L.cancel}</button>` : ""}</p>
      </form>
    `;
  }

  function listedDonePanel() {
    const p = justListedId ? S.product(justListedId) : null;
    return `
      <div class="market-listed-done">
        <p class="market-listed-done-kicker">${L.listedDone}</p>
        <h3>${L.listedDone}</h3>
        ${p ? `<p><strong>${S.productName(p)}</strong></p>` : ""}
        <p>
          <button type="button" class="btn btn-navy" data-view="browse">${L.viewListing}</button>
          <button type="button" class="btn btn-line" id="listAnother">${L.addNew}</button>
        </p>
      </div>
    `;
  }

  function sellerListingCard(p) {
    const stock = S.availableStock(p);
    const sold = p.status === "hidden" || stock < 1;
    const fresh = justListedId && String(p.id) === String(justListedId);
    const low = stock <= 1;
    return `
      <article class="card market-card${fresh ? " is-listed" : ""}">
        ${p.imageUrl ? `<img src="${productImg(p.imageUrl)}" alt="">` : ""}
        <p class="kicker">${catText(p.category)}${fresh ? `<span class="market-mine">${L.listedDone}</span>` : ""}</p>
        <h3>${S.productName(p)}</h3>
        ${low ? `<p class="market-low">${L.lowStock}（${L.leftOnly} ${stock}）</p>` : ""}
        <p>${S.productDesc(p) || ""}</p>
        <p><strong>${money(p.price)}</strong></p>
        <p>${L.availQty}: ${stock}</p>
        <p class="market-card-actions">
          ${S.canManageProduct(p) ? `
          <button type="button" class="btn btn-line" data-edit="${p.id}">${L.editItem}</button>
          <button type="button" class="btn btn-line" data-hide="${p.id}">${sold ? L.show : L.markSold}</button>
          <button type="button" class="btn btn-line" data-del="${p.id}">${L.unlist}</button>
          ` : ""}
        </p>
      </article>
    `;
  }

  function sellerActionLabel(status) {
    if (status === "waiting_payment") return L.markPaid;
    if (status === "ready_to_ship") return L.markShip;
    if (status === "shipped") return L.markDone;
    return "";
  }

  function sellerOrderCard(o, role) {
    const next = S.STATUSES[S.STATUSES.indexOf(o.status) + 1];
    const names = (o.items || []).map((i) => S.itemName(i) + (i.quantity > 1 ? " × " + i.quantity : "")).join(" · ");
    const m = S.orderMoney(o);
    const sellerAct = role !== "buyer" && role !== "admin" && next
      ? `<button type="button" class="btn btn-navy market-action" data-advance="${o.id}" data-next="${next}">${sellerActionLabel(o.status)}</button>`
      : (o.status === "completed" ? `<p class="market-note">${L.kept}</p>` : "");
    const otherParty = role === "buyer"
      ? `<p>${L.sellerCol}: ${o.sellerEmail}</p>`
      : `<p>${L.buyerCol}: ${o.buyerEmail}</p>`;
    return `<article class="market-order">
      <p class="market-order-items"><strong>${names}</strong></p>
      <p>${L.orderId}: ${o.orderNo}</p>
      ${otherParty}
      <p>${L.items}: ${names}</p>
      <p>${L.orderTotal}: ${money(m.total)}</p>
      <p>${L.payStatus}: ${statusText(o.status)}</p>
      <p>${L.orderDate}: ${(o.createdAt || "").replace("T", " ").slice(0, 16)}</p>
      <p>${L.lastUpdated}: ${stamp(o)}</p>
      ${sellerAct}
    </article>`;
  }

  function sellerPanel(title, rows) {
    return `<article class="market-seller-block">
      <h4>${title}</h4>
      ${rows.length ? rows.map(sellerOrderCard).join("") : `<p class="market-note">${L.none}</p>`}
    </article>`;
  }

  function inventoryPanel() {
    const products = S.sellerProducts();
    const total = products.reduce((s, p) => s + S.availableStock(p), 0);
    return `
      <section class="market-inv" id="inventory">
        <div class="market-inv-head">
          <h3>${L.invManage}</h3>
          <p><strong>${L.totalAvail}: ${total} ${L.itemsUnit}</strong></p>
        </div>
        <p class="market-note">${L.fn2}</p>
        ${products.length ? products.map((p) => {
          const stock = S.availableStock(p);
          const listed = p.status !== "hidden";
          return `<article class="market-inv-row">
            <div>
              <p><strong>${S.productName(p)}</strong></p>
              <p>${listed ? L.statusListed : L.statusHidden}</p>
              ${stock <= 1 ? `<p class="market-low">${L.lowAlert} ${stock}</p>` : `<p>${L.availQty}: ${stock}</p>`}
            </div>
            <div class="market-inv-tools">
              <input type="number" min="0" step="1" value="${Number(p.quantity) || 0}" data-stock-qty="${p.id}" aria-label="${L.listQty}">
              <button type="button" class="btn btn-navy" data-save-stock="${p.id}">${L.saveStock}</button>
              <button type="button" class="btn btn-line" data-edit="${p.id}">${L.editItem}</button>
              <button type="button" class="btn btn-line" data-hide="${p.id}">${listed ? L.markSold : L.show}</button>
              <button type="button" class="btn btn-line" data-del="${p.id}">${L.unlist}</button>
            </div>
          </article>`;
        }).join("") : `<p class="market-note">${L.noOwn}</p>`}
      </section>
    `;
  }

  function listingBlocks() {
    const products = S.sellerProducts();
    const activeCards = products.slice().sort((a, b) => {
      const aNew = justListedId && String(a.id) === String(justListedId) ? 1 : 0;
      const bNew = justListedId && String(b.id) === String(justListedId) ? 1 : 0;
      if (aNew !== bNew) return bNew - aNew;
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    });
    return `
      <section class="market-listing">
        <h3>${justListedId ? L.listedDone : L.listingTitle}</h3>
        ${justListedId ? listedDonePanel() : sellerForm(listingFormState())}
      </section>
      <section class="market-active">
        <div class="market-listings-head">
          <h3>${L.activeListings}</h3>
          ${justListedId ? "" : `<button type="button" class="btn btn-navy" id="listAnother">${L.addNew}</button>`}
        </div>
        <div class="cards">${activeCards.map(sellerListingCard).join("") || `<p class="market-note">${L.noOwn}</p>`}</div>
      </section>
    `;
  }

  function sellerView() {
    const dash = S.dashboard(sellerMonth);
    const mine = S.mine("seller");
    const pendingPay = mine.filter((o) => o.status === "waiting_payment");
    const pendingShip = mine.filter((o) => o.status === "ready_to_ship" || o.status === "shipped");
    const completed = mine.filter((o) => o.status === "completed");
    const months = S.sellerMonths();
    const period = sellerMonth ? sellerMonth.replace("-", "/") : L.allMonths;
    return `
      <h2>${L.sellerTitle}</h2>
      ${pendingPay.length ? `<p class="market-ok">${L.orderFlow} · ${L.crossUser}</p>` : ""}
      <p class="market-note">${L.sellerFns}</p>
      ${listingBlocks()}
      ${inventoryPanel()}
      ${lifecycleHtml(mine)}
      <div class="stats market-stats">
        <div><strong>${money(dash.monthlyRevenue)}</strong><span>${L.monthlyRev}</span></div>
        <div><strong>${dash.completedCount}</strong><span>${L.completedN}</span></div>
        <div><strong>${dash.pendingPayments}</strong><span>${L.pendingPayN}</span></div>
        <div><strong>${dash.waitingShipment}</strong><span>${L.waitShipN}</span></div>
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
        <p class="market-finance-sum"><strong>${period}</strong> · ${dash.itemsSold} ${L.soldThis} · ${L.revThis}: <strong>${money(dash.monthlyRevenue)}</strong></p>
      </section>
    `;
  }

  function adminActivityPanel() {
    const listings = (S.products() || []).slice().sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))).slice(0, 8);
    const orders = (S.orders() || []).slice().sort((a, b) => String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""))).slice(0, 8);
    const notices = (S.notices() || []).slice(0, 8);
    const rows = [];
    listings.forEach((p) => {
      rows.push({ at: p.updatedAt || "", text: (zh ? "商品：" : "Listing: ") + S.productName(p) + " · " + (p.sellerEmail || "") + " · " + (p.status === "hidden" ? L.hidden : L.active) });
    });
    orders.forEach((o) => {
      rows.push({ at: o.updatedAt || o.createdAt || "", text: (zh ? "訂單：" : "Order: ") + o.orderNo + " · " + o.buyerEmail + " → " + o.sellerEmail + " · " + statusText(o.status) });
    });
    notices.forEach((n) => {
      rows.push({ at: n.at || "", text: n.message || "" });
    });
    rows.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    return `
      <section class="market-panel">
        <h3>${L.reviewActivity}</h3>
        ${rows.length ? `<ul class="market-notices">${rows.slice(0, 12).map((r) => `<li><time>${(r.at || "").replace("T", " ").slice(0, 16)}</time> ${r.text}</li>`).join("")}</ul>` : `<p class="market-note">${L.none}</p>`}
      </section>
    `;
  }

  function adminTxCard(o) {
    const m = S.orderMoney(o);
    const names = (o.items || []).map((i) => S.itemName(i) + (i.quantity > 1 ? " × " + i.quantity : "")).join(" · ");
    return `<article class="market-tx">
      <p><strong>${L.orderId}</strong> ${o.orderNo}</p>
      <p>${L.lastUpdated}: ${stamp(o)}</p>
      <p>${names}</p>
      <p>${L.buyerCol}: ${o.buyerEmail}</p>
      <p>${L.sellerCol}: ${o.sellerEmail}</p>
      <p>${L.txStatus}: ${statusText(o.status)}</p>
      <p>${L.txAmountLabel}: <strong>${money(m.total)}</strong></p>
      <p>${L.subtotal}: ${money(m.subtotal)} · ${L.shipping}: ${money(m.shipping)} · ${L.fee}: ${money(m.fee)}</p>
      ${o.status === "completed" ? `<p class="market-note">${L.kept}</p>` : ""}
    </article>`;
  }

  function adminFiltered() {
    let rows = S.orders();
    if (adminStatus) rows = rows.filter((o) => o.status === adminStatus);
    if (adminIncomplete) rows = rows.filter((o) => o.status !== "completed");
    if (adminQuery) {
      const q = adminQuery.toLowerCase();
      rows = rows.filter((o) => (o.orderNo || "").toLowerCase().includes(q) || (o.id || "").toLowerCase().includes(q) || (o.buyerEmail || "").toLowerCase().includes(q) || (o.sellerEmail || "").toLowerCase().includes(q));
    }
    return rows;
  }

  function adminView() {
    const rows = adminFiltered();
    const amount = rows.reduce((s, o) => s + Number(S.orderMoney(o).total || 0), 0);
    const fees = rows.reduce((s, o) => s + Number(S.orderMoney(o).fee || 0), 0);
    return `
      <h2>${L.adminTitle}</h2>
      ${threeViewsNote()}
      <p class="market-note">${L.adminFns}</p>
      <p class="market-note">${L.adminLead}</p>
      <p class="market-note">${L.adminNote}</p>
      <p><a class="btn btn-navy" href="${zh ? "" : "../"}admin-users.html">${L.manageUsers}</a></p>
      ${adminActivityPanel()}
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
          <button type="button" class="btn btn-navy" id="exportAdmin">${L.exportCsv}</button>
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

  function paintRoles() {
    const host = document.getElementById("marketRoleBar");
    if (!host) return;
    host.innerHTML = justListedId ? `<p class="market-listed-hero">${L.listedDone}</p>` : "";
  }

  function render() {
    if (!skipDraftCapture) saveListingDraft();
    skipDraftCapture = false;
    paintRoles();
    if (view === "admin" && !(S.isMarketAdmin && S.isMarketAdmin())) {
      go("browse");
      return;
    }
    if ((view === "seller" || view === "orders" || view === "cart") && !S.me()) {
      root.innerHTML = modeBox() + buyerTitles() + `<p class="market-note">${L.signInFirst} <a href="${loginHref()}">${L.signIn}</a></p>`;
      return;
    }
    root.innerHTML = modeBox() + buyerTitles() + body();
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
      const url = await window.IMMBAImage.upload(file, "market-photos");
      if (!url || String(url).indexOf("data:") === 0) {
        throw new Error(zh ? "照片無法上傳到雲端。請先在 Supabase 執行 supabase/schema.sql。" : "Photo could not be uploaded. Run supabase/schema.sql in Supabase first.");
      }
      listingImageUrl = url;
      const field = form.querySelector("[name=imageUrl]");
      if (field) field.value = url;
      refreshListingPreview();
      saveListingDraft();
    } catch (err) {
      alert((err && err.message) || (zh ? "圖片無法使用，請改選另一張。" : "That image could not be used. Please choose another."));
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

  const roleHost = document.getElementById("marketRoleBar");
  if (roleHost) {
    roleHost.addEventListener("click", (e) => {
      const t = e.target.closest("[data-view]");
      if (t) go(t.dataset.view);
    });
  }

  root.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-view], [data-open], [data-add], [data-remove], [data-advance], [data-edit], [data-hide], [data-del], [data-save-stock], [data-qty-step], [data-market-login], #checkoutBtn, #exportSeller, #exportAdmin, #cancelEdit, #listAnother, #marketLogoutBtn");
    if (!t) return;
    try {
      if (t.id === "checkoutBtn") {
        if (!needUser(L.needCheckout)) return;
        const orders = S.checkout(shipMethod);
        setCartAdded(false);
        setOrderMade(" · " + orders.map((o) => o.orderNo).join(", ") + L.sellerNotified);
        go("orders");
        return;
      }
      if (t.id === "exportSeller") {
        downloadCsv(S.exportSellerCsv(sellerMonth), "seller-sales.csv");
        return;
      }
      if (t.id === "exportAdmin") {
        downloadCsv(S.exportAdminCsv(adminFiltered()), "platform-transactions.csv");
        return;
      }
      if (t.id === "marketLogoutBtn") {
        if (window.IMMBAMarketAuth && window.IMMBAMarketAuth.signOut) window.IMMBAMarketAuth.signOut();
        go("browse");
        return;
      }
      if (t.dataset.marketLogin) {
        location.href = loginHref(t.dataset.marketLogin);
        return;
      }
      if (t.id === "listAnother") {
        setJustListed("");
        editing = null;
        clearListingDraft();
        skipDraftCapture = true;
        render();
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
        if (!needUser(L.addCart)) return;
        const qtyEl = document.getElementById("buyQty");
        S.addToCart(t.dataset.add, t.dataset.qty || (qtyEl && qtyEl.value) || 1);
        setCartAdded(true);
        go("cart");
        return;
      }
      if (t.dataset.qtyStep) {
        const id = t.dataset.qtyStep;
        const line = (S.cart() || []).find((i) => String(i.productId) === String(id));
        const next = Math.max(0, Number(line && line.quantity || 0) + Number(t.dataset.delta || 0));
        S.updateCartQty(id, next);
        render();
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
      if (t.dataset.saveStock) {
        const id = t.dataset.saveStock;
        const p = S.product(id);
        if (!S.canManageProduct(p)) throw new Error(zh ? "只能改自己上架的庫存。" : "You can change inventory only on your own listings.");
        const qtyEl = root.querySelector('[data-stock-qty="' + id + '"]');
        await S.upsertProduct({ ...p, quantity: qtyEl ? qtyEl.value : p.quantity });
        alert(L.stockSaved);
        render();
        return;
      }
      if (t.dataset.edit) {
        const p = S.product(t.dataset.edit);
        if (!S.canManageProduct(p)) throw new Error(L.ownOnly || (zh ? "只能編輯自己上傳的商品。" : "You can only update listings you uploaded."));
        setJustListed("");
        editing = p;
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
        if (!S.canManageProduct(p)) throw new Error(zh ? "只能下架自己上傳的商品。" : "You can only hide listings you uploaded.");
        await S.upsertProduct({ ...p, status: p.status === "hidden" ? "active" : "hidden" });
        render();
        return;
      }
      if (t.dataset.del) {
        if (confirm(L.confirmDel)) {
          await S.removeProduct(t.dataset.del);
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
      if (t.name === "marketMode" && t.dataset.marketLogin) {
        location.href = loginHref(t.dataset.marketLogin);
        return;
      }
      if (t.name === "marketMode" && t.dataset.view) {
        go(t.dataset.view);
        return;
      }
      if (t.name === "shipMethod") {
        shipMethod = t.value === "pickup" ? "pickup" : "ship";
        render();
        return;
      }
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
    const submitBtn = e.target.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = L.listedDone;
    }
    try {
      await fillMissingTranslations();
      const row = readListingForm();
      const editingId = editing && editing.id ? String(editing.id) : "";
      setJustListed(editingId || "pending");
      const saved = await S.upsertProduct({
        ...row,
        id: editingId || "",
        name: (row && (row.nameZh || row.nameEn)) || "",
        description: (row && (row.descriptionZh || row.descriptionEn)) || "",
        imageUrl: listingImageUrl || (row && row.imageUrl) || ""
      });
      setJustListed(saved && saved.id ? String(saved.id) : justListedId);
      editing = null;
      clearListingDraft();
      skipDraftCapture = true;
      const stayAdmin = view === "admin" && S.isMarketAdmin && S.isMarketAdmin();
      view = stayAdmin ? "admin" : "seller";
      location.hash = view;
      render();
      const first = root.querySelector(".market-active .market-card") || root.querySelector(".market-listed-done");
      if (first) first.scrollIntoView({ block: "start" });
    } catch (err) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = L.create;
      }
      alert(err.message || String(err));
    }
  });

  window.addEventListener("hashchange", () => {
    view = (location.hash || "#browse").replace("#", "") || "browse";
    render();
  });
  window.addEventListener("pagehide", () => saveListingDraft());
  window.addEventListener("immba-market-auth", render);
  window.addEventListener("immba-market", () => {
    skipDraftCapture = true;
    render();
  });
  if (window.IMMBAAuth && window.IMMBAAuth.ready) {
    window.IMMBAAuth.ready.then(render).catch(() => {});
  }
  if (S.ready && S.ready.then) S.ready.then(render).catch(() => render());

  render();
}
