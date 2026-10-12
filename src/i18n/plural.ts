/** Русское склонение: pluralRu(5, ['проект', 'проекта', 'проектов']) → 'проектов'. */
export function pluralRu(n: number, forms: [string, string, string]): string {
  const m = n % 10, h = n % 100;
  return m === 1 && h !== 11 ? forms[0] : m >= 2 && m <= 4 && (h < 12 || h > 14) ? forms[1] : forms[2];
}

export function pluralEn(n: number, forms: [string, string]): string {
  return n === 1 ? forms[0] : forms[1];
}
