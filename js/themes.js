window.THEMES = {
  oscuro: {
    label: "Oscuro",
    emoji: "\uD83C\uDF19",
    bg: "#0A0A0A",
    surface: "#141414",
    surfaceAlt: "#1C1C1C",
    text: "#E8E4DF",
    muted: "#6B6560",
    accent: "#25D366",
    accentHover: "#20BA5A",
    orange: "#FF8C42",
    blue: "#5B9BD5",
    border: "rgba(255,255,255,0.06)",
    cardBg: "#181818",
    headerBg: "rgba(10,10,10,0.92)",
    heroGradient: "linear-gradient(180deg, #0A0A0A 0%, #111 100%)",
    btnGradient: "linear-gradient(135deg, #25D366, #20BA5A)",
    footerBg: "#080808"
  },
  bodegon: {
    label: "Bodegón",
    emoji: "\uD83C\uDF7A",
    bg: "#1A1208",
    surface: "#231A0E",
    surfaceAlt: "#2C2114",
    text: "#F5E6D0",
    muted: "#8A7A64",
    accent: "#C9A84C",
    accentHover: "#D4B85C",
    orange: "#E8A54B",
    blue: "#7BA3C9",
    border: "rgba(201,168,76,0.10)",
    cardBg: "#2A1F12",
    headerBg: "rgba(26,18,8,0.94)",
    heroGradient: "linear-gradient(180deg, #1A1208 0%, #2A1F12 100%)",
    btnGradient: "linear-gradient(135deg, #8B4513, #C9A84C)",
    footerBg: "#140E06"
  },
  natural: {
    label: "Natural",
    emoji: "\uD83C\uDF3F",
    bg: "#0E1A10",
    surface: "#152017",
    surfaceAlt: "#1A281E",
    text: "#E4EDE5",
    muted: "#6B8A6E",
    accent: "#66BB6A",
    accentHover: "#81C784",
    orange: "#A5D6A7",
    blue: "#81C784",
    border: "rgba(102,187,106,0.08)",
    cardBg: "#1A281E",
    headerBg: "rgba(14,26,16,0.94)",
    heroGradient: "linear-gradient(180deg, #0E1A10 0%, #1A281E 100%)",
    btnGradient: "linear-gradient(135deg, #388E3C, #66BB6A)",
    footerBg: "#0A120C"
  },
  elegante: {
    label: "Elegante",
    emoji: "\uD83C\uDF19",
    bg: "#0A0E1A",
    surface: "#111827",
    surfaceAlt: "#1A2236",
    text: "#E8ECF4",
    muted: "#5C6B8A",
    accent: "#C9A84C",
    accentHover: "#D4B85C",
    orange: "#D4B85C",
    blue: "#7B8FB2",
    border: "rgba(201,168,76,0.08)",
    cardBg: "#151D30",
    headerBg: "rgba(10,14,26,0.94)",
    heroGradient: "linear-gradient(180deg, #0A0E1A 0%, #151D30 100%)",
    btnGradient: "linear-gradient(135deg, #1A237E, #C9A84C)",
    footerBg: "#060A14"
  },
  fiesta: {
    label: "Fiesta",
    emoji: "\uD83C\uDF89",
    bg: "#1A0A14",
    surface: "#241020",
    surfaceAlt: "#2E162A",
    text: "#F8EDF4",
    muted: "#8A6080",
    accent: "#F50057",
    accentHover: "#FF4081",
    orange: "#FFD54F",
    blue: "#FF80AB",
    border: "rgba(245,0,87,0.08)",
    cardBg: "#2E162A",
    headerBg: "rgba(26,10,20,0.94)",
    heroGradient: "linear-gradient(180deg, #1A0A14 0%, #2E162A 100%)",
    btnGradient: "linear-gradient(135deg, #F50057, #FFD54F)",
    footerBg: "#120810"
  }
};

function aplicarTema(nombre) {
  const t = window.THEMES[nombre];
  if (!t) return;
  const r = document.documentElement;
  r.style.setProperty("--bg", t.bg);
  r.style.setProperty("--surface", t.surface);
  r.style.setProperty("--surface-alt", t.surfaceAlt);
  r.style.setProperty("--text", t.text);
  r.style.setProperty("--muted", t.muted);
  r.style.setProperty("--accent", t.accent);
  r.style.setProperty("--accent-hover", t.accentHover);
  r.style.setProperty("--border", t.border);
  r.style.setProperty("--card-bg", t.cardBg);
  r.style.setProperty("--header-bg", t.headerBg);
  r.style.setProperty("--hero-gradient", t.heroGradient);
  r.style.setProperty("--btn-gradient", t.btnGradient);
  r.style.setProperty("--footer-bg", t.footerBg);
  localStorage.setItem("comanditas_theme", nombre);
  document.body.classList.add("theme-loaded");
  actualizarSelector(nombre);
}

function initTema() {
  const guardado = localStorage.getItem("comanditas_theme") || "oscuro";
  aplicarTema(guardado);
}

function togglePanelTemas() {
  const panel = document.getElementById("themePanel");
  if (!panel) return;
  const isOpen = panel.classList.contains("open");
  panel.classList.toggle("open");
  const overlay = document.getElementById("themeOverlay");
  if (overlay) overlay.classList.toggle("open");
  document.body.style.overflow = isOpen ? "" : "hidden";
}

function actualizarSelector(nombre) {
  const btns = document.querySelectorAll(".theme-option");
  btns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === nombre);
  });
}

function buildThemePanel() {
  const overlay = document.createElement("div");
  overlay.id = "themeOverlay";
  overlay.className = "theme-overlay";
  overlay.addEventListener("click", togglePanelTemas);

  const panel = document.createElement("div");
  panel.id = "themePanel";
  panel.className = "theme-panel";

  let html = '<div class="theme-panel__header">' +
    '<span class="theme-panel__title">Estilos del sitio</span>' +
    '<button class="theme-panel__close">&#10005;</button>' +
    '</div>' +
    '<p class="theme-panel__note">Este diseño es un ejemplo. Se adapta 100% a la marca de tu negocio.</p>' +
    '<div class="theme-options">';

  const nombres = Object.keys(window.THEMES);
  for (const k of nombres) {
    const t = window.THEMES[k];
    html += `<button class="theme-option" data-theme="${k}">
      <span class="theme-swatch" style="background:${t.btnGradient}"></span>
      <span class="theme-emoji">${t.emoji}</span>
      <span class="theme-name">${t.label}</span>
    </button>`;
  }

  html += '</div>';
  panel.innerHTML = html;

  // Delegación dentro del panel (cerrar y elegir tema)
  panel.addEventListener("click", (e) => {
    if (e.target.closest(".theme-panel__close")) {
      togglePanelTemas();
      return;
    }
    const opt = e.target.closest("[data-theme]");
    if (opt) aplicarTema(opt.dataset.theme);
  });

  document.body.appendChild(overlay);
  document.body.appendChild(panel);
}

document.addEventListener("DOMContentLoaded", function() {
  buildThemePanel();
  initTema();

  // Botón flotante de temas (estático en el HTML
  const themeFab = document.querySelector(".theme-fab");
  if (themeFab) {
    themeFab.addEventListener("click", togglePanelTemas);
    themeFab.addEventListener("keydown", (e) => {
      if (e.key === "Enter") togglePanelTemas();
    });
  }
});
