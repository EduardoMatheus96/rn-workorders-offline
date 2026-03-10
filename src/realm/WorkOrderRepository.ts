import { useRealm } from '@realm/react';
import uuid from 'react-native-uuid';
import { WorkOrder } from './schemas/WorkOrderSchema';

export type CreateWorkOrderDTO = {
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    assignedTo: string;
}

export function useWorkOrderRepository() {
    const realm = useRealm();

    return {
        getAll: () => 
            realm.objects(WorkOrder).filtered('deleted == false'),

        getById: (id: string) =>
            realm.objectForPrimaryKey(WorkOrder, id),

        getPendingSync: () =>
            realm.objects(WorkOrder).filtered('_isPendingSync == true'),

        create: (data: CreateWorkOrderDTO) => {
            realm.write(() => {
                realm.create(WorkOrder, {
                    ...data,
                    _id: uuid.v4() as string,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    completed: false,
                    deleted: false,
                    _isPendingSync: true,
                    _pendingOperation: 'create',
                });
            });
        },

        update: (id: string, data: Partial<CreateWorkOrderDTO>) => {
            realm.write(() => {
                const order = realm.objectForPrimaryKey(WorkOrder, id);
                if (order) {
                    Object.assign(order, {
                        ...data,
                        updatedAt: new Date().toISOString(),
                        _isPendingSync: true,
                        _pendingOperation: 'update',
                    });
                }
            });
        },

        delete: (id: string) => {
            realm.write(() => {
                const order = realm.objectForPrimaryKey(WorkOrder, id);
                if (order) {
                    order.deleted = true;
                    order.deletedAt = new Date().toISOString();
                    order._isPendingSync = true;
                    order._pendingOperation = 'delete';
                }
            });
        },
    };
}