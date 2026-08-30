window.CATEGORIAS = [
  {
    id: 1,
    nombre: "Platos principales",
    slug: "parrilla",
    imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    personalizable: true,
    visible_en_menu: true,
    orden: 1
  },
  {
    id: 2,
    nombre: "Guarniciones",
    slug: "papas",
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    personalizable: false,
    visible_en_menu: true,
    orden: 2
  },
  {
    id: 3,
    nombre: "Snacks",
    slug: "empanadas",
    imagen: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop",
    personalizable: false,
    visible_en_menu: true,
    orden: 3
  },
  {
    id: 4,
    nombre: "Bebidas",
    slug: "bebidas",
    imagen: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop",
    personalizable: false,
    visible_en_menu: true,
    orden: 4
  },
  {
    id: 5,
    nombre: "Postres",
    slug: "postres",
    imagen: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
    personalizable: false,
    visible_en_menu: true,
    orden: 5
  }
];

window.PRODUCTOS = [
  { id: 1,  nombre: "Producto 1",         descripcion: "Descripción genérica del producto para la demo", precio: 3800, categoria: "parrilla",  orden: 1, imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", salsas_incluidas: 1, toppings_incluidos: 0, badge: "", agotado: false },
  { id: 2,  nombre: "Producto 2",         descripcion: "Descripción genérica del producto para la demo", precio: 5200, categoria: "parrilla",  orden: 2, imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop", salsas_incluidas: 1, toppings_incluidos: 0, badge: "Popular", agotado: false },
  { id: 3,  nombre: "Producto 3",         descripcion: "Descripción genérica del producto para la demo", precio: 7500, categoria: "parrilla",  orden: 3, imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop", salsas_incluidas: 2, toppings_incluidos: 1, badge: "", agotado: false },
  { id: 4,  nombre: "Producto 4",         descripcion: "Descripción genérica del producto para la demo", precio: 8900, categoria: "parrilla",  orden: 4, imagen: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop", salsas_incluidas: 1, toppings_incluidos: 0, badge: "", agotado: false },

  { id: 5,  nombre: "Guarnición 1",       descripcion: "Descripción genérica del producto para la demo", precio: 2500, categoria: "papas",    orden: 1, imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", badge: "", agotado: false },
  { id: 6,  nombre: "Guarnición 2",       descripcion: "Descripción genérica del producto para la demo", precio: 3200, categoria: "papas",    orden: 2, imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop", badge: "", agotado: false },
  { id: 7,  nombre: "Guarnición 3",       descripcion: "Descripción genérica del producto para la demo", precio: 3800, categoria: "papas",    orden: 3, imagen: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop", badge: "", agotado: true },

  { id: 8,  nombre: "Snack 1",            descripcion: "Descripción genérica del producto para la demo", precio: 1200, categoria: "empanadas", orden: 1, imagen: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop", badge: "Popular", agotado: false },
  { id: 9,  nombre: "Snack 2",            descripcion: "Descripción genérica del producto para la demo", precio: 1200, categoria: "empanadas", orden: 2, imagen: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop", badge: "", agotado: false },
  { id: 10, nombre: "Snack 3",            descripcion: "Descripción genérica del producto para la demo", precio: 1200, categoria: "empanadas", orden: 3, imagen: "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?w=400&h=300&fit=crop", badge: "", agotado: false },

  { id: 11, nombre: "Bebida 1",           descripcion: "Descripción genérica del producto para la demo", precio: 1500, categoria: "bebidas",  orden: 1, imagen: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop", badge: "", agotado: false },
  { id: 12, nombre: "Bebida 2",           descripcion: "Descripción genérica del producto para la demo", precio: 1800, categoria: "bebidas",  orden: 2, imagen: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop", badge: "Nuevo", agotado: false },
  { id: 13, nombre: "Bebida 3",           descripcion: "Descripción genérica del producto para la demo", precio: 1000, categoria: "bebidas",  orden: 3, imagen: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop", badge: "", agotado: false },

  { id: 14, nombre: "Postre 1",           descripcion: "Descripción genérica del producto para la demo", precio: 3200, categoria: "postres",  orden: 1, imagen: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop", badge: "", agotado: false },
  { id: 15, nombre: "Postre 2",           descripcion: "Descripción genérica del producto para la demo", precio: 2800, categoria: "postres",  orden: 2, imagen: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop", badge: "", agotado: false },
  { id: 16, nombre: "Postre 3",           descripcion: "Descripción genérica del producto para la demo", precio: 2500, categoria: "postres",  orden: 3, imagen: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop", badge: "", agotado: false }
];

window.SALSAS = [
  { id: 101, nombre: "Salsa 1",        precio: 0,   categoria: "salsas", orden: 1 },
  { id: 102, nombre: "Salsa 2",        precio: 0,   categoria: "salsas", orden: 2 },
  { id: 103, nombre: "Salsa 3",        precio: 200, categoria: "salsas", orden: 3 }
];

window.TOPPINGS = [
  { id: 201, nombre: "Extra 1",        precio: 300, categoria: "toppings", orden: 1 },
  { id: 202, nombre: "Extra 2",        precio: 400, categoria: "toppings", orden: 2 }
];

window.SITE_CONFIG = {
  nombre: "Comanditas",
  whatsapp: "5493534214780",
  instagram: "https://instagram.com/tu_cuenta_demo",
  direccion: "Av. Principal 1234",
  alias: "comanditas.mp",
  envio_costo: 1500,
  envio_gratis_desde: 15000,
  tiempo_estimado: "20-30",
  horarios: {
    0: { cerrado: true },
    1: { abierto: "12:00", cierre: "15:00", cierre2: "23:00" },
    2: { abierto: "12:00", cierre: "15:00", cierre2: "23:00" },
    3: { abierto: "12:00", cierre: "15:00", cierre2: "23:00" },
    4: { abierto: "12:00", cierre: "15:00", cierre2: "23:00" },
    5: { abierto: "12:00", cierre: "15:00", cierre2: "23:00" },
    6: { abierto: "12:00", cierre: "15:00", cierre2: "23:00" }
  }
};

(function() {
  try {
    var raw = localStorage.getItem("comanditas_agotados");
    if (raw) {
      var agotados = JSON.parse(raw);
      for (var i = 0; i < window.PRODUCTOS.length; i++) {
        if (agotados.indexOf(window.PRODUCTOS[i].id) !== -1) {
          window.PRODUCTOS[i].agotado = true;
        }
      }
    }
  } catch(e) {}
})();

function saveAgotados() {
  var ids = [];
  for (var i = 0; i < window.PRODUCTOS.length; i++) {
    if (window.PRODUCTOS[i].agotado) ids.push(window.PRODUCTOS[i].id);
  }
  try { localStorage.setItem("comanditas_agotados", JSON.stringify(ids)); } catch(e) {}
}

function resetDemo() {
  try { localStorage.removeItem("comanditas_agotados"); } catch(e) {}
  location.reload();
}

function toggleAgotado(productoId) {
  for (var i = 0; i < window.PRODUCTOS.length; i++) {
    if (window.PRODUCTOS[i].id === productoId) {
      window.PRODUCTOS[i].agotado = !window.PRODUCTOS[i].agotado;
      saveAgotados();
      return window.PRODUCTOS[i].agotado;
    }
  }
  return false;
}