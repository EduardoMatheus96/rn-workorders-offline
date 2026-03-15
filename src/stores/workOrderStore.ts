import { create } from 'zustand';
import { WorkOrder } from '../realm/schemas/WorkOrderSchema';

interface WorkOrderStore {
    selectedOrder: WorkOrder | null;
    setSelectedOrder: (order: WorkOrder | null) => void;
}

export const useWorkOrderStore = create<WorkOrderStore>((set) => ({
    selectedOrder: null,
    setSelectedOrder: (order) => set({ selectedOrder: order }),
}));