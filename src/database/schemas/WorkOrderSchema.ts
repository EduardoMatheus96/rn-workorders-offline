import Realm from 'realm';

export class WorkOrder extends Realm.Object<WorkOrder> {
    _id!: string;
    title!: string;
    description!: string;
    status!: 'Pending' | 'In Progress' | 'Completed';
    assignedTo!: string;
    createdAt!: string;
    updatedAt!: string;
    deletedAt?: string;
    completed!: boolean;
    deleted!: boolean;

    _isPendingSync!: boolean;
    _pendingOperation?: 'create' | 'update' | 'delete';

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