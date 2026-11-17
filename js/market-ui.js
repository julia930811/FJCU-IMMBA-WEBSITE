function initMarket() {
  const root = document.getElementById("marketRoot");
  if (!root) return;
  const zh = document.documentElement.lang !== "en";
  const S = window.MarketStore;
  const L = zh ? {
    buyer: "買家",
    cart: "購物車",
    orders: "我的訂單",
    seller: "賣家",
    admin: "平台管理員",
    roleNote: "只有三種角色：買家、賣家、平台管理員。同一帳號可以切換。未登入只能以買家瀏覽，不能管理帳號。",
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
    kept: "紀錄保留",
    buyerOrders: "我的訂單",
    lifecycle: "狀態依序為：待付款 → 待出貨 → 已出貨 → 已完成。完成後紀錄仍保留。",
    name: "商品名稱",
    category: "類別",
    desc: "商品說明",
    listPrice: "價格",
    listQty: "庫存數量",
    image: "商品圖片網址",
    listStatus: "上架狀態",
    active: "上架中",
    hidden: "隱藏",
    update: "更新商品",
    create: "上架",
    cancel: "取消",
    markPaid: "確認已付款（移至待出貨）",
    markShip: "確認出貨",
    markDone: "標記完成",
    amountDue: "應付金額",
    lastUpdated: "最後更新",
    none: "目前沒有。",
    sellerTitle: "賣家儀表板：銷售與帳務",
    sellerNote: "賣家只能編輯、隱藏或下架自己上傳的商品，也只能處理自己賣出的訂單。",
    rev: "本月銷售額",
    completedN: "完成訂單數",
    pendingPay: "待付款",
    waitShip: "待出貨",
    manage: "賣家訂單管理",
    pendingPayItems: "待付款訂單",
    pendingShipItems: "待出貨訂單",
    completedHist: "已完成訂單｜銷售歷史",
    finance: "財務管理（月報）",
    filterMonth: "依月份篩選",
    allMonths: "全部月份",
    exportCsv: "匯出 CSV",
    soldThis: "本月售出件數",
    revThis: "本月營收",
    listingTitle: "上架／編輯商品（僅限自己上傳）",
    inventory: "庫存",
    invNote: "可售庫存＝目前庫存 − 已售數量。只能改自己上架的庫存。",
    purchased: "已售",
    edit: "編輯",
    show: "顯示",
    hide: "隱藏",
    unlist: "下架",
    noOwn: "尚未上架自己的商品。",
    adminTitle: "平台管理員｜交易監看（監看不是代為處理訂單）",
    searchPh: "搜尋訂單編號／買家／賣家",
    allStatus: "全部狀態",
    incomplete: "未完成／異常",
    adminNote: "管理員可查看所有交易與歷史，不代替賣家確認付款或出貨。",
    signInFirst: "請先登入後再進入此區。",
    signIn: "登入",
    added: "已加入購物車。",
    created: "已建立訂單",
    sellerNotified: "，賣家已收到通知。",
    confirmDel: "確定下架此商品？",
    needCheckout: "結帳"
  } : {
    buyer: "Buyer",
    cart: "Cart",
    orders: "My orders",
    seller: "Seller",
    admin: "Platform admin",
    roleNote: "There are only three roles: buyer, seller, and platform admin. One account can switch among them. Without signing in you may browse as a buyer, but you cannot manage accounts.",
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
    kept: "Record kept",
    buyerOrders: "My orders",
    lifecycle: "Status moves in order: Waiting for Payment → Ready to Ship → Shipped → Completed. Completed records are kept.",
    name: "Product name",
    category: "Category",
    desc: "Description",
    listPrice: "Price",
    listQty: "Quantity",
    image: "Product image URL",
    listStatus: "Listing status",
    active: "Active",
    hidden: "Hidden",
    update: "Update listing",
    create: "Create listing",
    cancel: "Cancel",
    markPaid: "Mark as paid (move to pending shipment)",
    markShip: "Confirm shipment",
    markDone: "Mark order as completed",
    amountDue: "Amount due",
    lastUpdated: "Last updated",
    none: "None.",
    sellerTitle: "Seller dashboard: sales and accounting",
    sellerNote: "Sellers can edit, hide, or remove only listings they uploaded, and can process only their own sales.",
    rev: "Monthly sales revenue",
    completedN: "Completed orders",
    pendingPay: "Pending payments",
    waitShip: "Waiting for shipment",
    manage: "Seller order management",
    pendingPayItems: "Pending payment items",
    pendingShipItems: "Pending shipment items",
    completedHist: "Completed orders · Sales history",
    finance: "Financial management (monthly report)",
    filterMonth: "Filter by month",
    allMonths: "All months",
    exportCsv: "Export CSV",
    soldThis: "items sold this month",
    revThis: "Revenue this month",
    listingTitle: "Create / edit listing (your uploads only)",
    inventory: "Inventory",
    invNote: "Available stock = current inventory − purchased quantity. You can change inventory only on your own listings.",
    purchased: "Purchased",
    edit: "Edit",
    show: "Show",
    hide: "Hide",
    unlist: "Remove",
    noOwn: "You have not uploaded a listing yet.",
    adminTitle: "Platform admin · Monitor transactions (monitor is not processing)",
    searchPh: "Search order ID / buyer / seller",
    allStatus: "All statuses",
    incomplete: "Incomplete / abnormal",
    adminNote: "Admins can view every transaction and its history. They do not confirm payment or shipment for sellers.",
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
      <p class="market-note">${L.roleNote}</p>
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
        <h3>${p.name}</h3>
        <p>${p.description}</p>
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
    const total = lines.reduce((s, l) => s + Number(l.product.price) * Number(l.quantity), 0);
    return `
      <h2>${L.cartTitle}</h2>
      ${lines.length ? `
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>${L.product}</th><th>${L.price}</th><th>${L.qtyCol}</th><th></th></tr></thead>
          <tbody>${lines.map((l) => `<tr>
            <td>${l.product.name}<br><small>${L.stock} ${S.availableStock(l.product)}</small></td>
            <td>${money(l.product.price)}</td>
            <td><input type="number" min="1" value="${l.quantity}" data-qty="${l.productId}"></td>
            <td><button type="button" class="btn btn-line" data-remove="${l.productId}">${L.remove}</button></td>
          </tr>`).join("")}</tbody>
        </table></div>
        <p><strong>${L.total} ${money(total)}</strong></p>
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
          <td>${(o.items || []).map((i) => `${i.name} × ${i.quantity}`).join("<br>")}</td>
          <td>${money(o.total)}</td>
          <td>${statusText(o.status)}</td>
          ${seller ? `<td>${next ? `<button type="button" class="btn btn-line" data-advance="${o.id}" data-next="${next}">${nextLabel}</button>` : L.kept}</td>` : ""}
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function ordersView() {
    return `
      <h2>${L.buyerOrders}</h2>
      <p>${L.lifecycle}</p>
      ${orderTable(S.mine("buyer"), false)}
    `;
  }

  function sellerForm(p) {
    p = p || { name: "", category: "Textbook", description: "", price: "", quantity: "", imageUrl: "", status: "active" };
    return `
      <form id="listingForm" class="market-form">
        <input type="hidden" name="id" value="${p.id || ""}">
        <label>${L.name}<input name="productName" required value="${p.name || ""}"></label>
        <label>${L.category}
          <select name="category">${S.CATEGORIES.map((c) => `<option value="${c}"${c === p.category ? " selected" : ""}>${catText(c)}</option>`).join("")}</select>
        </label>
        <label>${L.desc}<textarea name="description" required>${p.description || ""}</textarea></label>
        <label>${L.listPrice}<input name="price" type="number" min="0" step="1" required value="${p.price || ""}"></label>
        <label>${L.listQty}<input name="quantity" type="number" min="0" step="1" required value="${p.quantity || ""}"></label>
        <label>${L.image}<input name="imageUrl" value="${p.imageUrl || ""}" placeholder="https://"></label>
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
    const names = (o.items || []).map((i) => i.name + (i.quantity > 1 ? " × " + i.quantity : "")).join(" · ");
    return `<div class="market-order">
      <p><strong>${names}</strong></p>
      <p>${o.status === "waiting_payment" ? L.amountDue : L.total}: ${money(o.total)}</p>
      <p>${L.orderId} ${o.orderNo} · ${L.buyerCol} ${o.buyerEmail}</p>
      <p>${L.lastUpdated}: ${(o.createdAt || "").replace("T", " ").slice(0, 16)}</p>
      ${next ? `<p><button type="button" class="btn btn-line" data-advance="${o.id}" data-next="${next}">${sellerActionLabel(o.status)}</button></p>` : ""}
    </div>`;
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
      <div class="stats market-stats">
        <div><strong>${money(dash.monthlyRevenue)}</strong><span>${L.rev}</span></div>
        <div><strong>${dash.completedCount}</strong><span>${L.completedN}</span></div>
        <div><strong>${dash.pendingPayments}</strong><span>${L.pendingPay}</span></div>
        <div><strong>${dash.waitingShipment}</strong><span>${L.waitShip}</span></div>
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
      <h3>${L.listingTitle}</h3>
      ${sellerForm(editing)}
      <h3>${L.inventory}</h3>
      <p>${L.invNote}</p>
      <div class="admin-table-wrap"><table class="admin-table">
        <thead><tr><th>${L.product}</th><th>${L.status}</th><th>${L.inventory}</th><th>${L.purchased}</th><th>${L.stock}</th><th></th></tr></thead>
        <tbody>${products.map((p) => {
          const purchased = Number(p.quantity) - S.availableStock(p);
          return `<tr>
            <td>${p.name}<br><small>${catText(p.category)} · ${money(p.price)}</small></td>
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

  function adminView() {
    let rows = S.orders();
    if (adminStatus) rows = rows.filter((o) => o.status === adminStatus);
    if (adminIncomplete) rows = rows.filter((o) => o.status !== "completed");
    if (adminQuery) {
      const q = adminQuery.toLowerCase();
      rows = rows.filter((o) => (o.orderNo || "").toLowerCase().includes(q) || (o.buyerEmail || "").toLowerCase().includes(q) || (o.sellerEmail || "").toLowerCase().includes(q));
    }
    return `
      <h2>${L.adminTitle}</h2>
      <div class="alumni-toolbar">
        <input id="adminQ" type="search" placeholder="${L.searchPh}" value="${adminQuery}">
        <select id="adminStatus">
          <option value="">${L.allStatus}</option>
          ${S.STATUSES.map((s) => `<option value="${s}"${s === adminStatus ? " selected" : ""}>${statusText(s)}</option>`).join("")}
        </select>
        <label class="market-check"><input type="checkbox" id="adminIncomplete"${adminIncomplete ? " checked" : ""}> ${L.incomplete}</label>
        <button type="button" class="btn btn-navy" id="exportAdmin">CSV</button>
      </div>
      ${orderTable(rows, false)}
      <p class="market-note">${L.adminNote}</p>
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
    if (view === "admin" && !S.isPlatformAdmin()) {
      root.innerHTML = roleBar() + `<p class="market-note">${L.adminOnly} ${S.me() ? "" : `<a href="${loginHref()}">${L.signIn}</a>`}</p>`;
      return;
    }
    if ((view === "seller" || view === "orders") && !S.me()) {
      root.innerHTML = roleBar() + `<p class="market-note">${L.signInFirst} <a href="${loginHref()}">${L.signIn}</a></p>`;
      return;
    }
    root.innerHTML = roleBar() + body();
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
        render();
        return;
      }
      if (t.dataset.view) {
        editing = null;
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

  root.addEventListener("submit", (e) => {
    if (e.target.id !== "listingForm") return;
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      S.upsertProduct({
        id: fd.get("id") || "",
        name: fd.get("productName"),
        category: fd.get("category"),
        description: fd.get("description"),
        price: fd.get("price"),
        quantity: fd.get("quantity"),
        imageUrl: fd.get("imageUrl"),
        status: fd.get("status")
      });
      editing = null;
      render();
    } catch (err) {
      alert(err.message || String(err));
    }
  });

  window.addEventListener("hashchange", () => {
    view = (location.hash || "#browse").replace("#", "") || "browse";
    render();
  });
  window.addEventListener("immba-auth", render);
  if (window.IMMBAAuth && window.IMMBAAuth.ready) {
    window.IMMBAAuth.ready.then(render).catch(() => {});
  }

  render();
}
