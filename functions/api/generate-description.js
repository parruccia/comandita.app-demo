// Cloudflare Pages Function — genera una descripción de producto con IA (Groq)
// Endpoint: POST /api/generate-description
// Body: { nombreProducto: string, palabrasClave: string[] }
// Respuesta: { descripcion: string }  |  Error 4xx/5xx con { error: string }

export async function onRequestPost(context) {
  const GROQ_API_KEY = context.env.GROQ_API_KEY;

  // Método no soportado
  if (!context.request) {
    return json({ error: "Método no soportado." }, 405);
  }

  // Leer y validar el body
  let payload;
  try {
    payload = await context.request.json();
  } catch (e) {
    return json({ error: "El cuerpo de la petición no es JSON válido." }, 400);
  }

  const nombreProducto = (payload.nombreProducto || "").trim();
  const palabrasClave = Array.isArray(payload.palabrasClave)
    ? payload.palabrasClave.map((p) => String(p).trim()).filter(Boolean)
    : [];

  if (!nombreProducto) {
    return json({ error: "Falta el nombre del producto." }, 400);
  }

  // Configuración de Groq pendiente
  if (!GROQ_API_KEY) {
    return json({ error: "El servidor no tiene configurada la API de IA." }, 500);
  }

  // Prompt en español rioplatense con énfasis en variedad (reglas + 3 ejemplos few-shot)
  const claveTexto = palabrasClave.length ? palabrasClave.join(", ") : "atractivo";

  const systemPrompt =
    "Escribís descripciones de menú gastronómico cortas, persuasivas y en español rioplatense, " +
    "cercano pero sin exagerar. Escribís como un cocinero que le habla a un cliente en la barra: " +
    "concreto, con olor y mejor dicho, no como texto de marketing de manual. Reglas:\n" +
    "- Usar el nombre y las palabras clave solo como referencia, sin repetirlas textualmente todas. " +
    "Destacar lo más llamativo de esas palabras clave (el ingrediente estrella, la textura o el sabor que sobresale).\n" +
    "- No inventar ingredientes que no estén en las palabras clave, ni exagerar.\n" +
    "- EVITAR el tono genérico de folleto: nada de 'delicioso', 'exquisito', 'sabor único', 'calidad premium', 'hecho con amor' o parecidos.\n" +
    "- RESPONDER SOLO CON LA DESCRIPCIÓN: sin comillas, sin aclaraciones, sin el nombre al comienzo.\n" +
    "- Longitud: 1 a 2 oraciones, máximo 180 caracteres.\n" +
    "- VARIAR SIEMPRE: no repetir la misma estructura ni el mismo cierre entre una descripción y la anterior.\n" +
    "  Cambiar el cierre según el producto: a veces una pregunta, a veces un dato concreto, a veces ningún llamado a la acción.\n" +
    "  Variar por dónde se arranca: resaltar un ingrediente puntual, o el sabor, o la textura, o para qué ocasión sirve.\n" +
    "- PROHIBIDO usar frases de cierre genéricas y gastadas, por ejemplo: 'vas a entender por qué es un favorito', " +
    "'cada bocado es memorable', 'ideal para compartir' o similares.";

  const ejemplo1 =
    "Producto: Pizza napolitana\nPalabras clave: masa fina, tomate, muzarella, albahaca";
  const salida1 =
    "La masa fina se hace con fermentación de 48 horas y el tomate va entero. ¿Hay algo más clásico para una noche de domingo?";

  const ejemplo2 =
    "Producto: Hamburguesa doble\nPalabras clave: carne vacuna, cheddar, panceta, pan brioche";
  const salida2 =
    "Medallón de 180 gramos a la parrilla con cheddar fundido, panceta crocante y pan brioche apenas tostado. Viene con papas, sin cargo.";

  const ejemplo3 =
    "Producto: Limonada de menta\nPalabras clave: limón, menta fresca, hielo";
  const salida3 =
    "Limonada bien fresca, con hojas de menta recién picadas y mucho hielo. Se toma de una.";

  const objetivo =
    "Producto: " + nombreProducto + "\n" +
    "Palabras clave: " + claveTexto;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: ejemplo1 },
          { role: "assistant", content: salida1 },
          { role: "user", content: ejemplo2 },
          { role: "assistant", content: salida2 },
          { role: "user", content: ejemplo3 },
          { role: "assistant", content: salida3 },
          { role: "user", content: objetivo }
        ],
        temperature: 1.0,
        max_tokens: 160
      })
    });

    if (!res.ok) {
      const texto = await res.text().catch(() => "");
      console.error("Groq error:", res.status, texto);
      return json({ error: "El servicio de IA no respondió correctamente." }, 502);
    }

    const data = await res.json();
    const descripcion = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
      ? data.choices[0].message.content.trim()
      : "";

    if (!descripcion) {
      return json({ error: "No se pudo generar la descripción." }, 502);
    }

    return json({ descripcion: descripcion });
  } catch (e) {
    console.error("Groq fetch error:", e.message);
    return json({ error: "No se pudo generar, probá de nuevo." }, 502);
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
