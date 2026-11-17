function initMarket() {
  const root = document.getElementById("marketRoot");
  if (!root) return;
  const zh = document.documentElement.lang !== "en";
  const S = window.MarketStore;
  const Auth = window.IMMBAAuth || {};
  let view = (location.hash || "#browse").replace("#", "") || "browse";
  let editing = null;
  let adminQuery = "";
  let adminStatus = "";
  let adminIncomplete = false;

  function money(n) {
    return "NT$ " + Number(n || 0).toLocaleString();
  }

  function statusText(id) {
    const row = S.STATUS_LABEL[id];
    return row ? (zh ? row.zh : row.en) : id;
  }

  function go(next) {
    view = next;
    location.hash = next;
    render();
  }

  function needUser(action) {
    if (S.me()) return true;
    alert(zh ? "請先登入才能" + action : "Please sign in to " + action);
    location.href = "login.html";
    return false;
  }

  function roleBar() {
    const user = S.me();
    const admin = S.isPlatformAdmin();
    const tabs = [
      ["browse", zh ? "Buyer 逛賣場" : "Buyer · Browse"],
      ["cart", zh ? "購物車" : "Cart"],
      ["orders", zh ? "我的訂單" : "My orders"]
    ];
    if (user) tabs.push(["seller", zh ? "Seller 賣家中心" : "Seller dashboard"]);
    if (admin) tabs.push(["admin", zh ? "Platform Admin" : "Platform Admin"]);
    return `
      <div class="market-roles">
        ${tabs.map(([id, label]) => `<button type="button" class="market-role${view === id || (view.startsWith("product-") && id === "browse") ? " is-on" : ""}" data-view="${id}">${label}</button>`).join("")}
      </div>
      <p class="market-note">${zh
        ? "Visitor 可瀏覽；登入後同時是 Buyer 與 Approved Seller。Platform Admin 監看交易，不取代買賣雙方流程。同一帳號可切換三種角色。"
        : "Visitors may browse. A signed-in account is both Buyer and Approved Seller. Platform Admin monitors transactions and does not replace buyer/seller steps. One account can hold all three roles."}</p>
    `;
  }

  function productCard(p, extra) {
    const stock = S.availableStock(p);
    return `
      <article class="card market-card">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="">` : ""}
        <p class="kicker">${p.category}</p>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p><strong>${money(p.price)}</strong> · ${zh ? "Available Stock" : "Available Stock"}: ${stock}</p>
        ${extra || ""}
      </article>
    `;
  }

  function browse() {
    const list = S.catalog();
    return `
      <h2>${zh ? "Browse listings" : "Browse listings"}</h2>
      <div class="cards">${list.map((p) => productCard(p, `<p><button type="button" class="btn btn-navy" data-open="${p.id}">${zh ? "Details" : "Details"}</button></p>`)).join("") || `<p>${zh ? "尚無上架商品。" : "No active listings."}</p>`}</div>
    `;
  }

  function productView(id) {
    const p = S.product(id);
    if (!p) return `<p>${zh ? "找不到商品。" : "Listing not found."}</p>`;
    const stock = S.availableStock(p);
    return `
      <p><button type="button" class="btn btn-ghost" data-view="browse">${zh ? "返回賣場" : "Back to browse"}</button></p>
      ${productCard(p, `
        <p>${zh ? "價格與庫存已顯示於上。買家不可管理庫存。" : "Price and availability are shown above. Buyers cannot manage inventory."}</p>
        <label>${zh ? "購買數量" : "Quantity"}
          <input id="buyQty" type="number" min="1" max="${Math.max(1, stock)}" value="1" ${stock ? "" : "disabled"}>
        </label>
        <p><button type="button" class="btn btn-navy" data-add="${p.id}" ${stock ? "" : "disabled"}>${zh ? "加入購物車" : "Add to cart"}</button></p>
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
      <h2>${zh ? "Shopping cart" : "Shopping cart"}</h2>
      ${lines.length ? `
        <div class="admin-table-wrap"><table class="admin-table">
          <thead><tr><th>${zh ? "商品" : "Product"}</th><th>${zh ? "單價" : "Price"}</th><th>${zh ? "數量" : "Qty"}</th><th></th></tr></thead>
          <tbody>${lines.map((l) => `<tr>
            <td>${l.product.name}<br><small>Stock ${S.availableStock(l.product)}</small></td>
            <td>${money(l.product.price)}</td>
            <td><input type="number" min="1" value="${l.quantity}" data-qty="${l.productId}"></td>
            <td><button type="button" class="btn btn-ghost" data-remove="${l.productId}">${zh ? "移除" : "Remove"}</button></td>
          </tr>`).join("")}</tbody>
        </table></div>
        <p><strong>${zh ? "合計" : "Total"} ${money(total)}</strong></p>
        <p><button type="button" class="btn btn-navy" id="checkoutBtn">${zh ? "結帳並建立訂單" : "Check out"}</button></p>
      ` : `<p>${zh ? "購物車是空的。" : "Your cart is empty."}</p>`}
    `;
  }

  function orderTable(rows, seller) {
    if (!rows.length) return `<p>${zh ? "沒有訂單。" : "No orders."}</p>`;
    return `<div class="admin-table-wrap"><table class="admin-table">
      <thead><tr>
        <th>Order ID</th><th>${zh ? "日期" : "Date"}</th>
        <th>${seller ? "Buyer" : "Seller"}</th>
        <th>${zh ? "商品" : "Items"}</th><th>${zh ? "金額" : "Amount"}</th><th>Status</th>${seller ? "<th></th>" : ""}
      </tr></thead>
      <tbody>${rows.map((o) => {
        const next = S.STATUSES[S.STATUSES.indexOf(o.status) + 1];
        const nextLabel = next === "ready_to_ship" ? "Confirm Payment" : next === "shipped" ? "Confirm shipment" : next === "completed" ? "Complete" : "";
        return `<tr>
          <td>${o.orderNo}</td>
          <td>${(o.createdAt || "").slice(0, 10)}</td>
          <td>${seller ? o.buyerEmail : o.sellerEmail}</td>
          <td>${(o.items || []).map((i) => `${i.name} × ${i.quantity}`).join("<br>")}</td>
          <td>${money(o.total)}</td>
          <td>${statusText(o.status)}</td>
          ${seller ? `<td>${next ? `<button type="button" class="btn btn-line" data-advance="${o.id}" data-next="${next}">${nextLabel}</button>` : (zh ? "紀錄保留" : "Record kept")}</td>` : ""}
        </tr>`;
      }).join("")}</tbody>
    </table></div>`;
  }

  function ordersView() {
    return `
      <h2>${zh ? "Buyer orders" : "Buyer orders"}</h2>
      <p>${zh ? "狀態：Waiting for Payment → Ready to Ship → Shipped → Completed。完成後紀錄仍保留。" : "Lifecycle: Waiting for Payment → Ready to Ship → Shipped → Completed. Completed records are kept."}</p>
      ${orderTable(S.mine("buyer"), false)}
    `;
  }

  function sellerForm(p) {
    p = p || { name: "", category: "Textbook", description: "", price: "", quantity: "", imageUrl: "", status: "active" };
    return `
      <form id="listingForm" class="market-form">
        <input type="hidden" name="id" value="${p.id || ""}">
        <label>Product Name<input name="productName" required value="${p.name || ""}"></label>
        <label>Category
          <select name="category">${S.CATEGORIES.map((c) => `<option${c === p.category ? " selected" : ""}>${c}</option>`).join("")}</select>
        </label>
        <label>Description<textarea name="description" required>${p.description || ""}</textarea></label>
        <label>Price<input name="price" type="number" min="0" step="1" required value="${p.price || ""}"></label>
        <label>Quantity<input name="quantity" type="number" min="0" step="1" required value="${p.quantity || ""}"></label>
        <label>Product Image URL<input name="imageUrl" value="${p.imageUrl || ""}" placeholder="https:// or img/..."></label>
        <label>Listing Status
          <select name="status">
            <option value="active"${p.status !== "hidden" ? " selected" : ""}>Active</option>
            <option value="hidden"${p.status === "hidden" ? " selected" : ""}>Hidden</option>
          </select>
        </label>
        <p><button class="btn btn-navy" type="submit">${p.id ? (zh ? "更新商品" : "Update listing") : (zh ? "上架" : "Create listing")}</button>
        ${p.id ? `<button class="btn btn-ghost" type="button" id="cancelEdit">${zh ? "取消" : "Cancel"}</button>` : ""}</p>
      </form>
    `;
  }

  function sellerView() {
    const dash = S.dashboard();
    const products = S.sellerProducts();
    const notices = S.notices().slice(0, 5);
    return `
      <h2>${zh ? "Seller dashboard" : "Seller dashboard"}</h2>
      <div class="stats market-stats">
        <div><strong>${money(dash.monthlyRevenue)}</strong><span>Monthly revenue</span></div>
        <div><strong>${dash.completedCount}</strong><span>Completed orders</span></div>
        <div><strong>${dash.pendingPayments}</strong><span>Pending payments</span></div>
        <div><strong>${dash.waitingShipment}</strong><span>Waiting for shipment</span></div>
      </div>
      <p><button type="button" class="btn btn-line" id="exportSeller">${zh ? "匯出銷售 CSV" : "Export sales CSV"}</button></p>
      ${notices.length ? `<ul class="market-notices">${notices.map((n) => `<li>${n.message} <time>${(n.at || "").slice(0, 16).replace("T", " ")}</time></li>`).join("")}</ul>` : ""}
      <h3>${zh ? "Create / edit listing" : "Create / edit listing"}</h3>
      ${sellerForm(editing)}
      <h3>${zh ? "Inventory" : "Inventory"}</h3>
      <p>${zh ? "Available Stock = Current Inventory − Purchased Quantity。賣家更新庫存、隱藏或下架；買家不可改庫存。" : "Available Stock = Current Inventory − Purchased Quantity. Sellers update, hide or remove listings. Buyers cannot."}</p>
      <div class="admin-table-wrap"><table class="admin-table">
        <thead><tr><th>Product</th><th>Status</th><th>Inventory</th><th>Purchased</th><th>Available Stock</th><th></th></tr></thead>
        <tbody>${products.map((p) => {
          const purchased = Number(p.quantity) - S.availableStock(p);
          return `<tr>
            <td>${p.name}<br><small>${p.category} · ${money(p.price)}</small></td>
            <td>${p.status}</td>
            <td>${p.quantity}</td>
            <td>${purchased}</td>
            <td>${S.availableStock(p)}</td>
            <td>
              <button type="button" class="btn btn-ghost" data-edit="${p.id}">${zh ? "編輯" : "Edit"}</button>
              <button type="button" class="btn btn-ghost" data-hide="${p.id}">${p.status === "hidden" ? "Show" : "Hide"}</button>
              <button type="button" class="btn btn-ghost" data-del="${p.id}">${zh ? "下架" : "Remove"}</button>
            </td>
          </tr>`;
        }).join("") || `<tr><td colspan="6">${zh ? "尚未上架。" : "No listings yet."}</td></tr>`}</tbody>
      </table></div>
      <h3>${zh ? "Process orders" : "Process orders"}</h3>
      ${orderTable(S.mine("seller"), true)}
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
      <h2>Platform Admin · ${zh ? "交易監看（監看 ≠ 代為處理訂單）" : "Monitor transactions (monitor ≠ process)"}</h2>
      <div class="alumni-toolbar">
        <input id="adminQ" type="search" placeholder="Search Order ID / buyer / seller" value="${adminQuery}">
        <select id="adminStatus">
          <option value="">All statuses</option>
          ${S.STATUSES.map((s) => `<option value="${s}"${s === adminStatus ? " selected" : ""}>${statusText(s)}</option>`).join("")}
        </select>
        <label class="market-check"><input type="checkbox" id="adminIncomplete"${adminIncomplete ? " checked" : ""}> Incomplete / abnormal</label>
        <button type="button" class="btn btn-line" id="exportAdmin">CSV</button>
      </div>
      ${orderTable(rows, false)}
      <p class="market-note">${zh ? "管理員可查看所有交易與歷史，不代替賣家確認付款或出貨。" : "Admins can view every transaction and its history. They do not confirm payment or shipment for sellers."}</p>
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
    if (view === "seller" && !needUser("open the seller dashboard")) return;
    if (view === "orders" && !needUser("view orders")) return;
    if (view === "admin" && !S.isPlatformAdmin()) {
      view = "browse";
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
        if (!needUser("check out")) return;
        const orders = S.checkout();
        alert(zh ? "已建立訂單 " + orders.map((o) => o.orderNo).join(", ") + "，賣家已收到通知。" : "Order created: " + orders.map((o) => o.orderNo).join(", ") + ". Seller notified.");
        go("orders");
        return;
      }
      if (t.id === "exportSeller") {
        downloadCsv(S.exportSellerCsv(), "seller-sales.csv");
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
        S.addToCart(t.dataset.add, document.getElementById("buyQty") && document.getElementById("buyQty").value);
        alert(zh ? "已加入購物車。" : "Added to cart.");
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
        if (confirm(zh ? "確定下架此商品？" : "Remove this listing?")) {
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

  render();
  setTimeout(render, 400);
}
