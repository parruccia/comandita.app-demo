var CART_KEY = "comanditas_cart";
var CART_LOMITOS_KEY = "comanditas_cart_lomitos";

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
  var drawer = document.getElementById("drawer");
  var overlay = document.getElementById("overlay");
  if (!drawer || !overlay) return;
  var isOpen = drawer.classList.contains("open");
  drawer.classList.toggle("open");
  overlay.classList.toggle("open");
  document.body.style.overflow = isOpen ? "" : "hidden";
  if (!isOpen) updateCartUI();
}

function showToast(html) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.innerHTML = html;
  t.classList.add("show");
  var dur = Math.max(1200, Math.min(html.length * 25, 3000));
  setTimeout(function() { t.classList.remove("show"); }, dur);
}

function changeQty(btn, delta) {
  var wrap = btn.closest(".qty");
  var name = wrap.dataset.name;
  var price = parseInt(wrap.dataset.price);
  var size = wrap.dataset.size || "";
  var categoria = wrap.dataset.categoria || "";
  var cart = getCart();
  var current = cart[name] ? cart[name].qty : 0;
  var next = current + delta;
  if (next < 0) next = 0;
  if (next > 99) return;

  if (next === 0) {
    delete cart[name];
  } else {
    cart[name] = { name: name, size: size, price: price, qty: next, categoria: categoria };
  }
  saveCart(cart);

  var display = wrap.querySelector(".qty__display");
  if (display) display.textContent = next;
  updateCartUI();
  if (delta > 0) showToast("<span>" + name + "</span> agregado");
}

function agregarLomitoAlCarrito(producto, salsas, toppings) {
  var precioUnitario = producto.precio;
  for (var i = 0; i < salsas.length; i++) precioUnitario += salsas[i].precio;
  for (var j = 0; j < toppings.length; j++) precioUnitario += toppings[j].precio;

  var items = salsas.concat(toppings).map(function(x) { return x.nombre; }).sort();
  var clave = JSON.stringify({ nombre: producto.nombre, size: producto.tamano || "", items: items });

  var cart = getLomitosCart();
  var existe = false;
  for (var k = 0; k < cart.length; k++) {
    if (cart[k].clave === clave) {
      cart[k].qty += 1;
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
  showToast("<span>" + producto.nombre + "</span> agregado");
}

function removeFromLomitos(index) {
  var cart = getLomitosCart();
  if (cart[index]) {
    var name = cart[index].nombre;
    cart.splice(index, 1);
    saveLomitosCart(cart);
    updateCartUI();
    showToast("<span>" + name + "</span> eliminado");
  }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  localStorage.removeItem(CART_LOMITOS_KEY);
  updateCartUI();
}

function getCartCount() {
  var c = getCart();
  var l = getLomitosCart();
  var count = 0;
  for (var k in c) count += c[k].qty;
  for (var i = 0; i < l.length; i++) count += l[i].qty;
  return count;
}

function getCartTotal() {
  var c = getCart();
  var l = getLomitosCart();
  var total = 0;
  for (var k in c) total += c[k].price * c[k].qty;
  for (var i = 0; i < l.length; i++) total += l[i].precioUnitario * l[i].qty;
  return total;
}

function updateCartUI() {
  var count = getCartCount();
  var total = getCartTotal();

  var badge = document.getElementById("cartBadge");
  var totalEl = document.getElementById("cartTotal");
  var drawerTotal = document.getElementById("drawerTotal");
  var drawerItems = document.getElementById("drawerItems");
  var countEl = document.getElementById("cartCount");

  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("visible", count > 0);
  }
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (drawerTotal) drawerTotal.textContent = formatPrice(total);
  if (countEl) countEl.textContent = count + (count === 1 ? " item" : " items");

  if (drawerItems) {
    var html = "";
    var lomitos = getLomitosCart();
    var cart = getCart();

    for (var i = 0; i < lomitos.length; i++) {
      var l = lomitos[i];
      html += '<div class="drawer-item">' +
        '<div class="drawer-item__info">' +
        '<div class="drawer-item__name">' + l.nombre +
        ' <span class="drawer-item__qty">x' + l.qty + '</span></div>';
      if (l.salsas && l.salsas.length > 0) {
        html += '<div class="drawer-item__detail">Salsas: ' +
          l.salsas.map(function(s) { return s.nombre; }).join(", ") + '</div>';
      }
      if (l.toppings && l.toppings.length > 0) {
        html += '<div class="drawer-item__detail">Toppings: ' +
          l.toppings.map(function(t) { return t.nombre; }).join(", ") + '</div>';
      }
      html += '<div class="drawer-item__price">' + formatPrice(l.precioUnitario * l.qty) + '</div>' +
        '</div>' +
        '<button class="drawer-item__remove" onclick="removeFromLomitos(' + i + ')" aria-label="Eliminar">&#10005;</button>' +
        '</div>';
    }

    for (var k in cart) {
      var item = cart[k];
      html += '<div class="drawer-item">' +
        '<div class="drawer-item__info">' +
        '<div class="drawer-item__name">' + item.name +
        ' <span class="drawer-item__qty">x' + item.qty + '</span></div>' +
        '<div class="drawer-item__price">' + formatPrice(item.price * item.qty) + '</div>' +
        '</div>' +
        '<button class="drawer-item__remove" onclick="removeFromCart(\'' + k.replace(/'/g, "\\'") + '\')" aria-label="Eliminar">&#10005;</button>' +
        '</div>';
    }

    if (count === 0) {
      html = '<div class="drawer-empty">Tu carrito está vacío</div>';
    }

    drawerItems.innerHTML = html;
  }

  document.querySelectorAll(".qty").forEach(function(wrap) {
    var name = wrap.dataset.name;
    var c = getCart();
    var display = wrap.querySelector(".qty__display");
    if (display && c[name]) display.textContent = c[name].qty;
    else if (display) display.textContent = 0;
  });
}

function removeFromCart(name) {
  var cart = getCart();
  delete cart[name];
  saveCart(cart);
  updateCartUI();
  showToast("<span>" + name + "</span> eliminado");
}

function handleCheckout() {
  if (getCartCount() === 0) {
    showToast("El carrito está vacío");
    return;
  }
  window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", function() {
  updateCartUI();
});
