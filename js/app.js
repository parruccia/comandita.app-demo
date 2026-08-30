// ─────────────────────────────────────────
// Comanditas Demo — app.js
// ─────────────────────────────────────────

// ── HOURS CHECK (demo always open) ──
function estaAbierto() {
  return true;
}

function renderHoursPill() {
  var pill = document.getElementById("hoursPill");
  if (!pill) return;
  var abierto = estaAbierto();
  pill.className = "hours-pill " + (abierto ? "open" : "closed");
  pill.textContent = abierto ? "Abierto ahora" : "Cerrado";
}

function renderFooterInfo() {
  var dir = document.getElementById("footerDireccion");
  var hor = document.getElementById("footerHorarios");
  var ig = document.getElementById("footerInstagram");
  if (dir) dir.textContent = window.SITE_CONFIG.direccion;
  if (hor) hor.textContent = "Lun - Sáb 12:00 - 23:00";
  if (ig) ig.href = window.SITE_CONFIG.instagram;
}

function renderClosedNotice() {
  var notice = document.getElementById("closedNotice");
  if (!notice) return;
  if (estaAbierto()) {
    notice.classList.remove("visible");
    return;
  }
  notice.classList.add("visible");
  var hor = document.getElementById("footerHorarios");
  var h = window.SITE_CONFIG.horarios;
  var now = new Date();
  var tomorrow = (now.getDay() + 1) % 7;
  var nextDay = h[tomorrow];
  var nextText = "Mañana a las 12:00";
  if (nextDay && !nextDay.cerrado && nextDay.abierto) nextText = "Mañana a las " + nextDay.abierto;
  notice.querySelector(".closed-notice__hours").textContent = "Abrimos " + nextText;
}

function copiarLinkProducto(nombre) {
  var slug = "";
  var params = new URLSearchParams(window.location.search);
  slug = params.get("slug") || "";
  var url = window.location.origin + window.location.pathname + "?slug=" + slug + "#" + encodeURIComponent(nombre);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function() { showToast("Link copiado"); });
  } else {
    var tmp = document.createElement("textarea");
    tmp.value = url;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
    showToast("Link copiado");
  }
}

// ── HOME ──
function renderHome() {
  var grid = document.getElementById("gridCategorias");
  if (!grid) return;

  var cats = window.CATEGORIAS.filter(function(c) { return c.visible_en_menu; });
  cats.sort(function(a, b) { return a.orden - b.orden; });

  var html = "";
  for (var i = 0; i < cats.length; i++) {
    var c = cats[i];
    var count = window.PRODUCTOS.filter(function(p) { return p.categoria === c.slug && !p.agotado; }).length;
    html += '<a href="categoria.html?slug=' + c.slug + '" class="card">' +
      '<div class="card__thumb">' +
      '<img src="' + c.imagen + '" alt="' + c.nombre + '" loading="lazy" />' +
      '</div>' +
      '<div class="card__bar"></div>' +
      '<div class="card__body">' +
      '<div class="card__name">' + c.nombre + '</div>' +
      '<div class="card__cta">' + count + ' productos · Ver menú →</div>' +
      '</div>' +
      '</a>';
  }
  grid.innerHTML = html;
}

// ── CATEGORY ──
var categoriaActual = null;

function renderCategoria() {
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("slug");
  if (!slug) { window.location.href = "index.html"; return; }

  categoriaActual = null;
  for (var i = 0; i < window.CATEGORIAS.length; i++) {
    if (window.CATEGORIAS[i].slug === slug) { categoriaActual = window.CATEGORIAS[i]; break; }
  }
  if (!categoriaActual) { window.location.href = "index.html"; return; }

  document.title = "Comanditas — " + categoriaActual.nombre;
  document.getElementById("pageTitle").textContent = categoriaActual.nombre;

  var heroImg = document.getElementById("categoryHeroImg");
  if (heroImg) {
    heroImg.src = categoriaActual.imagen;
    heroImg.alt = categoriaActual.nombre;
    heroImg.onerror = function() { this.style.display = 'none'; };
  }
  document.getElementById("categoryTitle").textContent = categoriaActual.nombre;

  var productos = window.PRODUCTOS.filter(function(p) { return p.categoria === slug; });
  productos.sort(function(a, b) { return a.orden - b.orden; });

  var list = document.getElementById("productsList");
  var html = "";

  for (var j = 0; j < productos.length; j++) {
    var p = productos[j];
    var badgeHtml = "";
    if (p.badge) {
      var cls = "badge--popular";
      if (p.badge === "Nuevo") cls = "badge--new";
      else if (p.badge === "Picante") cls = "badge--spicy";
      else if (p.badge === "Vegetariano") cls = "badge--veg";
      else if (p.badge === "Sin TACC") cls = "badge--gf";
      badgeHtml = '<span class="badge ' + cls + '">' + p.badge + '</span>';
    }

    html += '<div class="product' + (p.agotado ? ' product--agotado' : '') + '">' +
      '<div class="product__img-wrap" onclick="' + (p.agotado ? '' : 'abrirLightbox(\'' + p.imagen.replace(/'/g, "\\'") + '\',\'' + p.nombre.replace(/'/g, "\\'") + '\')') + '">' +
      '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy" />' +
      (p.agotado ? '<div class="agotado-overlay"><span class="agotado-label">Agotado</span></div>' : '') +
      '</div>' +
      '<div class="product__body">' +
      '<div class="product__name">' + p.nombre + badgeHtml + '</div>' +
      '<div class="product__desc">' + p.descripcion + '</div>' +
      '<div class="product__footer">' +
      '<div class="product__price">' + (p.agotado ? '' : formatPrice(p.precio)) + '</div>';

    if (p.agotado) {
      html += '<span class="badge badge--soldout">No disponible</span>';
    } else if (categoriaActual.personalizable) {
      html += '<button class="add-btn" onclick="abrirModal(' + p.id + ')">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        'Agregar</button>';
    } else {
      html += '<div class="qty" data-name="' + p.nombre + '" data-price="' + p.precio + '" data-categoria="' + p.categoria + '">' +
        '<button onclick="changeQty(this, -1)">-</button>' +
        '<span class="qty__display">0</span>' +
        '<button onclick="changeQty(this, 1)">+</button>' +
        '</div>';
    }

    if (!p.agotado) {
      html += '<button class="share-btn" onclick="copiarLinkProducto(\'' + p.nombre.replace(/'/g, "\\'") + '\')" title="Copiar link del producto">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
        '</button>';
    }

    html += '</div></div></div>';
  }

  list.innerHTML = html;
}

// ── LIGHTBOX ──
function abrirLightbox(src, nombre) {
  var lb = document.getElementById("lightbox");
  var img = document.getElementById("lightboxImg");
  var nameEl = document.getElementById("lightboxName");
  if (!lb || !img) return;
  img.src = src;
  img.alt = nombre;
  nameEl.textContent = nombre;
  lb.classList.add("open");
  document.body.style.overflow = "hidden";
  history.pushState({ lightbox: true }, "");
}

function cerrarLightbox(e) {
  if (e && e.target && e.target.tagName === "IMG") return;
  var lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("open");
  document.body.style.overflow = "";
  if (history.state && history.state.lightbox) history.back();
}

window.addEventListener("popstate", function() {
  var lb = document.getElementById("lightbox");
  if (lb && lb.classList.contains("open")) {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ── ESCAPE KEY ──
document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape") return;
  var lb = document.getElementById("lightbox");
  if (lb && lb.classList.contains("open")) { cerrarLightbox(); return; }
  var modal = document.getElementById("modalCustom");
  if (modal && modal.classList.contains("open")) { cerrarModal(); return; }
  var drawer = document.getElementById("drawer");
  if (drawer && drawer.classList.contains("open")) { toggleDrawer(); return; }
  var tp = document.getElementById("themePanel");
  if (tp && tp.classList.contains("open")) { togglePanelTemas(); return; }
});

// ── CUSTOMIZATION MODAL ──
var modalProducto = null;
var modalSalsas = [];
var modalToppings = [];

function abrirModal(productId) {
  modalProducto = null;
  for (var i = 0; i < window.PRODUCTOS.length; i++) {
    if (window.PRODUCTOS[i].id === productId) { modalProducto = window.PRODUCTOS[i]; break; }
  }
  if (!modalProducto) return;
  modalSalsas = [];
  modalToppings = [];

  document.getElementById("modalTitle").textContent = modalProducto.nombre;
  var html = "";
  var salsasIncluidas = modalProducto.salsas_incluidas || 0;

  html += '<div class="modal__section-title">Salsas' +
    (salsasIncluidas > 0 ? ' (' + salsasIncluidas + ' gratis)' : '') + '</div>';

  for (var j = 0; j < window.SALSAS.length; j++) {
    var s = window.SALSAS[j];
    modalSalsas.push({ nombre: s.nombre, precio: 0, qty: 0 });
    html += '<div class="modal__option"><div class="modal__option-info">' +
      '<span class="modal__option-name">' + s.nombre + '</span>' +
      '<span class="modal__option-price" id="salsaPrice' + j + '">' +
      (s.precio === 0 ? 'Gratis' : '+' + formatPrice(s.precio)) + '</span></div>' +
      '<div class="modal__qty-sm"><button onclick="changeModalSalsa(' + j + ',-1,' + s.precio + ',' + salsasIncluidas + ')">-</button>' +
      '<span id="salsaQty' + j + '">0</span>' +
      '<button onclick="changeModalSalsa(' + j + ',1,' + s.precio + ',' + salsasIncluidas + ')">+</button></div></div>';
  }

  var toppingsIncluidos = modalProducto.toppings_incluidos || 0;
  if (window.TOPPINGS.length > 0) {
    html += '<div class="modal__section-title">Toppings' +
      (toppingsIncluidos > 0 ? ' (' + toppingsIncluidos + ' gratis)' : '') + '</div>';
    for (var k = 0; k < window.TOPPINGS.length; k++) {
      var t = window.TOPPINGS[k];
      modalToppings.push({ nombre: t.nombre, precio: 0, qty: 0 });
      html += '<div class="modal__option"><div class="modal__option-info">' +
        '<span class="modal__option-name">' + t.nombre + '</span>' +
        '<span class="modal__option-price" id="toppingPrice' + k + '">' +
        (t.precio === 0 ? 'Gratis' : '+' + formatPrice(t.precio)) + '</span></div>' +
        '<div class="modal__qty-sm"><button onclick="changeModalTopping(' + k + ',-1,' + t.precio + ',' + toppingsIncluidos + ')">-</button>' +
        '<span id="toppingQty' + k + '">0</span>' +
        '<button onclick="changeModalTopping(' + k + ',1,' + t.precio + ',' + toppingsIncluidos + ')">+</button></div></div>';
    }
  }

  document.getElementById("modalBody").innerHTML = html;
  updateModalPrice();
  document.getElementById("modalOverlay").classList.add("open");
  document.getElementById("modalCustom").classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("modalConfirmBtn").onclick = function() { confirmarModal(); };
}

function changeModalSalsa(index, delta, precioBase, freeCount) {
  var current = modalSalsas[index].qty + delta;
  if (current < 0 || current > 10) return;
  var totalQty = 0;
  for (var i = 0; i < modalSalsas.length; i++) totalQty += (i === index) ? current : modalSalsas[i].qty;
  if (totalQty > freeCount + 10) return;
  modalSalsas[index].qty = current;
  document.getElementById("salsaQty" + index).textContent = current;
  var allQty = 0;
  for (var j = 0; j < modalSalsas.length; j++) allQty += modalSalsas[j].qty;
  var free = Math.min(allQty, freeCount);
  for (var k = 0; k < modalSalsas.length; k++) {
    var s = window.SALSAS[k];
    var priceEl = document.getElementById("salsaPrice" + k);
    if (modalSalsas[k].qty === 0) {
      priceEl.textContent = s.precio === 0 ? 'Gratis' : '+' + formatPrice(s.precio);
      priceEl.className = 'modal__option-price';
      modalSalsas[k].precio = 0;
    } else {
      var freeSlots = Math.max(0, free - (allQty - modalSalsas[k].qty));
      if (freeSlots >= modalSalsas[k].qty) {
        priceEl.textContent = 'Gratis'; priceEl.className = 'modal__option-price free'; modalSalsas[k].precio = 0;
      } else {
        priceEl.textContent = '+' + formatPrice(s.precio); priceEl.className = 'modal__option-price'; modalSalsas[k].precio = s.precio;
      }
    }
  }
  updateModalPrice();
}

function changeModalTopping(index, delta, precioBase, freeCount) {
  var current = modalToppings[index].qty + delta;
  if (current < 0 || current > 10) return;
  var totalQty = 0;
  for (var i = 0; i < modalToppings.length; i++) totalQty += (i === index) ? current : modalToppings[i].qty;
  if (totalQty > freeCount + 10) return;
  modalToppings[index].qty = current;
  document.getElementById("toppingQty" + index).textContent = current;
  var allQty = 0;
  for (var j = 0; j < modalToppings.length; j++) allQty += modalToppings[j].qty;
  var free = Math.min(allQty, freeCount);
  for (var k = 0; k < modalToppings.length; k++) {
    var t = window.TOPPINGS[k];
    var priceEl = document.getElementById("toppingPrice" + k);
    if (modalToppings[k].qty === 0) {
      priceEl.textContent = t.precio === 0 ? 'Gratis' : '+' + formatPrice(t.precio);
      priceEl.className = 'modal__option-price'; modalToppings[k].precio = 0;
    } else {
      var freeSlots = Math.max(0, free - (allQty - modalToppings[k].qty));
      if (freeSlots >= modalToppings[k].qty) {
        priceEl.textContent = 'Gratis'; priceEl.className = 'modal__option-price free'; modalToppings[k].precio = 0;
      } else {
        priceEl.textContent = '+' + formatPrice(t.precio); priceEl.className = 'modal__option-price'; modalToppings[k].precio = t.precio;
      }
    }
  }
  updateModalPrice();
}

function updateModalPrice() {
  if (!modalProducto) return;
  var total = modalProducto.precio;
  for (var i = 0; i < modalSalsas.length; i++) total += modalSalsas[i].precio * modalSalsas[i].qty;
  for (var j = 0; j < modalToppings.length; j++) total += modalToppings[j].precio * modalToppings[j].qty;
  document.getElementById("modalPrice").textContent = formatPrice(total);
}

function confirmarModal() {
  if (!modalProducto) return;
  var activeSalsas = [], activeToppings = [];
  for (var i = 0; i < modalSalsas.length; i++)
    for (var n = 0; n < modalSalsas[i].qty; n++) activeSalsas.push({ nombre: modalSalsas[i].nombre, precio: modalSalsas[i].precio });
  for (var j = 0; j < modalToppings.length; j++)
    for (var n = 0; n < modalToppings[j].qty; n++) activeToppings.push({ nombre: modalToppings[j].nombre, precio: modalToppings[j].precio });
  agregarLomitoAlCarrito(modalProducto, activeSalsas, activeToppings);
  cerrarModal();
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.getElementById("modalCustom").classList.remove("open");
  document.body.style.overflow = "";
}

// ── STICKY CART ──
function updateStickyCart() {
  var count = getCartCount();
  var total = getCartTotal();
  var sticky = document.getElementById("stickyCart");
  var sc = document.getElementById("stickyCount");
  var st = document.getElementById("stickyTotal");
  if (sticky) sticky.classList.toggle("visible", count > 0);
  if (sc) sc.textContent = count;
  if (st) st.textContent = formatPrice(total);
}

// ── CHECKOUT ──
var formState = { entrega: null, pago: null };
var descuentoCupon = 0;

function seleccionar(grupo, valor, el) {
  formState[grupo] = valor;
  var btns = el.parentElement.querySelectorAll(".option-btn");
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove("selected");
  el.classList.add("selected");

  if (grupo === "entrega") {
    var campoDir = document.getElementById("campoDireccion");
    if (campoDir) campoDir.style.display = valor === "envio" ? "block" : "none";
    renderCheckout();
  }
  if (grupo === "pago") {
    var campoTrans = document.getElementById("campoTransferencia");
    if (campoTrans) campoTrans.style.display = valor === "transferencia" ? "block" : "none";
  }
}

function copiarAlias() {
  var alias = window.SITE_CONFIG.alias;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(alias).then(function() { showToast("Alias copiado"); });
  } else {
    var tmp = document.createElement("textarea");
    tmp.value = alias;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
    showToast("Alias copiado");
  }
}

function aplicarCuponDemo() {
  var input = document.getElementById("inputCupon");
  var msg = document.getElementById("cuponMsg");
  if (!input || !msg) return;
  var codigo = input.value.trim().toUpperCase();
  if (!codigo) { msg.textContent = "Ingresá un código"; msg.className = "cupon-msg error"; return; }
    if (codigo === "COMANDITA10") {
    descuentoCupon = 10;
    msg.textContent = "¡10% de descuento aplicado!"; msg.className = "cupon-msg ok";
  } else if (codigo === "COMANDITA500") {
    descuentoCupon = 500;
    msg.textContent = "¡$500 de descuento aplicado!"; msg.className = "cupon-msg ok";
  } else {
    descuentoCupon = 0;
    msg.textContent = "Cupón no válido (probá COMANDITA10 o COMANDITA500)"; msg.className = "cupon-msg error";
  }
  renderCheckout();
}

function calcularEnvio(subtotal) {
  if (!formState.entrega || formState.entrega === "retiro") return 0;
  if (subtotal >= window.SITE_CONFIG.envio_gratis_desde) return 0;
  return window.SITE_CONFIG.envio_costo;
}

function renderCheckout() {
  var items = document.getElementById("resumenItems");
  if (!items) return;
  var cart = getCart(), lomitos = getLomitosCart();
  var html = "", empty = true;

  for (var i = 0; i < lomitos.length; i++) {
    empty = false;
    var l = lomitos[i];
    html += '<div class="resumen__item"><div class="resumen__item-name">' + l.nombre + '<span class="resumen__item-qty">x' + l.qty + '</span>';
    if (l.salsas && l.salsas.length > 0) html += '<div class="resumen__item-detail">Salsas: ' + l.salsas.map(function(s) { return s.nombre; }).join(", ") + '</div>';
    if (l.toppings && l.toppings.length > 0) html += '<div class="resumen__item-detail">Toppings: ' + l.toppings.map(function(t) { return t.nombre; }).join(", ") + '</div>';
    html += '</div><div class="resumen__item-price">' + formatPrice(l.precioUnitario * l.qty) + '</div></div>';
  }
  for (var k in cart) {
    empty = false;
    var item = cart[k];
    html += '<div class="resumen__item"><div class="resumen__item-name">' + item.name + '<span class="resumen__item-qty">x' + item.qty + '</span></div><div class="resumen__item-price">' + formatPrice(item.price * item.qty) + '</div></div>';
  }
  if (empty) html = '<div class="resumen__empty">No hay productos en el carrito</div>';
  items.innerHTML = html;

  var subtotal = getCartTotal();
  var envio = calcularEnvio(subtotal);
  var desc = 0;
  if (descuentoCupon > 0 && descuentoCupon < 100) desc = Math.round(subtotal * descuentoCupon / 100);
  else if (descuentoCupon >= 100) desc = Math.min(descuentoCupon, subtotal);

  var envioRow = document.getElementById("resumenEnvioRow");
  var envioLabel = document.getElementById("resumenEnvioLabel");
  var envioVal = document.getElementById("resumenEnvio");
  if (formState.entrega) {
    envioRow.style.display = "flex";
    if (formState.entrega === "retiro") {
      envioLabel.textContent = "Envío";
      envioVal.textContent = "Gratis (retiro)";
      envioVal.style.color = "#66BB6A";
    } else if (envio === 0) {
      envioLabel.textContent = "Envío";
      envioVal.textContent = "¡Gratis!";
      envioVal.style.color = "#66BB6A";
    } else {
      envioLabel.textContent = "Envío";
      envioVal.textContent = formatPrice(envio);
      envioVal.style.color = "";
    }
  } else {
    envioRow.style.display = "none";
  }

  var descRow = document.getElementById("resumenDescuentoRow");
  if (desc > 0) { descRow.style.display = "flex"; document.getElementById("resumenDescuento").textContent = "-" + formatPrice(desc); }
  else descRow.style.display = "none";

  document.getElementById("resumenSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("resumenTotal").textContent = formatPrice(subtotal + envio - desc);

  var tiempo = document.getElementById("resumenTiempo");
  if (tiempo) {
    if (formState.entrega === "retiro") tiempo.innerHTML = "Listo en <strong>~15 min</strong>";
    else if (formState.entrega === "envio") tiempo.innerHTML = "Llega en <strong>~" + window.SITE_CONFIG.tiempo_estimado + " min</strong>";
    else tiempo.innerHTML = "";
  }

  // autofill
  var saved = JSON.parse(localStorage.getItem("comanditas_customer") || "null");
  if (saved) {
    if (saved.nombre && !document.getElementById("inputNombre").value) document.getElementById("inputNombre").value = saved.nombre;
    if (saved.telefono && !document.getElementById("inputTelefono").value) document.getElementById("inputTelefono").value = saved.telefono;
    if (saved.direccion && !document.getElementById("inputDireccion").value) document.getElementById("inputDireccion").value = saved.direccion;
  }
}

function enviarPedido() {
  var btn = document.getElementById("submitBtn");
  if (btn && btn.disabled) return;

  var nombre = document.getElementById("inputNombre").value.trim();
  var telefono = document.getElementById("inputTelefono").value.trim();
  var obs = document.getElementById("inputObs").value.trim();

  if (!nombre) { showToast("Poné tu nombre"); return; }
  if (!telefono || !/^\d{6,}$/.test(telefono.replace(/[\s\-\+]/g, ""))) { showToast("Poné un teléfono válido"); return; }
  if (!formState.entrega) { showToast("Elegí retiro o envío"); return; }
  if (formState.entrega === "envio" && !document.getElementById("inputDireccion").value.trim()) { showToast("Poné tu dirección"); return; }
  if (!formState.pago) { showToast("Elegí el método de pago"); return; }
  if (getCartCount() === 0) { showToast("El carrito está vacío"); return; }

  // save customer data
  localStorage.setItem("comanditas_customer", JSON.stringify({
    nombre: nombre, telefono: telefono, direccion: document.getElementById("inputDireccion").value.trim()
  }));

  // disable btn + spinner
  if (btn) {
    btn.disabled = true;
    btn.querySelector(".submit-icon").style.display = "none";
    btn.querySelector(".submit-text").style.display = "none";
    btn.querySelector(".submit-spinner").style.display = "block";
  }

  var now = new Date();
  var fecha = now.toLocaleDateString("es-AR") + " - " + now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  var msg = "*Pedido — Comanditas*\n\n";
  msg += "*" + nombre + "*\n" + fecha + "\nTel: " + telefono + "\n\n";

  var cart = getCart(), lomitos = getLomitosCart();
  for (var i = 0; i < lomitos.length; i++) {
    var l = lomitos[i];
    msg += l.qty + "x " + l.nombre;
    if (l.size) msg += " (" + l.size + ")";
    msg += " — " + formatPrice(l.precioUnitario * l.qty) + "\n";
    var extras = [];
    for (var s = 0; s < l.salsas.length; s++) extras.push(l.salsas[s].nombre);
    for (var t = 0; t < l.toppings.length; t++) extras.push(l.toppings[t].nombre);
    if (extras.length > 0) msg += "  → " + extras.join(", ") + "\n";
  }
  for (var k in cart) {
    var item = cart[k];
    msg += item.qty + "x " + item.name + " — " + formatPrice(item.price * item.qty) + "\n";
  }

  var subtotal = getCartTotal();
  var envio = calcularEnvio(subtotal);
  var desc = 0;
  if (descuentoCupon > 0 && descuentoCupon < 100) desc = Math.round(subtotal * descuentoCupon / 100);
  else if (descuentoCupon >= 100) desc = Math.min(descuentoCupon, subtotal);

  msg += "\nSubtotal: " + formatPrice(subtotal) + "\n";
  if (envio > 0) msg += "Envio: " + formatPrice(envio) + "\n";
  if (desc > 0) msg += "Descuento: -" + formatPrice(desc) + "\n";
  msg += "*Total: " + formatPrice(subtotal + envio - desc) + "*\n";

  if (formState.entrega === "retiro") msg += "\nRetiro en local";
  else msg += "\nEnvio a: " + document.getElementById("inputDireccion").value.trim();

  msg += "\nPago: " + (formState.pago === "efectivo" ? "Efectivo" : formState.pago === "mp" ? "MercadoPago" : "Transferencia");
  if (formState.pago === "transferencia") msg += "\nAlias: " + window.SITE_CONFIG.alias;
  if (obs) msg += "\n\nObs: " + obs;

  window.open("https://wa.me/" + window.SITE_CONFIG.whatsapp + "?text=" + encodeURIComponent(msg), "_blank");

  setTimeout(function() {
    clearCart();
    if (btn) {
      btn.disabled = false;
      btn.querySelector(".submit-icon").style.display = "";
      btn.querySelector(".submit-text").style.display = "";
      btn.querySelector(".submit-spinner").style.display = "none";
    }
    showToast("Pedido enviado");
    setTimeout(function() { window.location.href = "index.html"; }, 2000);
  }, 1500);
}

// ── INIT ──
document.addEventListener("DOMContentLoaded", function() {
  var path = window.location.pathname;
  if (path.endsWith("categoria.html") || path.includes("categoria.html")) {
    renderCategoria();
  } else if (path.endsWith("checkout.html") || path.includes("checkout.html")) {
    renderCheckout();
  } else {
    renderHome();
  }
  renderHoursPill();
  renderFooterInfo();
  renderClosedNotice();
  updateStickyCart();

  // override updateCartUI to also update sticky
  var orig = window.updateCartUI;
  if (orig) {
    window.updateCartUI = function() {
      orig();
      updateStickyCart();
    };
  }
});
