import { z } from 'zod';
import { WorkOrderStatus } from './workOrder';
import i18n from '../i18n';

const STATUS_VALUES = [
    'Pending',
    'In Progress',
    'Completed',
] as const satisfies readonly WorkOrderStatus[];

export const workOrderSchema = z.object({
    title: z
        .string()
        .min(1, i18n.t('validation.titleRequired'))
        .min(3, i18n.t('validation.titleMin3'))
        .max(100, i18n.t('validation.titleMax100')),
    description: z
        .string()
        .max(500, i18n.t('validation.descriptionMax500')),
    status: z.enum(STATUS_VALUES, {
        errorMap: () => ({ message: i18n.t('validation.statusRequired') }),
    }),
    assignedTo: z
        .string()
        .min(1, i18n.t('validation.assignedToRequired'))
        .min(2, i18n.t('validation.nameMin2'))
        .max(50, i18n.t('validation.nameMax50')),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;