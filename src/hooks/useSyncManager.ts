import NetInfo from '@react-native-community/netinfo';
import { useEffect, useRef } from 'react';
import { useRealm } from '@realm/react';
import { pushLocalChanges, syncFromServer } from '../realm/SyncService';
import { getLastSyncedAt, setLastSyncedAt } from '../realm/SyncMetaRepository';
import { useSyncStore } from '../stores/syncStore';

export function useSyncManager() {
  const realm = useRealm();
  const { setSyncing, setLastSync, setNetworkStatus } = useSyncStore();
  const syncingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      const isOnline = state.isConnected === true;
      setNetworkStatus(isOnline ? 'online' : 'offline');

      if (isOnline) {
        if (syncingRef.current) return;
        syncingRef.current = true;
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
