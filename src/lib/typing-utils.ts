/** Cuenta palabras escritas correctamente en secuencia desde el inicio. */
export function countCorrectWords(typed: string, text: string): number {
  const words = text.split(" ");
  let pos = 0;
  let completed = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isLast = i === words.length - 1;
    const expectedSlice = isLast ? word : `${word} `;
    const end = pos + expectedSlice.length;

    if (typed.length < end) break;
    if (typed.slice(pos, end) === expectedSlice) {
      completed++;
      pos = end;
    } else {
      break;
    }
  }

  return completed;
}

export function wordCountOf(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}
