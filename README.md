# SwiftType Studio

Crea una aplicación web de práctica de mecanografía (estilo Monkeytype / TypingClub), simple y con diseño moderno. Debe incluir:

1. Generación de texto

Generador de textos aleatorios a partir de un banco de palabras comunes en español (mínimo 100-150 palabras variadas).

Botón para generar un nuevo texto aleatorio en cualquier momento.

Campo/textarea donde el usuario pueda pegar o escribir su propio texto personalizado para practicar con él en lugar del generado.

Selector simple para elegir la longitud del texto generado (corto / medio / largo).

2. Área de escritura

El texto objetivo se muestra en pantalla con tipografía monoespaciada, tamaño grande y legible.

A medida que el usuario escribe (capturando el input real del teclado, sin usar un <input> visible tipo formulario), cada carácter del texto objetivo se resalta:

Verde: carácter correcto.

Rojo (con fondo sutil): carácter incorrecto.

Sin colorear: carácter aún no alcanzado.

Cursor visual animado (parpadeante) indicando la posición actual.

Si el usuario comete un error, no debe poder avanzar al siguiente carácter hasta corregirlo (o, alternativamente, se registra el error y continúa — dejar esto como constante configurable).

3. Teclado virtual animado

Representación visual de un teclado QWERTY completo en pantalla.

Cada tecla se ilumina en tiempo real cuando el usuario la presiona físicamente.

Color diferenciado: iluminación normal al presionar correctamente, iluminación en rojo si esa pulsación generó un error.

Animación breve y suave (transición de 100-150ms) al iluminarse, para que se sienta fluido y moderno.

Debe reconocer correctamente las teclas en español (ñ, tildes, etc.) si el texto las incluye.

4. Métricas

Cálculo en tiempo real (o al finalizar) de:

WPM (palabras por minuto).

Precisión (%) = (caracteres correctos / caracteres totales escritos) × 100.

Tiempo transcurrido.

Número de errores cometidos.

Pantalla de resultados al terminar el texto, mostrando estas métricas de forma clara.

Botón "Reintentar" y botón "Nuevo texto" en la pantalla de resultados.

5. Diseño (moderno y minimalista)

Tema oscuro por defecto, con opción de alternar a tema claro.

Paleta con buen contraste (fondo oscuro neutro, acentos en un color vibrante para el cursor/progreso).

Tipografía monoespaciada para el texto de práctica (ej. estilo "JetBrains Mono" o similar).

Diseño centrado, sin distracciones: el texto y el teclado son el foco absoluto de la pantalla.

Transiciones y animaciones sutiles (nada exagerado ni que distraiga de la escritura).

Responsive, priorizando la experiencia en escritorio (el teclado virtual puede ocultarse o simplificarse en pantallas pequeñas).

6. Stack técnico

React + Tailwind CSS.

Todo el estado (texto actual, progreso, métricas) manejado en el cliente, sin backend ni base de datos por ahora.

Código organizado en componentes reutilizables: TypingArea, VirtualKeyboard, StatsPanel, TextGenerator.

Notas adicionales

No es necesario sistema de usuarios, login, ni guardado de historial en esta primera versión.

Priorizar que la experiencia de escritura se sienta fluida y sin lag perceptible entre la pulsación de tecla y el feedback visual.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8dfaefde-0282-4516-9606-c52842bf6762).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
