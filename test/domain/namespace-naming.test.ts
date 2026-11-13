import { describe, expect, it } from 'vitest';
import { prepareNamespaceName as prepare, namespaceSegmentKey as key, namespacePathKey } from '@domain/namespace-naming';
describe('pinned Unicode 17 namespace naming', () => {
  it.each([[' Brand\u00A0Blue\t','brandblue'],['E\u0301','é'],['ΟΣ','ος'],['ΟΣΑ','οσα'],['ΟΣ\u0301','ος\u0301'],['İ','i\u0307'],['\u{1C89}','\u{1C8A}'],['\u{10D50}','\u{10D70}'],['\u1100\u1161\u11A8','각']])('prepares %s', (raw, result) => expect(prepare(raw)).toBe(result));
  it('removes exactly R, preserving script joiners and accents', () => {
    const r = '\u0009\u000A\u000B\u000C\u000D \u0085\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000\u200B\u2060\uFEFF';
    expect(prepare('É'+r+'\u200C\u200D')).toBe('é\u200C\u200D');
    expect(() => prepare(r)).toThrow('empty');
  });
  it('uses canonical full folding, not lowercase or Turkic folding', () => {
    expect(key('Straße')).toBe(key('STRASSE'));
    expect(key('ς')).toBe(key('σ'));
    expect(key('É')).toBe(key('E\u0301'));
    expect(key('é')).not.toBe(key('e'));
    expect(new Set(['İ','i','ı'].map(key)).size).toBe(3);
    expect(key('ﬃ')).toBe(key('FFI'));
    expect(namespacePathKey(['a.b'])).not.toBe(namespacePathKey(['a','b']));
  });
});
