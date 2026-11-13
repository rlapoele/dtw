import { combiningClass, decomposition, composition, lowercase, caseFold, cased, caseIgnorable } from './unicode-17-data';

export const NAMESPACE_NAMING_POLICY = 'DTW namespace naming v1 / Unicode 17.0.0';
const removed = /[\u0009-\u000D\u0020\u0085\u00A0\u1680\u2000-\u200B\u2028\u2029\u202F\u205F\u2060\u3000\uFEFF]/g;
const cc = (cp: number) => combiningClass[cp] ?? 0;
function inRanges(cp: number, ranges: readonly (readonly number[])[]): boolean {
  let lo = 0, hi = ranges.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1, [start, end] = ranges[mid];
    if (cp < start) hi = mid - 1;
    else if (cp > end) lo = mid + 1;
    else return true;
  }
  return false;
}
function decompose(cp: number, result: number[]): void {
  // UAX #15 algorithmic Hangul decomposition, independent of UCD tables.
  const s = cp - 0xAC00;
  if (s >= 0 && s < 11172) {
    result.push(0x1100 + Math.floor(s / 588), 0x1161 + Math.floor((s % 588) / 28));
    if (s % 28) result.push(0x11A7 + s % 28);
  } else if (decomposition[cp]) {
    for (const part of decomposition[cp]) decompose(part, result);
  } else result.push(cp);
}
function composePair(a: number, b: number): number | undefined {
  if (a >= 0x1100 && a < 0x1113 && b >= 0x1161 && b < 0x1176)
    return 0xAC00 + (a - 0x1100) * 588 + (b - 0x1161) * 28;
  if (a >= 0xAC00 && a < 0xD7A4 && (a - 0xAC00) % 28 === 0 && b > 0x11A7 && b < 0x11C3)
    return a + b - 0x11A7;
  return composition[a + ',' + b];
}
function normalize(text: string, form: 'NFC' | 'NFD'): string {
  const ordered: number[] = [];
  for (const char of text) decompose(char.codePointAt(0)!, ordered);
  // Stable canonical ordering. A starter fences each combining sequence.
  for (let i = 1; i < ordered.length; i++) {
    const currentClass = cc(ordered[i]);
    if (!currentClass) continue;
    let j = i;
    while (j > 0 && cc(ordered[j - 1]) > currentClass) {
      [ordered[j], ordered[j - 1]] = [ordered[j - 1], ordered[j]];
      j--;
    }
  }
  if (form === 'NFD') return ordered.map(cp => String.fromCodePoint(cp)).join('');
  const result: number[] = [];
  let starter = -1, previousClass = 0;
  for (const cp of ordered) {
    const currentClass = cc(cp);
    const composite = starter < 0 ? undefined : composePair(result[starter], cp);
    if (composite !== undefined && (previousClass === 0 || previousClass < currentClass)) {
      result[starter] = composite;
    } else {
      if (currentClass === 0) starter = result.length;
      result.push(cp);
      previousClass = currentClass;
    }
  }
  return result.map(cp => String.fromCodePoint(cp)).join('');
}
function fullLower(text: string): string {
  const points = Array.from(text, ch => ch.codePointAt(0)!);
  return points.map((cp, i) => {
    if (cp === 0x03A3) {
      let before = i - 1, after = i + 1;
      while (before >= 0 && inRanges(points[before], caseIgnorable)) before--;
      while (after < points.length && inRanges(points[after], caseIgnorable)) after++;
      if (before >= 0 && inRanges(points[before], cased) && (after === points.length || !inRanges(points[after], cased)))
        return '\u03C2';
    }
    return (lowercase[cp] ?? [cp]).map(p => String.fromCodePoint(p)).join('');
  }).join('');
}
export function prepareNamespaceName(raw: string): string {
  const prepared = normalize(fullLower(normalize(raw.replace(removed, ''), 'NFC')), 'NFC');
  if (prepared.length > 65536) throw new RangeError('Prepared name exceeds 65536 UTF-16 units.');
  if (!prepared) throw new RangeError('Name is empty after removing spacing. Enter a usable name.');
  return prepared;
}
export function namespaceSegmentKey(actual: string): string {
  const decomposed = normalize(actual.replace(removed, ''), 'NFD');
  const folded = Array.from(decomposed, ch => (caseFold[ch.codePointAt(0)!] ?? [ch.codePointAt(0)!]).map(cp => String.fromCodePoint(cp)).join('')).join('');
  return normalize(folded, 'NFD');
}
export function namespacePathKey(segments: readonly string[]): string {
  return JSON.stringify(segments.map(namespaceSegmentKey));
}
