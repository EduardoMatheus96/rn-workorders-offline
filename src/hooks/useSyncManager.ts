import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { useRealm } from '@realm/react';
import { pushLocalChanges, syncFromServer } from '../sync/SyncService';
import {
  getLastSyncedAt,
  setLastSyncedAt,
} from '../database/SyncMetaRepository';
import { useSyncStore } from '../store/syncStore';

export function useSyncManager() {
  const realm = useRealm();
  const { setSyncing, setLastSync, setNetworkStatus } = useSyncStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      const isOnline = state.isConnected === true;
      setNetworkStatus(isOnline ? 'online' : 'offline');

      if (isOnline) {
        setSyncing(true);
        try {
          const lastSync = getLastSyncedAt(realm);
          await pushLocalChanges(realm);
          await syncFromServer(lastSync, realm);
          const now = new Date().toISOString();
          setLastSyncedAt(realm, now);
          setLastSync(now);
        } catch (error: any) {
          const msg = error?.response?.data ?? error?.message ?? error;
          console.error('Sync failed:', JSON.stringify(msg));
        } finally {
          setSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, [realm, setSyncing, setLastSync, setNetworkStatus]);
}
