// ─────────────────────────────────────────
// Comanditas Demo — admin.js (mock panel)
// ─────────────────────────────────────────

function estaAbierto() {
  return true;
}

function formatPrice(n) { return "$" + n.toLocaleString("es-AR"); }

function renderAdmin() {
  var pill = document.getElementById("adminHours");
  var abierto = estaAbierto();
  pill.className = "admin-pill " + (abierto ? "open" : "closed");
  pill.textContent = abierto ? "Abierto" : "Cerrado";

  var agotados = 0;
  for (var i = 0; i < window.PRODUCTOS.length; i++) {
    if (window.PRODUCTOS[i].agotado) agotados++;
  }
  var count = Math.floor(Math.random() * 8) + 5;
  var total = (Math.floor(Math.random() * 40) + 20) * 1000;
  document.getElementById("statPedidos").textContent = count;
  document.getElementById("statFacturacion").textContent = formatPrice(total);
  document.getElementById("statProductos").textContent = window.PRODUCTOS.length;
  document.getElementById("statAgotados").textContent = agotados;

  var names = ["Martín G.", "Lucía P.", "Juan C.", "Sofía R.", "Carlos M.", "Ana L.", "Diego F.", "Camila B."];
  var items = [];
  for (var j = 0; j < count; j++) {
    items.push({
      name: names[j % names.length],
      total: Math.floor(Math.random() * 15000) + 3000,
      detail: Math.floor(Math.random() * 4) + 1 + " productos",
      time: Math.floor(Math.random() * 50) + 5 + " min",
      status: Math.random() > 0.4 ? "new" : "preparing"
    });
  }
  var tableHtml = "";
  for (var k = 0; k < items.length; k++) {
    var o = items[k];
    tableHtml += '<div class="order-row">' +
      '<div class="order-row__left">' +
      '<span class="order-row__name">' + o.name + '</span>' +
      '<span class="order-row__detail">' + o.detail + '</span>' +
      '</div>' +
      '<div class="order-row__right">' +
      '<span class="order-row__total">' + formatPrice(o.total) + '</span>' +
      '<span class="order-row__badge order-row__badge--' + o.status + '">' +
      (o.status === "new" ? "Nuevo" : "Preparando") + '</span>' +
      '<span class="order-row__time">hace ' + o.time + '</span>' +
      '</div>' +
      '</div>';
  }
  document.getElementById("orderTable").innerHTML = tableHtml;

  renderMenuList();
}

function renderMenuList() {
  var menuHtml = "";
  for (var m = 0; m < window.PRODUCTOS.length; m++) {
    var p = window.PRODUCTOS[m];
    var cat = "";
    for (var c = 0; c < window.CATEGORIAS.length; c++) {
      if (window.CATEGORIAS[c].slug === p.categoria) { cat = window.CATEGORIAS[c].nombre; break; }
    }
    menuHtml += '<div class="menu-item' + (p.agotado ? ' menu-item--agotado' : '') + '" id="menuItem' + p.id + '">' +
      '<div class="menu-item__left">' +
      '<img class="menu-item__img" src="' + p.imagen + '" alt="" loading="lazy" onerror="this.style.display=\'none\'" />' +
      '<div><div class="menu-item__name">' + p.nombre + (p.agotado ? ' <span class="menu-item__agotado-tag">Agotado</span>' : '') + '</div><div class="menu-item__cat">' + cat + '</div></div>' +
      '</div>' +
      '<div class="menu-item__right">' +
      '<span class="menu-item__price">' + formatPrice(p.precio) + '</span>' +
      '<label class="toggle">' +
      '<input type="checkbox" ' + (p.agotado ? '' : 'checked') + ' onchange="handleToggleAgotado(' + p.id + ', this)" />' +
      '<span class="toggle__track"></span>' +
      '<span class="toggle__knob"></span>' +
      '</label>' +
      '</div>' +
      '</div>';
  }
  document.getElementById("menuList").innerHTML = menuHtml;
}

function handleToggleAgotado(productoId, checkbox) {
  var newState = toggleAgotado(productoId);
  var agotados = 0;
  for (var i = 0; i < window.PRODUCTOS.length; i++) {
    if (window.PRODUCTOS[i].agotado) agotados++;
  }
  document.getElementById("statAgotados").textContent = agotados;
  renderMenuList();
}

document.addEventListener("DOMContentLoaded", function() {
  renderAdmin();
});