// ─────────────────────────────────────────
// Comanditas Demo — admin.js (mock panel)
// ─────────────────────────────────────────

function estaAbierto() {
  return true;
}

function formatPrice(n) { return "$" + n.toLocaleString("es-AR"); }

function renderAdmin() {
  let agotados = 0;
  for (const p of window.PRODUCTOS) {
    if (p.agotado) agotados++;
  }
  const count = Math.floor(Math.random() * 8) + 5;
  const total = (Math.floor(Math.random() * 40) + 20) * 1000;
  document.getElementById("statPedidos").textContent = count;
  document.getElementById("statFacturacion").textContent = formatPrice(total);
  document.getElementById("statProductos").textContent = window.PRODUCTOS.length;
  document.getElementById("statAgotados").textContent = agotados;

  const names = ["Martín G.", "Lucía P.", "Juan C.", "Sofía R.", "Carlos M.", "Ana L.", "Diego F.", "Camila B."];
  const items = [];
  for (let j = 0; j < count; j++) {
    items.push({
      name: names[j % names.length],
      total: Math.floor(Math.random() * 15000) + 3000,
      detail: Math.floor(Math.random() * 4) + 1 + " productos",
      time: Math.floor(Math.random() * 50) + 5 + " min",
      status: Math.random() > 0.4 ? "new" : "preparing"
    });
  }
  let tableHtml = "";
  for (const o of items) {
    tableHtml += `<div class="order-row">
      <div class="order-row__left">
        <span class="order-row__name">${o.name}</span>
        <span class="order-row__detail">${o.detail}</span>
      </div>
      <div class="order-row__right">
        <span class="order-row__total">${formatPrice(o.total)}</span>
        <span class="order-row__badge order-row__badge--${o.status}">${o.status === "new" ? "Nuevo" : "Preparando"}</span>
        <span class="order-row__time">hace ${o.time}</span>
      </div>
    </div>`;
  }
  document.getElementById("orderTable").innerHTML = tableHtml;

  renderMenuList();
}

function renderMenuList() {
  let menuHtml = "";
  for (const p of window.PRODUCTOS) {
    let cat = "";
    for (const c of window.CATEGORIAS) {
      if (c.slug === p.categoria) { cat = c.nombre; break; }
    }
    menuHtml += `<div class="menu-item${p.agotado ? " menu-item--agotado" : ""}" id="menuItem${p.id}">
      <div class="menu-item__left">
        <img class="menu-item__img" src="${p.imagen}" alt="" loading="lazy" />
        <div><div class="menu-item__name">${p.nombre}${p.agotado ? ' <span class="menu-item__agotado-tag">Agotado</span>' : ""}</div><div class="menu-item__cat">${cat}</div></div>
      </div>
      <div class="menu-item__right">
        <span class="menu-item__price">${formatPrice(p.precio)}</span>
        <label class="toggle">
          <input type="checkbox" data-product-id="${p.id}" ${p.agotado ? "" : "checked"} />
          <span class="toggle__track"></span>
          <span class="toggle__knob"></span>
        </label>
      </div>
    </div>`;
  }
  document.getElementById("menuList").innerHTML = menuHtml;
  // Ocultar imágenes que fallen al cargar (sin JS inline)
  document.querySelectorAll(".menu-item__img").forEach((img) => {
    img.addEventListener("error", () => { img.style.display = "none"; });
  });
}

function renderMenuAgotados() {
  const statAgotados = document.getElementById("statAgotados");
  if (!statAgotados) return;
  let agotados = 0;
  for (const p of window.PRODUCTOS) {
    if (p.agotado) agotados++;
  }
  statAgotados.textContent = agotados;
  renderMenuList();
}

function handleToggleAgotado(productoId) {
  toggleAgotado(productoId);
  renderMenuAgotados();
}

// ── GRÁFICOS (Chart.js, datos mock) ──
let adminCharts = [];

function chartOpts({ showLegend = true, money = false, cutout = null, indexAxis = null } = {}) {
  const ticksColor = "rgba(232,228,222,0.55)";
  const gridColor = "rgba(255,255,255,0.06)";
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "bottom",
        labels: { color: "rgba(232,228,222,0.8)", boxWidth: 10, boxHeight: 10, boxPadding: 6 }
      },
      tooltip: {
        backgroundColor: "#1C1C1C",
        padding: 10,
        cornerRadius: 8,
        titleColor: "#E8E4DE",
        bodyColor: "#E8E4DE",
        callbacks: {
          label: function(ctx) {
            const v = ctx.raw;
            return " " + (money ? "$" + Number(v).toLocaleString("es-AR") : v);
          }
        }
      }
    },
    scales: {}
  };
  if (indexAxis) opts.indexAxis = indexAxis;
  if (cutout) opts.cutout = cutout;
  if (!showLegend) {
    opts.scales.x = { grid: { color: gridColor }, ticks: { color: ticksColor } };
    opts.scales.y = { grid: { color: gridColor }, ticks: { color: ticksColor }, beginAtZero: true };
  }
  return opts;
}

function safeChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === "undefined") return;
  const existing = adminCharts.find((c) => c.id === id);
  if (existing) existing.chart.destroy();
  adminCharts = adminCharts.filter((c) => c.id !== id);
  adminCharts.push({ id: id, chart: new Chart(canvas, config) });
}

function catColor(nombre) {
  const map = {
    "Platos principales": "#25D366",
    "Guarniciones": "#FF8C42",
    "Snacks": "#5B9BD5",
    "Bebidas": "#7E57C2",
    "Postres": "#EC6B8A"
  };
  return map[nombre] || "#25D366";
}

function renderCharts() {
  if (typeof Chart === "undefined") return;

  // Ventas de la semana (linea)
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const ventas = dias.map(() => Math.floor(Math.random() * 40) + 12);
  safeChart("chartVentas", {
    type: "line",
    data: {
      labels: dias,
      datasets: [{
        label: "Pedidos",
        data: ventas,
        borderColor: "#25D366",
        backgroundColor: "rgba(37,211,102,0.12)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#25D366",
        pointBorderColor: "#0A0A0A",
        pointRadius: 4
      }]
    },
    options: chartOpts({ showLegend: false })
  });

  // Facturación por categoría (dona)
  const cats = window.CATEGORIAS.map((c) => c.nombre);
  const catData = cats.map((c) => Math.floor(Math.random() * 300) + 90);
  safeChart("chartCategorias", {
    type: "doughnut",
    data: {
      labels: cats,
      datasets: [{
        data: catData,
        backgroundColor: cats.map((c) => catColor(c)),
        borderColor: "#0A0A0A",
        borderWidth: 2
      }]
    },
    options: chartOpts({ showLegend: true, money: true, cutout: "62%" })
  });

  // Horarios pico (barras)
  const horas = [], horVal = [];
  for (let h = 12; h <= 23; h++) {
    horas.push(h + ":00");
    const pico = (h === 13 || h === 14 || h === 20 || h === 21 || h === 22) ? 9 : 2;
    horVal.push(Math.floor(Math.random() * (pico + 5)) + pico);
  }
  safeChart("chartHorarios", {
    type: "bar",
    data: {
      labels: horas,
      datasets: [{ label: "Pedidos", data: horVal, backgroundColor: "rgba(37,211,102,0.85)", borderRadius: 6 }]
    },
    options: chartOpts({ showLegend: false })
  });

  // Más y menos vendidos (barras horizontales)
  const tops = window.PRODUCTOS.filter((p) => !p.agotado).slice(0, 6);
  const nombres = tops.map((p) => p.nombre.length > 15 ? p.nombre.slice(0, 15) + "…" : p.nombre);
  const cantidades = tops.map(() => Math.floor(Math.random() * 55) + 8);
  safeChart("chartProductos", {
    type: "bar",
    data: {
      labels: nombres,
      datasets: [{ label: "Unidades", data: cantidades, backgroundColor: "rgba(255,140,66,0.85)", borderRadius: 6 }]
    },
    options: chartOpts({ showLegend: false, indexAxis: "y" })
  });

  // Productos sin ventas (alerta)
  renderSinVentas();
}

function renderSinVentas() {
  const el = document.getElementById("sinVentas");
  if (!el) return;
  const pool = window.PRODUCTOS.filter((p) => !p.agotado);
  const picks = pool.length > 3 ? pool.slice(0, 3) : pool;
  let html = "";
  for (const p of picks) {
    let cat = "";
    for (const c of window.CATEGORIAS) if (c.slug === p.categoria) { cat = c.nombre; break; }
    html += `<div class="sinventas-item">
      <div>
        <div class="sinventas-item__name">${p.nombre}</div>
        <div class="sinventas-item__cat">${cat}</div>
      </div>
      <span class="sinventas-item__tag">Sin ventas</span>
    </div>`;
  }
  el.innerHTML = html;
}

function renderResumenIA() {
  const el = document.getElementById("aiResumen");
  if (!el) return;
  const activos = window.PRODUCTOS.filter((p) => !p.agotado);
  const estrella = activos.find((p) => p.badge === "Popular") || activos[0] || window.PRODUCTOS[0];
  const estrellaNombre = estrella ? estrella.nombre : "tu clásico";
  const cambio = Math.floor(Math.random() * 18) + 3;
  const tendencia = Math.random() > 0.2 ? "más" : "menos";
  const sinVentas = window.PRODUCTOS.filter((p) => p.agotado).length || 2;
  el.innerHTML =
    "Esta semana vendiste <strong>" + cambio + "% " + tendencia +
    " que la semana pasada</strong>. Tu producto estrella fue <strong>" + estrellaNombre +
    "</strong>. Hay <strong>" + sinVentas + " productos que no se venden hace más de 10 días</strong>: considerá armar un combo o sacarlos del menú.";
}

function generarDescripcionIA() {
  const btn = document.getElementById("aiGenBtn");
  const nombreEl = document.getElementById("aiProductoNombre");
  const clavesEl = document.getElementById("aiProductoClaves");
  const output = document.getElementById("aiProductoDesc");
  if (!btn || !output || !nombreEl || !clavesEl) return;

  const nombre = nombreEl.value.trim();
  const claves = clavesEl.value.split(",").map((s) => s.trim()).filter(Boolean);
  if (!nombre) {
    mostrarErrorIA("Escribí el nombre del producto primero.");
    nombreEl.focus();
    return;
  }

  const label = btn.querySelector(".ai-gen-btn__label");
  ocultarErrorIA();

  btn.disabled = true;
  btn.classList.add("ai-gen-btn--loading");
  if (label) label.textContent = "Generando...";
  output.value = "Pensando una descripción que venda…";

  fetch("/api/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreProducto: nombre, palabrasClave: claves })
  })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data: data })))
    .then(({ ok, data }) => {
      if (!ok) throw new Error(data.error || "Error");
      output.value = data.descripcion;
    })
    .catch(() => {
      mostrarErrorIA("No se pudo generar, probá de nuevo.");
    })
    .finally(() => {
      btn.disabled = false;
      btn.classList.remove("ai-gen-btn--loading");
      if (label) label.textContent = "Generar con IA";
      if (output.value && output.scrollIntoView) output.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
}

function mostrarErrorIA(mensaje) {
  let err = document.querySelector(".ai-gen-error");
  if (!err) {
    err = document.createElement("p");
    err.className = "ai-gen-error";
    const btn = document.getElementById("aiGenBtn");
    const contenedor = btn ? btn.closest(".ai-desc-field") : null;
    (contenedor || document.body).appendChild(err);
  }
  err.textContent = mensaje;
}

function ocultarErrorIA() {
  const err = document.querySelector(".ai-gen-error");
  if (err) err.remove();
}

document.addEventListener("DOMContentLoaded", function() {
  renderAdmin();
  renderCharts();
  renderResumenIA();

  // Generador de descripción con IA
  const aiGenBtn = document.getElementById("aiGenBtn");
  if (aiGenBtn) aiGenBtn.addEventListener("click", generarDescripcionIA);

  // Delegación del toggle "agotado" en la lista de menú
  const menuList = document.getElementById("menuList");
  if (menuList) {
    menuList.addEventListener("change", (e) => {
      const input = e.target.closest("input[data-product-id]");
      if (!input) return;
      handleToggleAgotado(parseInt(input.dataset.productId));
    });
  }

  // Botón reiniciar demo
  const resetBtn = document.querySelector(".admin-reset-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetDemo);
});
