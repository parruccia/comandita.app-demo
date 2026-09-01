const CART_KEY = "comanditas_cart";
const CART_LOMITOS_KEY = "comanditas_cart_lomitos";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}

function getLomitosCart() {
  try { return JSON.parse(localStorage.getItem(CART_LOMITOS_KEY)) || []; }
  catch (e) { return []; }
}

function saveLomitosCart(c) {
  localStorage.setItem(CART_LOMITOS_KEY, JSON.stringify(c));
}

function formatPrice(n) {
  return "$" + n.toLocaleString("es-AR");
}

function toggleDrawer() {
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");
  if (!drawer || !overlay) return;
  const isOpen = drawer.classList.contains("open");
  drawer.classList.toggle("open");
  overlay.classList.toggle("open");
  document.body.style.overflow = isOpen ? "" : "hidden";
  if (!isOpen) updateCartUI();
}

function showToast(html) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerHTML = html;
  t.classList.add("show");
  const dur = Math.max(1200, Math.min(html.length * 25, 3000));
  setTimeout(() => t.classList.remove("show"), dur);
}

function changeQty(btn, delta) {
  const wrap = btn.closest(".qty");
  const name = wrap.dataset.name;
  const price = parseInt(wrap.dataset.price);
  const size = wrap.dataset.size || "";
  const categoria = wrap.dataset.categoria || "";
  const cart = getCart();
  const current = cart[name] ? cart[name].qty : 0;
  let next = current + delta;
  if (next < 0) next = 0;
  if (next > 99) return;

  if (next === 0) {
    delete cart[name];
  } else {
    cart[name] = { name: name, size: size, price: price, qty: next, categoria: categoria };
  }
  saveCart(cart);

  const display = wrap.querySelector(".qty__display");
  if (display) display.textContent = next;
  updateCartUI();
  if (delta > 0) showToast(`<span>${name}</span> agregado`);
}

function agregarLomitoAlCarrito(producto, salsas, toppings) {
  let precioUnitario = producto.precio;
  for (const s of salsas) precioUnitario += s.precio;
  for (const t of toppings) precioUnitario += t.precio;

  const items = salsas.concat(toppings).map((x) => x.nombre).sort();
  const clave = JSON.stringify({ nombre: producto.nombre, size: producto.tamano || "", items: items });

  const cart = getLomitosCart();
  let existe = false;
  for (const item of cart) {
    if (item.clave === clave) {
      item.qty += 1;
      existe = true;
      break;
    }
  }
  if (!existe) {
    cart.push({
      id: producto.id,
      clave: clave,
      nombre: producto.nombre,
      size: producto.tamano || "",
      precioUnitario: precioUnitario,
      salsas: salsas,
      toppings: toppings,
      qty: 1
    });
  }
  saveLomitosCart(cart);
  updateCartUI();
  showToast(`<span>${producto.nombre}</span> agregado`);
}

function removeFromLomitos(index) {
  const cart = getLomitosCart();
  if (cart[index]) {
    const name = cart[index].nombre;
    cart.splice(index, 1);
    saveLomitosCart(cart);
    updateCartUI();
    showToast(`<span>${name}</span> eliminado`);
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CART_LOMITOS_KEY);
  updateCartUI();
}

function getCartCount() {
  const c = getCart();
  const l = getLomitosCart();
  let count = 0;
  for (const k in c) count += c[k].qty;
  for (const item of l) count += item.qty;
  return count;
}

function getCartTotal() {
  const c = getCart();
  const l = getLomitosCart();
  let total = 0;
  for (const k in c) total += c[k].price * c[k].qty;
  for (const item of l) total += item.precioUnitario * item.qty;
  return total;
}

function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  const badge = document.getElementById("cartBadge");
  const totalEl = document.getElementById("cartTotal");
  const drawerTotal = document.getElementById("drawerTotal");
  const drawerItems = document.getElementById("drawerItems");
  const countEl = document.getElementById("cartCount");

  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("visible", count > 0);
  }
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (drawerTotal) drawerTotal.textContent = formatPrice(total);
  if (countEl) countEl.textContent = count + (count === 1 ? " item" : " items");

  if (drawerItems) {
    let html = "";
    const lomitos = getLomitosCart();
    const cart = getCart();

    for (let i = 0; i < lomitos.length; i++) {
      const l = lomitos[i];
      let itemHtml = `<div class="drawer-item">
        <div class="drawer-item__info">
          <div class="drawer-item__name">${l.nombre} <span class="drawer-item__qty">x${l.qty}</span></div>`;
      if (l.salsas && l.salsas.length > 0) {
        itemHtml += `<div class="drawer-item__detail">Salsas: ${l.salsas.map((s) => s.nombre).join(", ")}</div>`;
      }
      if (l.toppings && l.toppings.length > 0) {
        itemHtml += `<div class="drawer-item__detail">Toppings: ${l.toppings.map((t) => t.nombre).join(", ")}</div>`;
      }
      itemHtml += `<div class="drawer-item__price">${formatPrice(l.precioUnitario * l.qty)}</div>
        </div>
        <button class="drawer-item__remove" data-remove-lomitos="${i}" aria-label="Eliminar">&#10005;</button>
      </div>`;
      html += itemHtml;
    }

    for (const k in cart) {
      const item = cart[k];
      html += `<div class="drawer-item">
        <div class="drawer-item__info">
          <div class="drawer-item__name">${item.name} <span class="drawer-item__qty">x${item.qty}</span></div>
          <div class="drawer-item__price">${formatPrice(item.price * item.qty)}</div>
        </div>
        <button class="drawer-item__remove" data-remove-cart="${k.replace(/'/g, "&apos;")}" aria-label="Eliminar">&#10005;</button>
      </div>`;
    }

    if (count === 0) {
      html = '<div class="drawer-empty">Tu carrito está vacío</div>';
    }

    drawerItems.innerHTML = html;
  }

  document.querySelectorAll(".qty").forEach((wrap) => {
    const name = wrap.dataset.name;
    const c = getCart();
    const display = wrap.querySelector(".qty__display");
    if (display && c[name]) display.textContent = c[name].qty;
    else if (display) display.textContent = 0;
  });
}

function removeFromCart(name) {
  const cart = getCart();
  delete cart[name];
  saveCart(cart);
  updateCartUI();
  showToast(`<span>${name}</span> eliminado`);
}

function handleCheckout() {
  if (getCartCount() === 0) {
    showToast("El carrito está vacío");
    return;
  }
  window.location.href = "checkout.html";
}

function bindCartEvents() {
  // Botones estáticos que abren/cierran el drawer
  document.querySelectorAll(".cart-btn, #overlay, .drawer__close").forEach((el) => {
    el.addEventListener("click", toggleDrawer);
  });
  const drawerBtn = document.querySelector(".drawer__btn");
  if (drawerBtn) drawerBtn.addEventListener("click", handleCheckout);

  // Ítems del carrito (dinámicos)
  const drawerItems = document.getElementById("drawerItems");
  if (drawerItems) {
    drawerItems.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-lomitos], [data-remove-cart]");
      if (!btn) return;
      if (btn.hasAttribute("data-remove-lomitos")) {
        removeFromLomitos(parseInt(btn.dataset.removeLomitos));
      } else {
        removeFromCart(btn.dataset.removeCart);
      }
    });
  }

  const productsList = document.getElementById("productsList");
  if (productsList) {
    productsList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-change-qty]");
      if (!btn) return;
      changeQty(btn, parseInt(btn.dataset.changeQty));
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  bindCartEvents();
  updateCartUI();
});
