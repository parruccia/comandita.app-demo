/* Iconos flat de categorías (img/menu/*):
   - Platos, Guarniciones, Snacks, Postres: pack "Food" por Fathor Rohman (icon-icons.com), licencia CC BY 4.0.
   - Bebidas: ícono "Cola" por Vitaly Gorbachev (flaticon.com), licencia gratuita con atribución.
   Atribución requerida por licencia. */

window.CATEGORIAS = [
  {
    id: 1,
    nombre: "Platos principales",
    slug: "parrilla",
    imagen: "img/menu/cat_platos.png",
    imagenThumb: "img/menu/cat_platos.png",
    personalizable: true,
    visible_en_menu: true,
    orden: 1
  },
  {
    id: 2,
    nombre: "Guarniciones",
    slug: "papas",
    imagen: "img/menu/cat_guarniciones.png",
    imagenThumb: "img/menu/cat_guarniciones.png",
    personalizable: false,
    visible_en_menu: true,
    orden: 2
  },
  {
    id: 3,
    nombre: "Snacks",
    slug: "empanadas",
    imagen: "img/menu/cat_snacks.png",
    imagenThumb: "img/menu/cat_snacks.png",
    personalizable: false,
    visible_en_menu: true,
    orden: 3
  },
  {
    id: 4,
    nombre: "Bebidas",
    slug: "bebidas",
    imagen: "img/menu/cat_bebidas.png",
    imagenThumb: "img/menu/cat_bebidas.png",
    personalizable: false,
    visible_en_menu: true,
    orden: 4
  },
  {
    id: 5,
    nombre: "Postres",
    slug: "postres",
    imagen: "img/menu/cat_postres.png",
    imagenThumb: "img/menu/cat_postres.png",
    personalizable: false,
    visible_en_menu: true,
    orden: 5
  }
];

window.PRODUCTOS = [
  { id: 1,  nombre: "Matambre a la pizza",     descripcion: "Matambre tierno, cubierto con salsa de tomate, muzarella y orégano.", precio: 3800, categoria: "parrilla",  orden: 1, imagen: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop", salsas_incluidas: 1, toppings_incluidos: 0, badge: "", agotado: false },
  { id: 2,  nombre: "Ojo de bife con papas",    descripcion: "Corte jugoso a la plancha, servido con papas fritas bien crocantes.", precio: 5200, categoria: "parrilla",  orden: 2, imagen: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop", salsas_incluidas: 1, toppings_incluidos: 0, badge: "Popular", agotado: false },
  { id: 3,  nombre: "Asado de tira",            descripcion: "Corte al punto, de esos que se despegan solo. Para chuparse los dedos.", precio: 7500, categoria: "parrilla",  orden: 3, imagen: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop", salsas_incluidas: 2, toppings_incluidos: 1, badge: "", agotado: false },
  { id: 4,  nombre: "Milanesa napolitana",      descripcion: "Milanesa con salsa, muzarella, jamón y un toque de orégano.", precio: 8900, categoria: "parrilla",  orden: 4, imagen: "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=600&h=400&fit=crop", salsas_incluidas: 1, toppings_incluidos: 0, badge: "", agotado: false },

  { id: 5,  nombre: "Papas fritas",             descripcion: "Papas doradas y crocantes, con sal gruesa a elección.", precio: 2500, categoria: "papas",    orden: 1, imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop", badge: "", agotado: false },
  { id: 6,  nombre: "Papas con cheddar y verdeo", descripcion: "Papas cubiertas con cheddar fundido y verdeo fresco.", precio: 3200, categoria: "papas",    orden: 2, imagen: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop", badge: "", agotado: false },
  { id: 7,  nombre: "Ensalada rusa",            descripcion: "Clásica, bien cremosa, con huevo y arvejas.", precio: 3800, categoria: "papas",    orden: 3, imagen: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop", badge: "", agotado: true },

  { id: 8,  nombre: "Empanada de carne",        descripcion: "Relleno jugoso con cebolla, huevo y aceitunas.", precio: 1200, categoria: "empanadas", orden: 1, imagen: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop", badge: "Popular", agotado: false },
  { id: 9,  nombre: "Empanada de jamón y queso", descripcion: "Jamón y muzarella que forman un hilo al comerla.", precio: 1200, categoria: "empanadas", orden: 2, imagen: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop", badge: "", agotado: false },
  { id: 10, nombre: "Empanada de verdura",      descripcion: "Espinaca, cebolla y un toque de nuez.", precio: 1200, categoria: "empanadas", orden: 3, imagen: "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?w=600&h=400&fit=crop", badge: "", agotado: false },

  { id: 11, nombre: "Gaseosa línea",            descripcion: "Bien fría, sabor a elección.", precio: 1500, categoria: "bebidas",  orden: 1, imagen: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop", badge: "", agotado: false },
  { id: 12, nombre: "Limonada casera",          descripcion: "Limonada natural con hielo y menta.", precio: 1800, categoria: "bebidas",  orden: 2, imagen: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop", badge: "Nuevo", agotado: false },
  { id: 13, nombre: "Agua mineral",             descripcion: "Con o sin gas, fresca.", precio: 1000, categoria: "bebidas",  orden: 3, imagen: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop", badge: "", agotado: false },

  { id: 14, nombre: "Flan mixto",               descripcion: "Flan cremoso con dulce de leche y crema.", precio: 3200, categoria: "postres",  orden: 1, imagen: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop", badge: "", agotado: false },
  { id: 15, nombre: "Cheesecake de frutos rojos", descripcion: "Base de galletitas y salsa de frutos rojos.", precio: 2800, categoria: "postres",  orden: 2, imagen: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop", badge: "", agotado: false },
  { id: 16, nombre: "Helado artesanal",         descripcion: "Dos bochas de sabores a elección.", precio: 2500, categoria: "postres",  orden: 3, imagen: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop", badge: "", agotado: false }
];

window.SALSAS = [
  { id: 101, nombre: "Mayonesa de ajo", precio: 0,   categoria: "salsas", orden: 1 },
  { id: 102, nombre: "Salsa criolla",   precio: 0,   categoria: "salsas", orden: 2 },
  { id: 103, nombre: "Salsa picante",   precio: 200, categoria: "salsas", orden: 3 }
];

window.TOPPINGS = [
  { id: 201, nombre: "Panceta crocante", precio: 300, categoria: "toppings", orden: 1 },
  { id: 202, nombre: "Queso extra",      precio: 400, categoria: "toppings", orden: 2 }
];

window.CONTACTO = {
  whatsapp: "5493512345678",
  mensaje: "Hola, vi la demo de Comanditas y quiero cotizar algo así para mi negocio"
};

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