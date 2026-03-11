import { workOrderSchema } from '../../src/types/workOrderSchema';

describe('workOrderSchema', () => {
  const validData = {
    title: 'Manutenção elétrica',
    description: 'Verificar painéis',
    status: 'Pending' as const,
    assignedTo: 'João Silva',
  };

  it('valida dados corretos sem erros', () => {
    const result = workOrderSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejeita título vazio', () => {
    const result = workOrderSchema.safeParse({ ...validData, title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('title');
    }
  });

  it('rejeita título com menos de 3 caracteres', () => {
    const result = workOrderSchema.safeParse({ ...validData, title: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejeita título com mais de 100 caracteres', () => {
    const result = workOrderSchema.safeParse({ ...validData, title: 'A'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejeita descrição com mais de 500 caracteres', () => {
    const result = workOrderSchema.safeParse({ ...validData, description: 'A'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('rejeita status inválido', () => {
    const result = workOrderSchema.safeParse({ ...validData, status: 'Unknown' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('status');
    }
  });

  it('rejeita assignedTo vazio', () => {
    const result = workOrderSchema.safeParse({ ...validData, assignedTo: '' });
    expect(result.success).toBe(false);
  });

  it('aceita descrição vazia', () => {
    const result = workOrderSchema.safeParse({ ...validData, description: '' });
    expect(result.success).toBe(true);
  });

  it('aceita todos os status válidos', () => {
    const statuses = ['Pending', 'In Progress', 'Completed'] as const;
    statuses.forEach(status => {
      const result = workOrderSchema.safeParse({ ...validData, status });
      expect(result.success).toBe(true);
    });
  });
});