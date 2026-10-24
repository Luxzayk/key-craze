# Teclea

Aplicación web de práctica de mecanografía en español, inspirada en herramientas como Monkeytype. Permite entrenar velocidad y precisión desde el navegador con textos generados aleatoriamente, textos personalizados, teclado virtual, métricas en tiempo real e historial local de sesiones.

**Demo:** [key-craze.vercel.app](https://key-craze.vercel.app)

## Características

- **Tres modos de práctica:**
  - **Tiempo:** sesiones de 15, 30, 60 o 120 segundos.
  - **Palabras:** objetivos de 10, 25, 50 o 100 palabras.
  - **Personalizado:** pega o escribe cualquier texto y elige el tiempo de práctica.
- **Generador de texto en español** con un banco local de más de 200 palabras, incluyendo caracteres como `ñ`, vocales acentuadas y puntuación básica del teclado español.
- **Feedback carácter a carácter:**
  - Verde para caracteres correctos.
  - Rojo para errores.
  - Cursor visual parpadeante en la posición actual.
- **Modo estricto:** al cometer un error, la escritura queda bloqueada hasta corregirlo con `Backspace`.
- **Teclado virtual QWERTY** con distribución española, resaltado de la tecla activa y guía de la siguiente tecla esperada.
- **Métricas en tiempo real:** PPM, precisión, errores, progreso, tiempo transcurrido y tiempo restante cuando corresponde.
- **Resultados detallados:** resumen de la sesión, gráfica de PPM, teclas con más errores, récord personal y botones para reintentar o generar un texto nuevo.
- **Historial local:** guarda hasta 50 sesiones en `localStorage` y calcula la mejor marca personal.
- **Rachas de práctica:** registra los días consecutivos de actividad en el navegador.
- **Preferencias persistentes:** tema claro/oscuro, sonido de teclas, fuente monoespaciada y configuración de la prueba.
- **Diseño responsive:** el teclado virtual se muestra principalmente en pantallas medianas y grandes para mantener el foco en la escritura en dispositivos pequeños.

## Stack técnico

- **React 19** y **TypeScript**.
- **TanStack Start** y **TanStack Router** para la aplicación y el enrutado basado en archivos.
- **Vite** como herramienta de desarrollo y build.
- **Tailwind CSS v4** y `tw-animate-css` para estilos y animaciones.
- **Radix UI** para componentes accesibles como diálogos y controles.
- **Lucide React** para iconos.
- **Recharts** para la gráfica de evolución de PPM.
- **React Query** mediante `@tanstack/react-query` en el contexto del router.
- **localStorage** como persistencia local; no hay backend ni base de datos.

## Arquitectura del proyecto

```text
.
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                 Componentes reutilizables basados en Radix UI
│   │   ├── TypingArea.tsx       Texto objetivo, estados de caracteres y cursor
│   │   ├── VirtualKeyboard.tsx  Teclado virtual y tecla siguiente sugerida
│   │   ├── StatsPanel.tsx       Métricas y barra de progreso durante la sesión
│   │   ├── ResultsScreen.tsx     Resultados, gráfica y acciones posteriores
│   │   ├── TestConfigSelector.tsx Modos, duración, objetivo y texto personalizado
│   │   ├── TextGenerator.tsx    Acción para generar un nuevo texto
│   │   ├── HistoryPanel.tsx     Historial y récord personal
│   │   ├── ErrorKeysList.tsx    Teclas con más errores
│   │   ├── WpmChart.tsx         Evolución de PPM durante la prueba
│   │   ├── FontSelector.tsx     Selector de fuente monoespaciada
│   │   └── StreakBadge.tsx      Racha actual de práctica
│   ├── hooks/
│   │   ├── useTyping.ts         Control central de entrada, tiempo y métricas
│   │   ├── useFontPreference.ts  Preferencia de fuente
│   │   ├── useSoundPreference.ts Preferencia de sonido
│   │   └── use-mobile.tsx        Detección de viewport móvil
│   ├── lib/
│   │   ├── words.ts             Banco y generación de palabras españolas
│   │   ├── keyboard.ts          Distribución del teclado español
│   │   ├── typing-utils.ts      Conteo y utilidades de palabras
│   │   ├── storage.ts           Tipos y persistencia en localStorage
│   │   ├── click-sound.ts       Sonido de pulsación
│   │   ├── error-capture.ts     Captura de errores de servidor
│   │   └── error-page.ts         Página HTML de error SSR
│   ├── routes/
│   │   ├── __root.tsx           Shell global, metadatos y límites de error
│   │   └── index.tsx             Pantalla principal de práctica
│   ├── router.tsx                Configuración de TanStack Router
│   ├── server.ts                 Entrada SSR y normalización de errores
│   ├── start.ts                  Middleware SSR y protección CSRF
│   ├── styles.css                Tema, variables y animaciones globales
│   └── routeTree.gen.ts          Árbol de rutas generado automáticamente
├── package.json
├── vite.config.ts
├── tsconfig.json
└── bun.lock
```

### Flujo de la aplicación

La ruta `src/routes/index.tsx` crea o recupera la configuración de la prueba, genera el texto y coordina los componentes de la interfaz. `useTyping` escucha eventos reales de teclado a nivel de ventana, calcula el progreso y expone el estado para `TypingArea`, `VirtualKeyboard` y `StatsPanel`.

Al terminar una sesión, la ruta guarda un `SessionRecord` mediante `src/lib/storage.ts`, actualiza la racha y refresca el historial. Todo este estado se mantiene en el cliente; los datos no se envían a un servidor ni se sincronizan entre dispositivos.

## Requisitos

- Node.js compatible con el proyecto.
- npm o Bun.
- Un navegador moderno con soporte para TypeScript compilado, Web Audio API y `localStorage`.

## Desarrollo local

Con npm:

```bash
git clone https://github.com/Luxzayk/key-craze.git
cd key-craze
npm install
npm run dev
```

Con Bun:

```bash
git clone https://github.com/Luxzayk/key-craze.git
cd key-craze
bun install
bun run dev
```

La aplicación se sirve mediante Vite en la URL local que muestre la terminal, normalmente `http://localhost:5173`.

## Scripts disponibles

```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build de producción
npm run build:dev   # Build usando el modo development
npm run preview     # Previsualiza el build generado
npm run lint        # Ejecuta ESLint
npm run format      # Formatea el proyecto con Prettier
```

Con Bun, sustituye `npm run` por `bun run`.

## Persistencia y privacidad

Teclea funciona sin cuentas, login, API ni base de datos. Las siguientes preferencias se guardan localmente bajo claves con el prefijo `typingapp_`:

- Configuración de la prueba.
- Historial de hasta 50 sesiones.
- Récord personal y racha.
- Fuente seleccionada.
- Sonido activado o desactivado.

Borrar los datos del sitio desde el navegador elimina también el historial y las preferencias.

## Decisiones de implementación

- `STRICT_MODE` está definido en `src/hooks/useTyping.ts` y actualmente vale `true`.
- En modo tiempo, el texto se amplía automáticamente cuando quedan menos de 15 caracteres para evitar que la sesión termine por falta de texto.
- La precisión se calcula a partir de las pulsaciones totales y los errores registrados.
- El árbol de rutas `src/routeTree.gen.ts` es generado automáticamente; no debe editarse manualmente.
- `vite.config.ts` utiliza la configuración de `@lovable.dev/vite-tanstack-config`, que integra Vite, TanStack Start, Tailwind, aliases y el target de despliegue.

## Contribuir

1. Crea una rama para tu cambio.
2. Instala las dependencias con npm o Bun.
3. Ejecuta `npm run lint` y `npm run build` antes de enviar cambios.
4. Mantén la interfaz de práctica rápida, accesible y sin distracciones.
5. No reescribas el historial publicado: este proyecto está conectado con Lovable y los commits enviados a la rama conectada se sincronizan con su editor.

## Estado del proyecto

Teclea es una aplicación frontend autocontenida. Actualmente no incluye usuarios, autenticación, sincronización en la nube ni almacenamiento remoto de resultados.

## Licencia

No se ha definido una licencia en el repositorio. Todos los derechos permanecen con el propietario del proyecto hasta que se añada una licencia explícita.

---

Construido con [Lovable](https://lovable.dev).