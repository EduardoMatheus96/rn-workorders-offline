import Realm from 'realm';
import { PendingOperation, WorkOrderStatus } from '../../types/workOrder';

export class WorkOrder extends Realm.Object<WorkOrder> {
    _id!: string;
    title!: string;
    description!: string;
    status!: WorkOrderStatus;
    assignedTo!: string;
    createdAt!: string;
    updatedAt!: string;
    deletedAt?: string;
    completed!: boolean;
    deleted!: boolean;

    _isPendingSync!: boolean;
    _pendingOperation?: PendingOperation;

    static schema: Realm.ObjectSchema = {
        name: 'WorkOrder',
        primaryKey: '_id',
        properties: {
            _id: 'string',
            title: 'string',
            description: 'string',
            status: 'string',
            assignedTo: 'string',
            createdAt: 'string',
            updatedAt: 'string',
            deletedAt: 'string?',
            completed: {type: 'bool', default: false},
            deleted: {type: 'bool', default: false},
            _isPendingSync: {type: 'bool', default: false},
            _pendingOperation: 'string?',
        },
    }
}