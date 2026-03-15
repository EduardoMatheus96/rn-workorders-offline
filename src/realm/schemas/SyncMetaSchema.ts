import Realm from 'realm';

export class SyncMeta extends Realm.Object<SyncMeta> {
    key!: string;
    lastSyncedAt!: string;

    static schema: Realm.ObjectSchema = {
        name: 'SyncMeta',
        primaryKey: 'key',
        properties: {
            key: 'string',
            lastSyncedAt: 'string',
        },
    };
}