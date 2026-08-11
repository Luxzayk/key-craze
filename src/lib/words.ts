export const SPANISH_WORDS = [
  "casa", "tiempo", "persona", "año", "día", "cosa", "hombre", "mujer", "vida", "mano",
  "parte", "niño", "ojo", "forma", "lugar", "caso", "punto", "trabajo", "gobierno", "país",
  "agua", "mundo", "problema", "grupo", "historia", "ciudad", "noche", "camino", "palabra", "puerta",
  "cabeza", "libro", "amigo", "familia", "escuela", "verdad", "razón", "momento", "puerto", "campo",
  "fuerza", "manera", "nombre", "número", "idea", "cuerpo", "corazón", "mañana", "tarde", "semana",
  "mes", "hora", "minuto", "calle", "coche", "mesa", "silla", "ventana", "cocina", "comida",
  "música", "color", "verde", "azul", "rojo", "blanco", "negro", "grande", "pequeño", "nuevo",
  "viejo", "joven", "bueno", "malo", "alto", "bajo", "largo", "corto", "fácil", "difícil",
  "rápido", "lento", "fuerte", "débil", "claro", "oscuro", "feliz", "triste", "primero", "último",
  "mejor", "peor", "mucho", "poco", "todo", "nada", "algo", "alguien", "nunca", "siempre",
  "hacer", "tener", "poder", "decir", "querer", "saber", "llegar", "pasar", "deber", "poner",
  "salir", "volver", "tomar", "conocer", "vivir", "sentir", "mirar", "contar", "empezar", "esperar",
  "buscar", "existir", "entrar", "trabajar", "escribir", "perder", "producir", "ocurrir", "recordar", "terminar",
  "permitir", "aparecer", "conseguir", "comenzar", "servir", "sacar", "necesitar", "mantener", "resultar", "leer",
  "caer", "cambiar", "presentar", "crear", "abrir", "considerar", "correr", "aprender", "estudiar", "jugar",
  "bailar", "cantar", "soñar", "caminar", "pensar", "montaña", "playa", "cielo", "estrella", "árbol",
  "flor", "río", "fuego", "viento", "lluvia", "nieve", "sol", "luna", "pájaro", "perro",
  "gato", "caballo", "pescado", "pan", "queso", "leche", "café", "azúcar", "sal", "fruta",
  "manzana", "naranja", "plátano", "cuchara", "teclado", "pantalla", "ratón", "papel", "lápiz", "dinero",
  "mercado", "tienda", "viaje", "avión", "tren", "barco", "puente", "jardín", "bosque", "isla",
];

export const LENGTHS = {
  corto: 20,
  medio: 40,
  largo: 70,
} as const;

export type LengthKey = keyof typeof LENGTHS;

export function generateText(length: LengthKey): string {
  const count = LENGTHS[length];
  const out: string[] = [];
  let prev = "";
  for (let i = 0; i < count; i++) {
    const pick = () => SPANISH_WORDS[Math.floor(Math.random() * SPANISH_WORDS.length)] as string;
    let w = pick();
    while (w === prev) w = pick();
    prev = w;
    out.push(w);
  }

  return out.join(" ");
}
