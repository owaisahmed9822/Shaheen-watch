/**
 * Shaheen Watch — store + admin (localStorage)
 * Optional: set WHATSAPP_NUMBER to your full international number without + (e.g. 923001234567)
 */
(function () {
  "use strict";

  var STORAGE_PRODUCTS = "shaheen_products";
  var STORAGE_ORDERS = "shaheen_orders";
  var STORAGE_CART = "shaheen_cart";
  var STORAGE_THEME = "shaheen_theme";
  var STORAGE_ABOUT = "shaheen_about";
  var STORAGE_CONTACT = "shaheen_contact";
  var ADMIN_SESSION = "shaheen_admin_session";

  var ADMIN_USER = "admin";
  var ADMIN_PASS = "shaheen123";

  /** @type {string} WhatsApp number (digits only, country code included) */
  var WHATSAPP_NUMBER = "923001234567";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function formatPrice(n) {
    return "Rs. " + (Math.round(Number(n) * 100) / 100).toLocaleString("en-PK");
  }

  function uid() {
    return "id_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 9);
  }

  function placeholderAvatarDataUri() {
    // Simple inline SVG placeholder (no external assets).
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#c9a227" stop-opacity="0.25"/>' +
      '<stop offset="1" stop-color="#0d0d0d" stop-opacity="0.15"/>' +
      "</linearGradient></defs>" +
      '<rect width="240" height="240" rx="120" fill="url(#g)"/>' +
      '<circle cx="120" cy="95" r="42" fill="#c9a227" fill-opacity="0.35"/>' +
      '<path d="M48 210c12-44 48-70 72-70s60 26 72 70" fill="#0d0d0d" fill-opacity="0.18"/>' +
      '<text x="120" y="228" text-anchor="middle" font-family="DM Sans, Arial" font-size="14" fill="#5c5c5c">Owner</text>' +
      "</svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    var saved = localStorage.getItem(STORAGE_THEME);
    if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    updateThemeButtons();
  }

  function toggleTheme() {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_THEME, "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem(STORAGE_THEME, "dark");
    }
    updateThemeButtons();
  }

  function updateThemeButtons() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var label = dark ? "☀️" : "🌙";
    $all("#btn-theme, #admin-btn-theme").forEach(function (b) {
      b.textContent = label;
      b.setAttribute("title", dark ? "Light mode" : "Dark mode");
    });
  }

  /* ---------- Products ---------- */
  function defaultProducts() {
    var img = function (n) {
      return "https://picsum.photos/seed/sw" + n + "/400/300";
    };
    return [
      { id: uid(), name: "Classic Leather Hand Watch", price: 4500, category: "Hand Watches", description: "Elegant analog display with genuine leather strap.", image: img(1) },
      { id: uid(), name: "Sport Digital Hand Watch", price: 3200, category: "Hand Watches", description: "Water-resistant with stopwatch and backlight.", image: img(2) },
      { id: uid(), name: "Vintage Wall Clock", price: 2800, category: "Wall Watches", description: "Silent quartz movement, 12-inch dial.", image: img(3) },
      { id: uid(), name: "Modern Minimal Wall Watch", price: 3500, category: "Wall Watches", description: "Metal frame, easy to read numbers.", image: img(4) },
      { id: uid(), name: "Fitness Smart Watch", price: 12500, category: "Smart Watches", description: "Heart rate, steps, and phone notifications.", image: img(5) },
      { id: uid(), name: "Budget Smart Band", price: 5500, category: "Smart Watches", description: "Sleep tracking and waterproof design.", image: img(6) },
      { id: uid(), name: "Over-Ear Headphones", price: 4200, category: "Headphones", description: "Comfortable padding, clear bass.", image: img(7) },
      { id: uid(), name: "Wireless Earbuds Pro", price: 6800, category: "Bluetooth Airbuds", description: "ANC and charging case included.", image: img(8) },
      { id: uid(), name: "USB-C Cable 2m", price: 450, category: "USB Wires", description: "Fast charging compatible, braided.", image: img(9) },
      { id: uid(), name: "Fast Wall Charger 25W", price: 1800, category: "Mobile Chargers", description: "USB-C port, surge protection.", image: img(10) },
      { id: uid(), name: "LED Rechargeable Torch", price: 1200, category: "Torch", description: "Zoom focus, long battery life.", image: img(11) },
      { id: uid(), name: "LED Bulb 12W Cool White", price: 350, category: "Bulbs", description: "Energy saving, E27 base.", image: img(12) },
      { id: uid(), name: "LED Tube Light 18W", price: 890, category: "Tube Lights", description: "Flicker-free, includes fixture clips.", image: img(13) },
      { id: uid(), name: "Switch Socket Combo", price: 650, category: "Electrical Fitting Items", description: "Quality copper contacts, white finish.", image: img(14) },
      { id: uid(), name: "Battery & Strap Replacement", price: 800, category: "Watch Repair Services", description: "Standard watch battery or strap change at our shop.", image: img(15) }
    ];
  }

  function getProducts() {
    try {
      var raw = localStorage.getItem(STORAGE_PRODUCTS);
      if (!raw) {
        var defs = defaultProducts();
        saveProducts(defs);
        return defs;
      }
      var list = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) {
        var d = defaultProducts();
        saveProducts(d);
        return d;
      }
      return list;
    } catch (e) {
      var fallback = defaultProducts();
      saveProducts(fallback);
      return fallback;
    }
  }

  function saveProducts(list) {
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(list));
  }

  function getOrders() {
    try {
      var raw = localStorage.getItem(STORAGE_ORDERS);
      if (!raw) return [];
      var o = JSON.parse(raw);
      return Array.isArray(o) ? o : [];
    } catch (e) {
      return [];
    }
  }

  function saveOrders(list) {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(list));
  }

  /* ---------- Contact ---------- */
  function defaultContact() {
    return {
      phones: ["94032 61570", "70664 31322", "93073 36003"]
    };
  }

  function getContact() {
    try {
      var raw = localStorage.getItem(STORAGE_CONTACT);
      if (!raw) {
        var d = defaultContact();
        saveContact(d);
        return d;
      }
      var c = JSON.parse(raw);
      var arr = (c && c.phones) || [];
      if (!Array.isArray(arr)) arr = [];
      return {
        phones: arr.map(function (p) {
          return String(p || "").trim();
        })
      };
    } catch (e) {
      var fb = defaultContact();
      saveContact(fb);
      return fb;
    }
  }

  function saveContact(contact) {
    localStorage.setItem(STORAGE_CONTACT, JSON.stringify(contact));
    localStorage.setItem(STORAGE_CONTACT + "_updatedAt", String(Date.now()));
  }

  /* ---------- About Us ---------- */
  function defaultAbout() {
    return {
      shopName: "Shaheen Watch",
      ownerName: "Ziyaur Rahman",
      ownerPhoto:
        "https://media-bom5-2.cdn.whatsapp.net/v/t61.24694-24/473405915_652472737230904_6938829151978596645_n.jpg",
      description:
        "Shaheen Watch is a trusted shop providing high-quality watches and electronic accessories.\nWe deal in hand watches, wall clocks, smart watches, headphones, Bluetooth earbuds, mobile chargers, USB wires, bulbs, tube lights, and electrical fitting items.\nWe also offer watch repair services and home electrical fitting services for bulbs and fans.\nOur goal is to provide reliable products and honest service to our customers.",
      address: "Bazar Galli, Akkalkuwa\nDistrict Nandurbar, Maharashtra\nPIN: 245412"
    };
  }

  function getAbout() {
    try {
      var raw = localStorage.getItem(STORAGE_ABOUT);
      if (!raw) {
        var d = defaultAbout();
        saveAbout(d);
        return d;
      }
      var a = JSON.parse(raw);
      if (!a || typeof a !== "object") throw new Error("bad about");
      return {
        shopName: String(a.shopName || "Shaheen Watch"),
        ownerName: String(a.ownerName || "Ziyaur Rahman"),
        ownerPhoto: String(a.ownerPhoto || ""),
        description: String(a.description || ""),
        address: String(a.address || "")
      };
    } catch (e) {
      var fallback = defaultAbout();
      saveAbout(fallback);
      return fallback;
    }
  }

  function saveAbout(about) {
    localStorage.setItem(STORAGE_ABOUT, JSON.stringify(about));
    // Helpful for cross-tab/page refresh detection
    localStorage.setItem(STORAGE_ABOUT + "_updatedAt", String(Date.now()));
  }

  /* ---------- Cart ---------- */
  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_CART);
      if (!raw) return [];
      var c = JSON.parse(raw);
      return Array.isArray(c) ? c : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart));
  }

  function cartCount() {
    return getCart().reduce(function (sum, line) {
      return sum + line.qty;
    }, 0);
  }

  function cartTotal() {
    return getCart().reduce(function (sum, line) {
      return sum + line.price * line.qty;
    }, 0);
  }

  function addToCart(product, qty) {
    qty = qty || 1;
    var cart = getCart();
    var found = cart.find(function (l) {
      return l.productId === product.id;
    });
    if (found) found.qty += qty;
    else
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || "",
        qty: qty
      });
    saveCart(cart);
  }

  function setLineQty(productId, qty) {
    var cart = getCart();
    var line = cart.find(function (l) {
      return l.productId === productId;
    });
    if (!line) return;
    if (qty <= 0) {
      cart = cart.filter(function (l) {
        return l.productId !== productId;
      });
    } else line.qty = qty;
    saveCart(cart);
  }

  function removeLine(productId) {
    saveCart(
      getCart().filter(function (l) {
        return l.productId !== productId;
      })
    );
  }

  /* ---------- Store UI ---------- */
  function filterProducts(products, search, category) {
    var s = (search || "").trim().toLowerCase();
    var c = (category || "").trim();
    return products.filter(function (p) {
      if (c && p.category !== c) return false;
      if (!s) return true;
      return (
        (p.name && p.name.toLowerCase().indexOf(s) !== -1) ||
        (p.description && p.description.toLowerCase().indexOf(s) !== -1) ||
        (p.category && p.category.toLowerCase().indexOf(s) !== -1)
      );
    });
  }

  function renderProductGrid() {
    var grid = $("#product-grid");
    if (!grid) return;
    var search = ($("#search-input") && $("#search-input").value) || "";
    var category = ($("#category-filter") && $("#category-filter").value) || "";
    var list = filterProducts(getProducts(), search, category);
    var noEl = $("#no-products");
    if (list.length === 0) {
      grid.innerHTML = "";
      if (noEl) noEl.classList.remove("hidden");
      return;
    }
    if (noEl) noEl.classList.add("hidden");
    grid.innerHTML = list
      .map(function (p) {
        var img = p.image || "https://picsum.photos/seed/nophoto/400/300";
        return (
          '<article class="product-card" data-id="' +
          escapeAttr(p.id) +
          '">' +
          '<img class="product-card-img" src="' +
          escapeAttr(img) +
          '" alt="" loading="lazy" />' +
          '<div class="product-card-body">' +
          '<span class="product-card-category">' +
          escapeHtml(p.category) +
          "</span>" +
          "<h3>" +
          escapeHtml(p.name) +
          "</h3>" +
          '<p class="product-card-price">' +
          formatPrice(p.price) +
          "</p>" +
          '<p class="product-card-desc">' +
          escapeHtml(p.description) +
          "</p>" +
          '<button type="button" class="btn btn-primary btn-block btn-add-cart" data-id="' +
          escapeAttr(p.id) +
          '">Add to cart</button>' +
          "</div></article>"
        );
      })
      .join("");
    $all(".btn-add-cart", grid).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var p = getProducts().find(function (x) {
          return x.id === id;
        });
        if (p) {
          addToCart(p, 1);
          updateCartUI();
          openCart();
        }
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }

  function updateCartUI() {
    var countEl = $("#cart-count");
    if (countEl) countEl.textContent = String(cartCount());
    var totalEl = $("#cart-total");
    if (totalEl) totalEl.textContent = formatPrice(cartTotal());
    var container = $("#cart-items");
    if (!container) return;
    var cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = '<p class="no-products" style="border:none">Your cart is empty.</p>';
      return;
    }
    container.innerHTML = cart
      .map(function (line) {
        var img = line.image || "https://picsum.photos/seed/cart/100/100";
        return (
          '<div class="cart-line" data-id="' +
          escapeAttr(line.productId) +
          '">' +
          '<img src="' +
          escapeAttr(img) +
          '" alt="" />' +
          "<div class=\"cart-line-info\"><h4>" +
          escapeHtml(line.name) +
          "</h4>" +
          '<p class="cart-line-meta">' +
          formatPrice(line.price) +
          " × " +
          line.qty +
          "</p></div>" +
          '<div class="cart-line-actions">' +
          '<div class="qty-row">' +
          '<button type="button" class="btn-qty-minus" data-id="' +
          escapeAttr(line.productId) +
          '">−</button>' +
          "<span>" +
          line.qty +
          "</span>" +
          '<button type="button" class="btn-qty-plus" data-id="' +
          escapeAttr(line.productId) +
          '">+</button>' +
          "</div>" +
          '<button type="button" class="cart-line-remove" data-id="' +
          escapeAttr(line.productId) +
          '">Remove</button>' +
          "</div></div>"
        );
      })
      .join("");

    $all(".btn-qty-minus", container).forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-id");
        var line = getCart().find(function (l) {
          return l.productId === id;
        });
        if (line) setLineQty(id, line.qty - 1);
        updateCartUI();
      });
    });
    $all(".btn-qty-plus", container).forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-id");
        var line = getCart().find(function (l) {
          return l.productId === id;
        });
        if (line) setLineQty(id, line.qty + 1);
        updateCartUI();
      });
    });
    $all(".cart-line-remove", container).forEach(function (b) {
      b.addEventListener("click", function () {
        removeLine(b.getAttribute("data-id"));
        updateCartUI();
      });
    });
  }

  function openCart() {
    var drawer = $("#cart-drawer");
    var overlay = $("#cart-overlay");
    if (drawer) {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
    }
    if (overlay) overlay.classList.add("visible");
    document.body.classList.add("cart-open");
  }

  function closeCart() {
    var drawer = $("#cart-drawer");
    var overlay = $("#cart-overlay");
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (overlay) overlay.classList.remove("visible");
    document.body.classList.remove("cart-open");
  }

  function openModal(id) {
    var m = $(id);
    if (m) {
      m.classList.add("open");
      m.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal(id) {
    var m = $(id);
    if (m) {
      m.classList.remove("open");
      m.setAttribute("aria-hidden", "true");
    }
  }

  function submitOrder(customer) {
    var cart = getCart();
    if (cart.length === 0) return;
    var orders = getOrders();
    var order = {
      id: uid(),
      createdAt: new Date().toISOString(),
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      items: cart.map(function (l) {
        return { name: l.name, qty: l.qty, price: l.price };
      }),
      total: cartTotal(),
      status: "Pending"
    };
    orders.unshift(order);
    saveOrders(orders);
    saveCart([]);
    updateCartUI();
    closeCart();
    var msg = $("#confirm-message");
    if (msg) msg.textContent = "Order #" + order.id.slice(-8) + " received. We will contact you at " + customer.phone + ".";
    openModal("#confirm-modal");
  }

  function initStorePage() {
    initTheme();
    var btnTheme = $("#btn-theme");
    if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

    renderProductGrid();
    updateCartUI();

    var search = $("#search-input");
    var cat = $("#category-filter");
    if (search) {
      search.addEventListener("input", renderProductGrid);
      search.addEventListener("search", renderProductGrid);
    }
    if (cat) cat.addEventListener("change", renderProductGrid);
    var btnSearch = $("#btn-search");
    if (btnSearch) btnSearch.addEventListener("click", renderProductGrid);

    $("#btn-open-cart") &&
      $("#btn-open-cart").addEventListener("click", function () {
        openCart();
      });
    $("#btn-close-cart") &&
      $("#btn-close-cart").addEventListener("click", closeCart);
    $("#cart-overlay") &&
      $("#cart-overlay").addEventListener("click", closeCart);

    $("#btn-checkout") &&
      $("#btn-checkout").addEventListener("click", function () {
        if (getCart().length === 0) return;
        closeCart();
        openModal("#checkout-modal");
      });

    $("#checkout-backdrop") &&
      $("#checkout-backdrop").addEventListener("click", function () {
        closeModal("#checkout-modal");
      });
    $("#btn-close-checkout") &&
      $("#btn-close-checkout").addEventListener("click", function () {
        closeModal("#checkout-modal");
      });

    var form = $("#checkout-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        submitOrder({
          name: String(fd.get("name") || "").trim(),
          phone: String(fd.get("phone") || "").trim(),
          address: String(fd.get("address") || "").trim()
        });
        closeModal("#checkout-modal");
        form.reset();
      });
    }

    $("#btn-confirm-ok") &&
      $("#btn-confirm-ok").addEventListener("click", function () {
        closeModal("#confirm-modal");
      });
    $("#confirm-backdrop") &&
      $("#confirm-backdrop").addEventListener("click", function () {
        closeModal("#confirm-modal");
      });

    /* WhatsApp quick order */
    if (WHATSAPP_NUMBER && document.body.classList.contains("page-store")) {
      var wa = document.createElement("a");
      wa.href =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent("Hello Shaheen Watch, I would like to place an order.");
      wa.className = "btn-whatsapp";
      wa.setAttribute("aria-label", "Order on WhatsApp");
      wa.setAttribute("title", "Chat on WhatsApp");
      wa.setAttribute("target", "_blank");
      wa.setAttribute("rel", "noopener noreferrer");
      wa.textContent = "WA";
      wa.style.fontSize = "0.85rem";
      wa.style.fontWeight = "800";
      document.body.appendChild(wa);
    }
  }

  function renderAboutPage() {
    var about = getAbout();
    var shop = $("#about-shop-name");
    var owner = $("#about-owner-name");
    var desc = $("#about-description");
    var img = $("#about-owner-photo");
    var addr = $("#about-address");

    if (shop) shop.textContent = about.shopName || "Shaheen Watch";
    if (owner) owner.textContent = about.ownerName || "";
    if (desc) desc.textContent = about.description || "";
    if (img) img.src = about.ownerPhoto || placeholderAvatarDataUri();
    if (addr) addr.textContent = about.address || "";

    // Also update brand text in header if present
    var brand = $("#about-brand");
    var strong = $("#about-brand-strong");
    if (brand && strong) {
      var name = (about.shopName || "Shaheen Watch").trim();
      var parts = name.split(" ");
      if (parts.length >= 2) {
        brand.textContent = parts.slice(0, -1).join(" ");
        strong.textContent = parts[parts.length - 1];
      } else {
        brand.textContent = name;
        strong.textContent = "";
      }
    }
  }

  function initAboutPage() {
    initTheme();
    var btnTheme = $("#btn-theme");
    if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

    renderAboutPage();

    // If about is changed in another tab, reflect instantly
    window.addEventListener("storage", function (e) {
      if (e && e.key === STORAGE_ABOUT) renderAboutPage();
      if (e && e.key === STORAGE_ABOUT + "_updatedAt") renderAboutPage();
      if (e && e.key === STORAGE_THEME) initTheme();
    });

    // If user navigates back to this tab, refresh from localStorage
    window.addEventListener("focus", function () {
      renderAboutPage();
    });

    // Beginner-friendly fallback: periodic refresh (covers cases where storage event doesn't fire)
    setInterval(renderAboutPage, 1000);
  }

  /* ---------- Contact page ---------- */
  function normalizePhoneForTel(phone) {
    // Keep + and digits only for tel: link
    return String(phone || "").trim().replace(/[^\d+]/g, "");
  }

  function renderContactPage() {
    var listEl = $("#contact-list");
    if (!listEl) return;
    var emptyEl = $("#contact-empty");
    var callNow = $("#contact-call-now");

    var contact = getContact();
    var phones = (contact.phones || []).map(function (p) {
      return String(p || "").trim();
    }).filter(function (p) {
      return p.length > 0;
    });

    if (phones.length === 0) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("hidden");
      if (callNow) callNow.classList.add("hidden");
      return;
    }

    if (emptyEl) emptyEl.classList.add("hidden");

    listEl.innerHTML = phones.map(function (p) {
      var tel = normalizePhoneForTel(p);
      return (
        '<a class="contact-line" href="tel:' + escapeAttr(tel) + '">' +
        '<span class="contact-left">' +
        '<span class="contact-icon">📞</span>' +
        '<span class="contact-number">' + escapeHtml(p) + '</span>' +
        "</span>" +
        '<span class="contact-cta">Call</span>' +
        "</a>"
      );
    }).join("");

    if (callNow) {
      callNow.href = "tel:" + normalizePhoneForTel(phones[0]);
      callNow.classList.remove("hidden");
    }
  }

  function initContactPage() {
    initTheme();
    var btnTheme = $("#btn-theme");
    if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

    renderContactPage();

    window.addEventListener("storage", function (e) {
      if (e && (e.key === STORAGE_CONTACT || e.key === STORAGE_CONTACT + "_updatedAt")) renderContactPage();
      if (e && e.key === STORAGE_THEME) initTheme();
    });

    window.addEventListener("focus", function () {
      renderContactPage();
    });

    setInterval(renderContactPage, 1000);
  }

  /* ---------- Admin ---------- */
  function isAdminLoggedIn() {
    return sessionStorage.getItem(ADMIN_SESSION) === "1";
  }

  function setAdminSession(on) {
    if (on) sessionStorage.setItem(ADMIN_SESSION, "1");
    else sessionStorage.removeItem(ADMIN_SESSION);
  }

  function renderOrdersTable() {
    var tbody = $("#orders-tbody");
    var empty = $("#no-orders");
    if (!tbody) return;
    var orders = getOrders();
    if (orders.length === 0) {
      tbody.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");
    tbody.innerHTML = orders
      .map(function (o) {
        var date = new Date(o.createdAt);
        var dateStr = isNaN(date.getTime()) ? "—" : date.toLocaleString();
        var itemsHtml =
          "<ul class=\"order-items-list\">" +
          (o.items || [])
            .map(function (it) {
              return "<li>" + escapeHtml(it.name) + " × " + it.qty + " — " + formatPrice(it.price * it.qty) + "</li>";
            })
            .join("") +
          "</ul>";
        var status = o.status === "Completed" ? "Completed" : "Pending";
        return (
          "<tr>" +
          "<td>" +
          escapeHtml(o.id.slice(-10)) +
          "</td>" +
          "<td>" +
          escapeHtml(dateStr) +
          "</td>" +
          "<td>" +
          escapeHtml(o.name) +
          "</td>" +
          "<td>" +
          escapeHtml(o.phone) +
          "</td>" +
          '<td class="cell-stack">' +
          escapeHtml(o.address) +
          "</td>" +
          '<td class="cell-stack">' +
          itemsHtml +
          "</td>" +
          "<td>" +
          formatPrice(o.total) +
          "</td>" +
          "<td>" +
          '<select class="status-select" data-order-id="' +
          escapeAttr(o.id) +
          '">' +
          '<option value="Pending"' +
          (status === "Pending" ? " selected" : "") +
          ">Pending</option>" +
          '<option value="Completed"' +
          (status === "Completed" ? " selected" : "") +
          ">Completed</option>" +
          "</select></td>" +
          "<td>—</td></tr>"
        );
      })
      .join("");

    $all(".status-select", tbody).forEach(function (sel) {
      sel.addEventListener("change", function () {
        var id = sel.getAttribute("data-order-id");
        var list = getOrders();
        var ord = list.find(function (x) {
          return x.id === id;
        });
        if (ord) {
          ord.status = sel.value;
          saveOrders(list);
        }
      });
    });
  }

  function fillProductForm(p) {
    var form = $("#product-form");
    if (!form) return;
    form.querySelector("[name=name]").value = p.name;
    form.querySelector("[name=price]").value = p.price;
    form.querySelector("[name=category]").value = p.category;
    form.querySelector("[name=image]").value = p.image || "";
    form.querySelector("[name=description]").value = p.description;
    $("#product-edit-id").value = p.id;
    $("#product-submit-btn").textContent = "Update product";
    $("#btn-cancel-edit").classList.remove("hidden");
  }

  function resetProductForm() {
    var form = $("#product-form");
    if (!form) return;
    form.reset();
    $("#product-edit-id").value = "";
    $("#product-submit-btn").textContent = "Add product";
    $("#btn-cancel-edit").classList.add("hidden");
  }

  function renderAdminProducts() {
    var tbody = $("#products-admin-tbody");
    if (!tbody) return;
    var list = getProducts();
    tbody.innerHTML = list
      .map(function (p) {
        var img = p.image || "https://picsum.photos/seed/adm/48/48";
        return (
          "<tr>" +
          '<td><img class="thumb" src="' +
          escapeAttr(img) +
          '" alt="" /></td>' +
          "<td>" +
          escapeHtml(p.name) +
          "</td>" +
          "<td>" +
          escapeHtml(p.category) +
          "</td>" +
          "<td>" +
          formatPrice(p.price) +
          "</td>" +
          "<td>" +
          '<button type="button" class="btn btn-outline btn-sm btn-edit-product" data-id="' +
          escapeAttr(p.id) +
          '">Edit</button> ' +
          '<button type="button" class="btn btn-outline btn-sm btn-delete-product" data-id="' +
          escapeAttr(p.id) +
          '">Delete</button>' +
          "</td></tr>"
        );
      })
      .join("");

    $all(".btn-edit-product", tbody).forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-id");
        var p = getProducts().find(function (x) {
          return x.id === id;
        });
        if (p) fillProductForm(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    $all(".btn-delete-product", tbody).forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Delete this product?")) return;
        var id = b.getAttribute("data-id");
        saveProducts(
          getProducts().filter(function (x) {
            return x.id !== id;
          })
        );
        renderAdminProducts();
      });
    });
  }

  function initAdminAbout() {
    var form = $("#about-form");
    if (!form) return;

    var inputShop = $("#about-shopName");
    var inputOwner = $("#about-ownerName");
    var inputUrl = $("#about-ownerPhotoUrl");
    var inputFile = $("#about-ownerPhotoFile");
    var inputDesc = $("#about-description");
    var inputAddr = $("#about-address");
    var btnPreview = $("#about-preview-btn");

    var prevShop = $("#about-preview-shopName");
    var prevOwner = $("#about-preview-ownerName");
    var prevDesc = $("#about-preview-description");
    var prevImg = $("#about-preview-photo");
    var prevAddr = $("#about-preview-address");
    var successMsg = $("#about-success");

    var draft = getAbout();

    function syncFormFromDraft() {
      draft = getAbout();
      if (inputShop) inputShop.value = draft.shopName || "";
      if (inputOwner) inputOwner.value = draft.ownerName || "";
      if (inputUrl) inputUrl.value = (draft.ownerPhoto && draft.ownerPhoto.indexOf("data:") === 0) ? "" : (draft.ownerPhoto || "");
      if (inputDesc) inputDesc.value = draft.description || "";
      if (inputAddr) inputAddr.value = draft.address || "";
      if (inputFile) inputFile.value = "";
      renderPreview();
    }

    function readDraftFromInputs() {
      draft.shopName = String((inputShop && inputShop.value) || "").trim();
      draft.ownerName = String((inputOwner && inputOwner.value) || "").trim();
      draft.description = String((inputDesc && inputDesc.value) || "").trim();
      draft.address = String((inputAddr && inputAddr.value) || "").trim();
      var urlVal = String((inputUrl && inputUrl.value) || "").trim();
      // If a URL is provided, prefer it. Otherwise keep existing (or uploaded) draft.ownerPhoto.
      if (urlVal) draft.ownerPhoto = urlVal;
    }

    function renderPreview() {
      readDraftFromInputs();
      if (prevShop) prevShop.textContent = draft.shopName || "Shaheen Watch";
      if (prevOwner) prevOwner.textContent = draft.ownerName || "";
      if (prevDesc) prevDesc.textContent = draft.description || "";
      if (prevImg) prevImg.src = draft.ownerPhoto || placeholderAvatarDataUri();
      if (prevAddr) prevAddr.textContent = draft.address || "";
    }

    function saveNow() {
      readDraftFromInputs();
      saveAbout({
        shopName: draft.shopName || "Shaheen Watch",
        ownerName: draft.ownerName || "Ziyaur Rahman",
        ownerPhoto: draft.ownerPhoto || "",
        description: draft.description || "",
        address: draft.address || ""
      });
    }

    // Live preview as you type
    [inputShop, inputOwner, inputUrl, inputDesc, inputAddr].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", renderPreview);
    });

    if (btnPreview) btnPreview.addEventListener("click", renderPreview);

    if (inputFile) {
      inputFile.addEventListener("change", function () {
        var file = inputFile.files && inputFile.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          draft.ownerPhoto = String(reader.result || "");
          if (inputUrl) inputUrl.value = "";
          renderPreview();
        };
        reader.readAsDataURL(file);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isAdminLoggedIn()) return;
      saveNow();
      // Re-sync from saved value (keeps things consistent)
      syncFormFromDraft();
      if (successMsg) {
        successMsg.textContent = "About Us updated successfully";
        successMsg.classList.remove("hidden");
        setTimeout(function () {
          successMsg.classList.add("hidden");
        }, 2500);
      } else {
        alert("About Us updated successfully");
      }
    });

    syncFormFromDraft();
  }

  function renderContactPreview(listEl, emptyEl, phones) {
    var cleaned = (phones || []).map(function (p) { return String(p || "").trim(); }).filter(function (p) { return p.length > 0; });
    if (cleaned.length === 0) {
      if (listEl) listEl.innerHTML = "";
      if (emptyEl) emptyEl.classList.remove("hidden");
      return;
    }
    if (emptyEl) emptyEl.classList.add("hidden");
    if (listEl) {
      listEl.innerHTML = cleaned.map(function (p) {
        var tel = normalizePhoneForTel(p);
        return (
          '<a class="contact-line" href="tel:' + escapeAttr(tel) + '">' +
          '<span class="contact-left">' +
          '<span class="contact-icon">📞</span>' +
          '<span class="contact-number">' + escapeHtml(p) + '</span>' +
          "</span>" +
          '<span class="contact-cta">Call</span>' +
          "</a>"
        );
      }).join("");
    }
  }

  function initAdminContact() {
    var form = $("#contact-form");
    if (!form) return;

    var p1 = $("#contact-phone-1");
    var p2 = $("#contact-phone-2");
    var p3 = $("#contact-phone-3");
    var previewBtn = $("#contact-preview-btn");
    var success = $("#contact-success");

    var prevList = $("#contact-preview-list");
    var prevEmpty = $("#contact-preview-empty");

    function loadIntoForm() {
      var c = getContact();
      var phones = c.phones || [];
      if (p1) p1.value = phones[0] || "";
      if (p2) p2.value = phones[1] || "";
      if (p3) p3.value = phones[2] || "";
      render();
    }

    function currentPhones() {
      return [p1 && p1.value, p2 && p2.value, p3 && p3.value].map(function (v) {
        return String(v || "").trim();
      });
    }

    function render() {
      renderContactPreview(prevList, prevEmpty, currentPhones());
    }

    [p1, p2, p3].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", render);
    });

    if (previewBtn) previewBtn.addEventListener("click", render);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!isAdminLoggedIn()) return;
      saveContact({ phones: currentPhones() });
      loadIntoForm();
      if (success) {
        success.textContent = "Contact updated successfully";
        success.classList.remove("hidden");
        setTimeout(function () { success.classList.add("hidden"); }, 2500);
      } else {
        alert("Contact updated successfully");
      }
    });

    loadIntoForm();
  }

  function initAdminPage() {
    initTheme();
    var btnTheme = $("#admin-btn-theme");
    if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

    var loginSection = $("#admin-login");
    var dashboard = $("#admin-dashboard");
    var btnLogout = $("#btn-logout");

    function showDashboard() {
      if (loginSection) loginSection.classList.add("hidden");
      if (dashboard) dashboard.classList.remove("hidden");
      if (btnLogout) btnLogout.classList.remove("hidden");
      renderOrdersTable();
      renderAdminProducts();
      initAdminAbout();
      initAdminContact();
    }

    function showLogin() {
      if (loginSection) loginSection.classList.remove("hidden");
      if (dashboard) dashboard.classList.add("hidden");
      if (btnLogout) btnLogout.classList.add("hidden");
    }

    if (isAdminLoggedIn()) showDashboard();
    else showLogin();

    var loginForm = $("#login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(loginForm);
        var u = String(fd.get("username") || "");
        var p = String(fd.get("password") || "");
        var err = $("#login-error");
        if (u === ADMIN_USER && p === ADMIN_PASS) {
          setAdminSession(true);
          if (err) err.classList.add("hidden");
          showDashboard();
        } else {
          if (err) err.classList.remove("hidden");
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener("click", function () {
        setAdminSession(false);
        showLogin();
      });
    }

    $all(".tab-btn").forEach(function (tab) {
      tab.addEventListener("click", function () {
        var name = tab.getAttribute("data-tab");
        $all(".tab-btn").forEach(function (t) {
          t.classList.toggle("active", t === tab);
        });
        $("#panel-orders").classList.toggle("hidden", name !== "orders");
        $("#panel-products").classList.toggle("hidden", name !== "products");
        $("#panel-about").classList.toggle("hidden", name !== "about");
        $("#panel-contact").classList.toggle("hidden", name !== "contact");
      });
    });

    var productForm = $("#product-form");
    if (productForm) {
      productForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!isAdminLoggedIn()) return;
        var fd = new FormData(productForm);
        var editId = String($("#product-edit-id").value || "").trim();
        var name = String(fd.get("name") || "").trim();
        var price = Number(fd.get("price"));
        var category = String(fd.get("category") || "");
        var image = String(fd.get("image") || "").trim();
        var description = String(fd.get("description") || "").trim();
        var list = getProducts();
        if (editId) {
          var idx = list.findIndex(function (x) {
            return x.id === editId;
          });
          if (idx !== -1) {
            list[idx] = {
              id: editId,
              name: name,
              price: price,
              category: category,
              image: image,
              description: description
            };
          }
        } else {
          list.push({
            id: uid(),
            name: name,
            price: price,
            category: category,
            image: image,
            description: description
          });
        }
        saveProducts(list);
        resetProductForm();
        renderAdminProducts();
      });
    }

    var cancelEdit = $("#btn-cancel-edit");
    if (cancelEdit) {
      cancelEdit.addEventListener("click", resetProductForm);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.classList.contains("page-store")) initStorePage();
    else if (document.body.classList.contains("page-admin")) initAdminPage();
    else if (document.body.classList.contains("page-about")) initAboutPage();
    else if (document.body.classList.contains("page-contact")) initContactPage();
  });
})();
