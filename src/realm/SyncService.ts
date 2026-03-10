import Realm from 'realm';
import { api }  from '../services/api';
import { WorkOrder } from './schemas/WorkOrderSchema';

function mapToDTO(order: WorkOrder){
    return {
        id: order._id,
        title: order.title,
        description: order.description,
        status: order.status,
        assignedTo: order.assignedTo,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        completed: order.completed,
        deleted: order.deleted,
        deletedAt: order.deletedAt,
    };
}

export async function pushLocalChanges(realm: Realm) {
    const pending = realm
        .objects(WorkOrder)
        .filtered('_isPendingSync == true');

    for (const order of pending) {
        try {
            if (order._pendingOperation === 'create') {
                await  api.post('/work-orders', mapToDTO(order));
            } else if (order._pendingOperation === 'update') {
                await api.put(`/work-orders/${order._id}`, mapToDTO(order));
            } else if (order._pendingOperation === 'delete') {
                await api.delete(`/work-orders/${order._id}`);
            }

            realm.write(() => {
                order._isPendingSync = false;
                order._pendingOperation = undefined;
            });
        } catch (error) {
            console.error(`Failed to sync order ${order._id}:`, error);
        }
    }
}

export async function syncFromServer(since: string, realm: Realm) {
    const isEpoch = since === new Date(0).toISOString();

    let created: any[] = [];
    let updated: any[] = [];
    let deleted: any[] = [];

    if (isEpoch) {
        const { data } = await api.get('/work-orders');
        created = Array.isArray(data) ? data : [];
    } else {
        const { data } = await api.get('/work-orders/sync', {
            params: { since },
        });
        created = data.created ?? [];
        updated = data.updated ?? [];
        deleted = data.deleted ?? [];
    }

    realm.write(() => {
        [...created, ...updated].forEach((item: any) => {
            const local = realm.objectForPrimaryKey(WorkOrder, String(item.id));
            if (!local || new Date(item.updatedAt) > new Date(local.updatedAt)) {
                realm.create(WorkOrder, {
                    _id: String(item.id),
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    assignedTo: item.assignedTo,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    completed: item.completed ?? false,
                    deleted: false,
                    _isPendingSync: false,
                }, Realm.UpdateMode.Modified);
            }
        });

        deleted.forEach((item: any) => {
            const order = realm.objectForPrimaryKey(WorkOrder, String(item));
            if (order) {
                order.deleted = true;
                order.deletedAt = new Date().toISOString();
            }
        });
    });
}