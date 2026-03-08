import { create } from 'zustand';

interface SyncStore {
    isSyncing: boolean;
    lastSyncedAt: string | null;
    pendingCount: number;
    networkStatus: 'online' | 'offline';
    setSyncing: (v: boolean) => void;
    setLastSync: (date: string) => void;
    setPendingCount: (n: number) => void;
    setNetworkStatus: (s: 'online' | 'offline') => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
    isSyncing: false,
    lastSyncedAt: null,
    pendingCount: 0,
    networkStatus: 'online',
    setSyncing: (isSyncing) => set({ isSyncing }),
    setLastSync: (lastSyncedAt) => set({ lastSyncedAt }),
    setPendingCount: (pendingCount) => set({ pendingCount }),
    setNetworkStatus: (networkStatus) => set({ networkStatus }),
}));