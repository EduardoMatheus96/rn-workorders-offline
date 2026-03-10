import { z } from 'zod';
import { WorkOrderStatus } from './workOrder';

const STATUS_VALUES = [
    'Pending',
    'In Progress',
    'Completed',
] as const satisfies readonly WorkOrderStatus[];

export const workOrderSchema = z.object({
    title: z
        .string()
        .min(1, 'Título é obrigatório')
        .min(3, 'Título deve ter pelo menos 3 caracteres')
        .max(100, 'Título deve ter no máximo 100 caracteres'),
    description: z
        .string()
        .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    status: z.enum(STATUS_VALUES, {
        errorMap: () => ({ message: 'Status é obrigatório' }),
    }),
    assignedTo: z
        .string()
        .min(1, 'Responsável é obrigatório')
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(50, 'Nome deve ter no máximo 50 caracteres'),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;