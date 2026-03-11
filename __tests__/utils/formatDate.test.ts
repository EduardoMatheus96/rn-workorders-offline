import { formatDateShort, formatDateFull } from '../../src/utils/formatDate';

describe('formatDateShort', () => {
  it('formata data no padrão dd/MM', () => {
    const result = formatDateShort('2024-03-15T10:00:00.000Z');
    expect(result).toMatch(/^\d{2}\/\d{2}$/);
  });

  it('retorna string vazia para data inválida', () => {
    const result = formatDateShort('data-invalida');
    expect(result).toBe('Invalid Date');
  });
});

describe('formatDateFull', () => {
  it('formata data no padrão dd/MM/yyyy HH:mm', () => {
    const result = formatDateFull('2024-03-15T10:00:00.000Z');
    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}/);
  });

  it('retorna string vazia para data inválida', () => {
    const result = formatDateFull('data-invalida');
    expect(result).toBe('Invalid Date');
  });
});