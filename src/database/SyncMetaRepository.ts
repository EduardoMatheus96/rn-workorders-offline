import Realm from 'realm';
import { SyncMeta } from './schemas/SyncMetaSchema';

const SYNC_KEY = 'workOrders';

export function getLastSyncedAt(realm: Realm): string {
    const meta = realm.objectForPrimaryKey(SyncMeta, SYNC_KEY);
    return meta?.lastSyncedAt ?? new Date(0).toISOString();
}

export function setLastSyncedAt(realm: Realm, date: string){
    realm.write(() => {
        realm.create(
            SyncMeta, 
            { key: SYNC_KEY, lastSyncedAt: date}, 
            Realm.UpdateMode.Modified);
    });
}