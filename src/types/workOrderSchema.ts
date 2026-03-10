import { z } from 'zod';

export const workOrderSchema = z.object({
    title: z
        .string()
        .min(1, 'Título é obrigatório')
        .min(3, 'Título deve ter pelo menos 3 caracteres')
        .max(100, 'Título deve ter no máximo 100 caracteres'),
    description: z
        .string()
        .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    status: z.enum(['Pending', 'In Progress', 'Completed'], {
        errorMap: () => ({ message: 'Status é obrigatório' }),
    }),
    assignedTo: z
        .string()
        .min(1, 'Responsável é obrigatório')
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres'),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;