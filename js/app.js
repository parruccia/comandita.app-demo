// ─────────────────────────────────────────
// Comanditas Demo — app.js
// ─────────────────────────────────────────

// ── GLOBAL STATE (centralizado) ──
const AppState = {
  categoriaActual: null,
  modalProducto: null,
  modalSalsas: [],
  modalToppings: [],
  formState: { entrega: null, pago: null },
  descuentoCupon: 0
};

// ── UTILIDADES ──
function copiarAlPortapapeles(texto, mensajeToast) {
  const notificar = () => showToast(mensajeToast);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(texto).then(notificar);
  } else {
    const tmp = document.createElement("textarea");
    tmp.value = texto;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
    notificar();
  }
}

// ── HOURS CHECK (demo always open) ──
function estaAbierto() {
  return true;
}

function renderHoursPill() {
  const pill = document.getElementById("hoursPill");
  if (!pill) return;
  const abierto = estaAbierto();
  pill.className = "hours-pill " + (abierto ? "open" : "closed");
  pill.textContent = abierto ? "Abierto ahora" : "Cerrado";
}

function renderFooterInfo() {
  const dir = document.getElementById("footerDireccion");
  const hor = document.getElementById("footerHorarios");
  const ig = document.getElementById("footerInstagram");
  if (dir) dir.textContent = window.SITE_CONFIG.direccion;
  if (hor) hor.textContent = "Lun - Sáb 12:00 - 23:00";
  if (ig) ig.href = window.SITE_CONFIG.instagram;
}

function renderClosedNotice() {
  const notice = document.getElementById("closedNotice");
  if (!notice) return;
  if (estaAbierto()) {
    notice.classList.remove("visible");
    return;
  }
  notice.classList.add("visible");
  const hor = document.getElementById("footerHorarios");
  const h = window.SITE_CONFIG.horarios;
  const now = new Date();
  const tomorrow = (now.getDay() + 1) % 7;
  const nextDay = h[tomorrow];
  let nextText = "Mañana a las 12:00";
  if (nextDay && !nextDay.cerrado && nextDay.abierto) nextText = "Mañana a las " + nextDay.abierto;
  notice.querySelector(".closed-notice__hours").textContent = "Abrimos " + nextText;
}

// ── CTA DE CONTACTO (WhatsApp del desarrollador) ──
function configurarContacto() {
  if (!window.CONTACTO) return;
  const base = "https://wa.me/" + window.CONTACTO.whatsapp + "?text=";
  document.querySelectorAll("[data-contacto]").forEach((el) => {
    const extra = el.getAttribute("data-contacto-extra") || "";
    el.setAttribute("href", base + encodeURIComponent(window.CONTACTO.mensaje + extra));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
}

function copiarLinkProducto(nombre) {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug") || "";
  const url = window.location.origin + window.location.pathname + "?slug=" + slug + "#" + encodeURIComponent(nombre);
  copiarAlPortapapeles(url, "Link copiado");
}

// ── HOME ──
function renderHome() {
  const grid = document.getElementById("gridCategorias");
  if (!grid) return;

  const cats = window.CATEGORIAS.filter((c) => c.visible_en_menu);
  cats.sort((a, b) => a.orden - b.orden);

  let html = "";
  for (const c of cats) {
    const count = window.PRODUCTOS.filter((p) => p.categoria === c.slug && !p.agotado).length;
    html += `<a href="categoria.html?slug=${c.slug}" class="card">
      <div class="card__thumb">
        <img src="${c.imagenThumb || c.imagen}" alt="${c.nombre}" loading="lazy" decoding="async" />
      </div>
      <div class="card__bar"></div>
      <div class="card__body">
        <div class="card__name">${c.nombre}</div>
        <div class="card__cta">${count} productos · Ver menú →</div>
      </div>
    </a>`;
  }
  grid.innerHTML = html;
}

// ── CATEGORY ──
function renderCategoria() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  if (!slug) { window.location.href = "index.html"; return; }

  AppState.categoriaActual = window.CATEGORIAS.find((c) => c.slug === slug) || null;
  if (!AppState.categoriaActual) { window.location.href = "index.html"; return; }
  const categoriaActual = AppState.categoriaActual;

  document.title = "Comanditas — " + categoriaActual.nombre;
  document.getElementById("pageTitle").textContent = categoriaActual.nombre;

  const heroImg = document.getElementById("categoryHeroImg");
  if (heroImg) {
    heroImg.src = categoriaActual.imagen;
    heroImg.alt = categoriaActual.nombre;
    heroImg.addEventListener("error", () => { heroImg.style.display = "none"; });
  }
  document.getElementById("categoryTitle").textContent = categoriaActual.nombre;

  const productos = window.PRODUCTOS.filter((p) => p.categoria === slug);
  productos.sort((a, b) => a.orden - b.orden);

  const list = document.getElementById("productsList");
  let html = "";

  for (const p of productos) {
    let badgeHtml = "";
    if (p.badge) {
      let cls = "badge--popular";
      if (p.badge === "Nuevo") cls = "badge--new";
      else if (p.badge === "Picante") cls = "badge--spicy";
      else if (p.badge === "Vegetariano") cls = "badge--veg";
      else if (p.badge === "Sin TACC") cls = "badge--gf";
      badgeHtml = `<span class="badge ${cls}">${p.badge}</span>`;
    }

    html += `<div class="product${p.agotado ? " product--agotado" : ""}">
      <div class="product__img-wrap"${p.agotado ? "" : ` data-lightbox-src="${p.imagen}" data-lightbox-name="${p.nombre}"`}>
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" decoding="async" />
        ${p.agotado ? '<div class="agotado-overlay"><span class="agotado-label">Agotado</span></div>' : ""}
      </div>
      <div class="product__body">
        <div class="product__name">${p.nombre}${badgeHtml}</div>
        <div class="product__desc">${p.descripcion}</div>
        <div class="product__footer">
          <div class="product__price">${p.agotado ? "" : formatPrice(p.precio)}</div>`;

    if (p.agotado) {
      html += '<span class="badge badge--soldout">No disponible</span>';
    } else if (categoriaActual.personalizable) {
      html += `<button class="add-btn" data-add-product="${p.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Agregar</button>`;
    } else {
      html += `<div class="qty" data-name="${p.nombre}" data-price="${p.precio}" data-categoria="${p.categoria}">
        <button data-change-qty="-1">-</button>
        <span class="qty__display">0</span>
        <button data-change-qty="1">+</button>
      </div>`;
    }

    if (!p.agotado) {
      html += `<button class="share-btn" data-share-name="${p.nombre}" title="Copiar link del producto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      </button>`;
    }

    html += '</div></div></div>';
  }

  list.innerHTML = html;
}

// ── LIGHTBOX ──
function abrirLightbox(src, nombre) {
  const lb = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");
  const nameEl = document.getElementById("lightboxName");
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
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("open");
  document.body.style.overflow = "";
  if (history.state && history.state.lightbox) history.back();
}

window.addEventListener("popstate", function() {
  const lb = document.getElementById("lightbox");
  if (lb && lb.classList.contains("open")) {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ── ESCAPE KEY ──
document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape") return;
  const lb = document.getElementById("lightbox");
  if (lb && lb.classList.contains("open")) { cerrarLightbox(); return; }
  const modal = document.getElementById("modalCustom");
  if (modal && modal.classList.contains("open")) { cerrarModal(); return; }
  const drawer = document.getElementById("drawer");
  if (drawer && drawer.classList.contains("open")) { toggleDrawer(); return; }
  const tp = document.getElementById("themePanel");
  if (tp && tp.classList.contains("open")) { togglePanelTemas(); return; }
});

// ── CUSTOMIZATION MODAL ──
function abrirModal(productId) {
  AppState.modalProducto = window.PRODUCTOS.find((p) => p.id === productId) || null;
  if (!AppState.modalProducto) return;
  const { modalProducto } = AppState;
  AppState.modalSalsas = [];
  AppState.modalToppings = [];

  document.getElementById("modalTitle").textContent = modalProducto.nombre;
  let html = "";
  const salsasIncluidas = modalProducto.salsas_incluidas || 0;

  html += '<div class="modal__section-title">Salsas' +
    (salsasIncluidas > 0 ? ' (' + salsasIncluidas + ' gratis)' : '') + '</div>';

  for (let j = 0; j < window.SALSAS.length; j++) {
    const s = window.SALSAS[j];
    AppState.modalSalsas.push({ nombre: s.nombre, precio: 0, qty: 0 });
    html += `<div class="modal__option"><div class="modal__option-info">
      <span class="modal__option-name">${s.nombre}</span>
      <span class="modal__option-price" id="salsaPrice${j}">${s.precio === 0 ? "Gratis" : "+" + formatPrice(s.precio)}</span></div>
      <div class="modal__qty-sm">
        <button data-change-salsa="${j}" data-delta="-1" data-precio="${s.precio}" data-free="${salsasIncluidas}">-</button>
        <span id="salsaQty${j}">0</span>
        <button data-change-salsa="${j}" data-delta="1" data-precio="${s.precio}" data-free="${salsasIncluidas}">+</button>
      </div></div>`;
  }

  const toppingsIncluidos = modalProducto.toppings_incluidos || 0;
  if (window.TOPPINGS.length > 0) {
    html += '<div class="modal__section-title">Toppings' +
      (toppingsIncluidos > 0 ? ' (' + toppingsIncluidos + ' gratis)' : '') + '</div>';
    for (let k = 0; k < window.TOPPINGS.length; k++) {
      const t = window.TOPPINGS[k];
      AppState.modalToppings.push({ nombre: t.nombre, precio: 0, qty: 0 });
      html += `<div class="modal__option"><div class="modal__option-info">
        <span class="modal__option-name">${t.nombre}</span>
        <span class="modal__option-price" id="toppingPrice${k}">${t.precio === 0 ? "Gratis" : "+" + formatPrice(t.precio)}</span></div>
        <div class="modal__qty-sm">
          <button data-change-topping="${k}" data-delta="-1" data-precio="${t.precio}" data-free="${toppingsIncluidos}">-</button>
          <span id="toppingQty${k}">0</span>
          <button data-change-topping="${k}" data-delta="1" data-precio="${t.precio}" data-free="${toppingsIncluidos}">+</button>
        </div></div>`;
    }
  }

  document.getElementById("modalBody").innerHTML = html;
  updateModalPrice();
  document.getElementById("modalOverlay").classList.add("open");
  document.getElementById("modalCustom").classList.add("open");
  document.body.style.overflow = "hidden";
}

function changeModalSalsa(index, delta, precioBase, freeCount) {
  const current = AppState.modalSalsas[index].qty + delta;
  if (current < 0 || current > 10) return;
  let totalQty = 0;
  for (let i = 0; i < AppState.modalSalsas.length; i++) totalQty += (i === index) ? current : AppState.modalSalsas[i].qty;
  if (totalQty > freeCount + 10) return;
  AppState.modalSalsas[index].qty = current;
  document.getElementById("salsaQty" + index).textContent = current;
  let allQty = 0;
  for (let j = 0; j < AppState.modalSalsas.length; j++) allQty += AppState.modalSalsas[j].qty;
  const free = Math.min(allQty, freeCount);
  for (let k = 0; k < AppState.modalSalsas.length; k++) {
    const s = window.SALSAS[k];
    const priceEl = document.getElementById("salsaPrice" + k);
    if (AppState.modalSalsas[k].qty === 0) {
      priceEl.textContent = s.precio === 0 ? 'Gratis' : '+' + formatPrice(s.precio);
      priceEl.className = 'modal__option-price';
      AppState.modalSalsas[k].precio = 0;
    } else {
      const freeSlots = Math.max(0, free - (allQty - AppState.modalSalsas[k].qty));
      if (freeSlots >= AppState.modalSalsas[k].qty) {
        priceEl.textContent = 'Gratis'; priceEl.className = 'modal__option-price free'; AppState.modalSalsas[k].precio = 0;
      } else {
        priceEl.textContent = '+' + formatPrice(s.precio); priceEl.className = 'modal__option-price'; AppState.modalSalsas[k].precio = s.precio;
      }
    }
  }
  updateModalPrice();
}

function changeModalTopping(index, delta, precioBase, freeCount) {
  const current = AppState.modalToppings[index].qty + delta;
  if (current < 0 || current > 10) return;
  let totalQty = 0;
  for (let i = 0; i < AppState.modalToppings.length; i++) totalQty += (i === index) ? current : AppState.modalToppings[i].qty;
  if (totalQty > freeCount + 10) return;
  AppState.modalToppings[index].qty = current;
  document.getElementById("toppingQty" + index).textContent = current;
  let allQty = 0;
  for (let j = 0; j < AppState.modalToppings.length; j++) allQty += AppState.modalToppings[j].qty;
  const free = Math.min(allQty, freeCount);
  for (let k = 0; k < AppState.modalToppings.length; k++) {
    const t = window.TOPPINGS[k];
    const priceEl = document.getElementById("toppingPrice" + k);
    if (AppState.modalToppings[k].qty === 0) {
      priceEl.textContent = t.precio === 0 ? 'Gratis' : '+' + formatPrice(t.precio);
      priceEl.className = 'modal__option-price'; AppState.modalToppings[k].precio = 0;
    } else {
      const freeSlots = Math.max(0, free - (allQty - AppState.modalToppings[k].qty));
      if (freeSlots >= AppState.modalToppings[k].qty) {
        priceEl.textContent = 'Gratis'; priceEl.className = 'modal__option-price free'; AppState.modalToppings[k].precio = 0;
      } else {
        priceEl.textContent = '+' + formatPrice(t.precio); priceEl.className = 'modal__option-price'; AppState.modalToppings[k].precio = t.precio;
      }
    }
  }
  updateModalPrice();
}

function updateModalPrice() {
  if (!AppState.modalProducto) return;
  let total = AppState.modalProducto.precio;
  for (let i = 0; i < AppState.modalSalsas.length; i++) total += AppState.modalSalsas[i].precio * AppState.modalSalsas[i].qty;
  for (let j = 0; j < AppState.modalToppings.length; j++) total += AppState.modalToppings[j].precio * AppState.modalToppings[j].qty;
  document.getElementById("modalPrice").textContent = formatPrice(total);
}

function confirmarModal() {
  if (!AppState.modalProducto) return;
  const activeSalsas = [], activeToppings = [];
  for (let i = 0; i < AppState.modalSalsas.length; i++)
    for (let n = 0; n < AppState.modalSalsas[i].qty; n++) activeSalsas.push({ nombre: AppState.modalSalsas[i].nombre, precio: AppState.modalSalsas[i].precio });
  for (let j = 0; j < AppState.modalToppings.length; j++)
    for (let n = 0; n < AppState.modalToppings[j].qty; n++) activeToppings.push({ nombre: AppState.modalToppings[j].nombre, precio: AppState.modalToppings[j].precio });
  agregarLomitoAlCarrito(AppState.modalProducto, activeSalsas, activeToppings);
  cerrarModal();
}

function cerrarModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.getElementById("modalCustom").classList.remove("open");
  document.body.style.overflow = "";
}

// ── CHECKOUT ──
function seleccionar(grupo, valor, el) {
  AppState.formState[grupo] = valor;
  const btns = el.parentElement.querySelectorAll(".option-btn");
  for (const b of btns) b.classList.remove("selected");
  el.classList.add("selected");

  if (grupo === "entrega") {
    const campoDir = document.getElementById("campoDireccion");
    if (campoDir) campoDir.style.display = valor === "envio" ? "block" : "none";
    renderCheckout();
  }
  if (grupo === "pago") {
    const campoTrans = document.getElementById("campoTransferencia");
    if (campoTrans) campoTrans.style.display = valor === "transferencia" ? "block" : "none";
  }
}

function copiarAlias() {
  copiarAlPortapapeles(window.SITE_CONFIG.alias, "Alias copiado");
}

function aplicarCuponDemo() {
  const input = document.getElementById("inputCupon");
  const msg = document.getElementById("cuponMsg");
  if (!input || !msg) return;
  const codigo = input.value.trim().toUpperCase();
  if (!codigo) { msg.textContent = "Ingresá un código"; msg.className = "cupon-msg error"; return; }
  if (codigo === "COMANDITA10") {
    AppState.descuentoCupon = 10;
    msg.textContent = "¡10% de descuento aplicado!"; msg.className = "cupon-msg ok";
  } else if (codigo === "COMANDITA500") {
    AppState.descuentoCupon = 500;
    msg.textContent = "¡$500 de descuento aplicado!"; msg.className = "cupon-msg ok";
  } else {
    AppState.descuentoCupon = 0;
    msg.textContent = "Cupón no válido (probá COMANDITA10 o COMANDITA500)"; msg.className = "cupon-msg error";
  }
  renderCheckout();
}

function calcularEnvio(subtotal) {
  if (!AppState.formState.entrega || AppState.formState.entrega === "retiro") return 0;
  if (subtotal >= window.SITE_CONFIG.envio_gratis_desde) return 0;
  return window.SITE_CONFIG.envio_costo;
}

function renderCheckout() {
  const items = document.getElementById("resumenItems");
  if (!items) return;
  const cart = getCart(), lomitos = getLomitosCart();
  let html = "", empty = true;

  for (const l of lomitos) {
    empty = false;
    html += `<div class="resumen__item"><div class="resumen__item-name">${l.nombre}<span class="resumen__item-qty">x${l.qty}</span>`;
    if (l.salsas && l.salsas.length > 0) html += `<div class="resumen__item-detail">Salsas: ${l.salsas.map((s) => s.nombre).join(", ")}</div>`;
    if (l.toppings && l.toppings.length > 0) html += `<div class="resumen__item-detail">Toppings: ${l.toppings.map((t) => t.nombre).join(", ")}</div>`;
    html += `</div><div class="resumen__item-price">${formatPrice(l.precioUnitario * l.qty)}</div></div>`;
  }
  for (const k in cart) {
    empty = false;
    const item = cart[k];
    html += `<div class="resumen__item"><div class="resumen__item-name">${item.name}<span class="resumen__item-qty">x${item.qty}</span></div><div class="resumen__item-price">${formatPrice(item.price * item.qty)}</div></div>`;
  }
  if (empty) html = '<div class="resumen__empty">No hay productos en el carrito</div>';
  items.innerHTML = html;

  const subtotal = getCartTotal();
  const envio = calcularEnvio(subtotal);
  let desc = 0;
  if (AppState.descuentoCupon > 0 && AppState.descuentoCupon < 100) desc = Math.round(subtotal * AppState.descuentoCupon / 100);
  else if (AppState.descuentoCupon >= 100) desc = Math.min(AppState.descuentoCupon, subtotal);

  const envioRow = document.getElementById("resumenEnvioRow");
  const envioLabel = document.getElementById("resumenEnvioLabel");
  const envioVal = document.getElementById("resumenEnvio");
  if (AppState.formState.entrega) {
    envioRow.style.display = "flex";
    if (AppState.formState.entrega === "retiro") {
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

  const descRow = document.getElementById("resumenDescuentoRow");
  if (desc > 0) { descRow.style.display = "flex"; document.getElementById("resumenDescuento").textContent = "-" + formatPrice(desc); }
  else descRow.style.display = "none";

  document.getElementById("resumenSubtotal").textContent = formatPrice(subtotal);
  document.getElementById("resumenTotal").textContent = formatPrice(subtotal + envio - desc);

  const tiempo = document.getElementById("resumenTiempo");
  if (tiempo) {
    if (AppState.formState.entrega === "retiro") tiempo.innerHTML = "Listo en <strong>~15 min</strong>";
    else if (AppState.formState.entrega === "envio") tiempo.innerHTML = "Llega en <strong>~" + window.SITE_CONFIG.tiempo_estimado + " min</strong>";
    else tiempo.innerHTML = "";
  }

  // autofill
  const saved = JSON.parse(localStorage.getItem("comanditas_customer") || "null");
  if (saved) {
    if (saved.nombre && !document.getElementById("inputNombre").value) document.getElementById("inputNombre").value = saved.nombre;
    if (saved.telefono && !document.getElementById("inputTelefono").value) document.getElementById("inputTelefono").value = saved.telefono;
    if (saved.direccion && !document.getElementById("inputDireccion").value) document.getElementById("inputDireccion").value = saved.direccion;
  }
}

function enviarPedido() {
  const btn = document.getElementById("submitBtn");
  if (btn && btn.disabled) return;

  const nombre = document.getElementById("inputNombre").value.trim();
  const telefono = document.getElementById("inputTelefono").value.trim();
  const obs = document.getElementById("inputObs").value.trim();

  if (!nombre) { showToast("Poné tu nombre"); return; }
  if (!telefono || !/^\d{6,}$/.test(telefono.replace(/[\s\-\+]/g, ""))) { showToast("Poné un teléfono válido"); return; }
  if (!AppState.formState.entrega) { showToast("Elegí retiro o envío"); return; }
  if (AppState.formState.entrega === "envio" && !document.getElementById("inputDireccion").value.trim()) { showToast("Poné tu dirección"); return; }
  if (!AppState.formState.pago) { showToast("Elegí el método de pago"); return; }
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

  const now = new Date();
  const fecha = now.toLocaleDateString("es-AR") + " - " + now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  let msg = "*Pedido — Comanditas*\n\n";
  msg += `*${nombre}*\n${fecha}\nTel: ${telefono}\n\n`;

  const cart = getCart(), lomitos = getLomitosCart();
  for (const l of lomitos) {
    msg += `${l.qty}x ${l.nombre}`;
    if (l.size) msg += ` (${l.size})`;
    msg += ` — ${formatPrice(l.precioUnitario * l.qty)}\n`;
    const extras = [];
    for (const s of l.salsas) extras.push(s.nombre);
    for (const t of l.toppings) extras.push(t.nombre);
    if (extras.length > 0) msg += "  → " + extras.join(", ") + "\n";
  }
  for (const k in cart) {
    const item = cart[k];
    msg += `${item.qty}x ${item.name} — ${formatPrice(item.price * item.qty)}\n`;
  }

  const subtotal = getCartTotal();
  const envio = calcularEnvio(subtotal);
  let desc = 0;
  if (AppState.descuentoCupon > 0 && AppState.descuentoCupon < 100) desc = Math.round(subtotal * AppState.descuentoCupon / 100);
  else if (AppState.descuentoCupon >= 100) desc = Math.min(AppState.descuentoCupon, subtotal);

  msg += "\nSubtotal: " + formatPrice(subtotal) + "\n";
  if (envio > 0) msg += "Envio: " + formatPrice(envio) + "\n";
  if (desc > 0) msg += "Descuento: -" + formatPrice(desc) + "\n";
  msg += "*Total: " + formatPrice(subtotal + envio - desc) + "*\n";

  if (AppState.formState.entrega === "retiro") msg += "\nRetiro en local";
  else msg += "\nEnvio a: " + document.getElementById("inputDireccion").value.trim();

  msg += "\nPago: " + (AppState.formState.pago === "efectivo" ? "Efectivo" : AppState.formState.pago === "mp" ? "MercadoPago" : "Transferencia");
  if (AppState.formState.pago === "transferencia") msg += "\nAlias: " + window.SITE_CONFIG.alias;
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

// ── EVENT HANDLING (delegación) ──
function bindAppEvents() {
  // Productos y modal (categoría)
  const productsList = document.getElementById("productsList");
  if (productsList) {
    productsList.addEventListener("click", (e) => {
      const imgWrap = e.target.closest("[data-lightbox-src]");
      if (imgWrap) {
        abrirLightbox(imgWrap.dataset.lightboxSrc, imgWrap.dataset.lightboxName);
        return;
      }
      const addBtn = e.target.closest("[data-add-product]");
      if (addBtn) {
        abrirModal(parseInt(addBtn.dataset.addProduct));
        return;
      }
      const shareBtn = e.target.closest("[data-share-name]");
      if (shareBtn) {
        copiarLinkProducto(shareBtn.dataset.shareName);
        return;
      }
    });
  }

  // Modal de personalización: salsas y toppings
  const modalBody = document.getElementById("modalBody");
  if (modalBody) {
    modalBody.addEventListener("click", (e) => {
      const salsaBtn = e.target.closest("[data-change-salsa]");
      if (salsaBtn) {
        changeModalSalsa(parseInt(salsaBtn.dataset.changeSalsa), parseInt(salsaBtn.dataset.delta), parseInt(salsaBtn.dataset.precio), parseInt(salsaBtn.dataset.free));
        return;
      }
      const toppingBtn = e.target.closest("[data-change-topping]");
      if (toppingBtn) {
        changeModalTopping(parseInt(toppingBtn.dataset.changeTopping), parseInt(toppingBtn.dataset.delta), parseInt(toppingBtn.dataset.precio), parseInt(toppingBtn.dataset.free));
        return;
      }
    });
  }

  // Botón confirmar del modal
  const modalConfirmBtn = document.getElementById("modalConfirmBtn");
  if (modalConfirmBtn) modalConfirmBtn.addEventListener("click", confirmarModal);

  // Cerrar modal
  const modalOverlay = document.getElementById("modalOverlay");
  if (modalOverlay) modalOverlay.addEventListener("click", cerrarModal);
  const modalClose = document.querySelector(".modal__close");
  if (modalClose) modalClose.addEventListener("click", cerrarModal);

  // Lightbox
  const lightbox = document.getElementById("lightbox");
  if (lightbox) lightbox.addEventListener("click", cerrarLightbox);

  // Scroll al menú (home)
  const scrollToMenu = () => document.getElementById("menuSection").scrollIntoView({ behavior: "smooth" });
  document.querySelectorAll(".hero__cta, .cta-btn, .final-cta__btn--primary").forEach((btn) => btn.addEventListener("click", scrollToMenu));

  // Checkout: opciones de entrega/pago
  const optionsEntrega = document.getElementById("optionsEntrega");
  if (optionsEntrega) optionsEntrega.addEventListener("click", (e) => bindOptionClick(e, optionsEntrega));
  const optionsPago = document.getElementById("optionsPago");
  if (optionsPago) optionsPago.addEventListener("click", (e) => bindOptionClick(e, optionsPago));

  // Checkout: cupón, alias y envío
  const cuponBtn = document.querySelector(".cupon-btn");
  if (cuponBtn) cuponBtn.addEventListener("click", aplicarCuponDemo);
  const copyBtn = document.querySelector(".copy-btn");
  if (copyBtn) copyBtn.addEventListener("click", copiarAlias);
  const submitBtn = document.getElementById("submitBtn");
  if (submitBtn) submitBtn.addEventListener("click", enviarPedido);
}

function bindOptionClick(e, container) {
  const el = e.target.closest("[data-grupo]");
  if (!el) return;
  seleccionar(el.dataset.grupo, el.dataset.valor, el);
}

// ── INIT ──
document.addEventListener("DOMContentLoaded", function() {
  const path = window.location.pathname;
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
  bindAppEvents();
  configurarContacto();
});
