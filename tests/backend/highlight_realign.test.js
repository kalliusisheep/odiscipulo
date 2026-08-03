// tests/backend/highlight_realign.test.js
const { realignOffsets } = require('../../backend/lib/highlight_realign');

describe('highlight_realign', () => {
  it('should find exact match', () => {
    const orig = 'Este é um parágrafo de exemplo que contém um trecho importante.';
    const hi = 'um trecho importante';
    const res = realignOffsets(orig, hi);
    expect(res).not.toBeNull();
    expect(orig.slice(res.start, res.end)).toBe(hi);
  });

  it('should handle small differences (extra spaces/newlines)', () => {
    const orig = 'Linha com   espaços e\nquebras de linha que precisam ser tratadas.';
    const hi = 'espaços e que precisam';
    const res = realignOffsets(orig, hi);
    expect(res).not.toBeNull();
    expect(orig.slice(res.start, res.end).replace(/\s+/g, ' ')).toContain('espaços e que');
  });

  it('should return null when not found', () => {
    const orig = 'Texto sem relação';
    const hi = 'trecho que nao existe';
    const res = realignOffsets(orig, hi);
    expect(res).toBeNull();
  });
});
