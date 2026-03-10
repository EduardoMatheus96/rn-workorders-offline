import React from 'react';
import { useSyncStore } from '../../../stores/syncStore';
import { Text, View } from 'react-native';

export function SyncStatusBar() {
    const { networkStatus, isSyncing, pendingCount } = useSyncStore();
    const isOnline = networkStatus === 'online';

    return (
        <View className={`flex-row items-center gap-2 px-4 py-2 ${isOnline ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            <View className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}/>
            <Text className={`text-xs font-medium flex-1 ${isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isSyncing
                    ? 'Sincronizando...'
                    : isOnline
                        ? 'Conectado - todas as ordens sincronizadas'
                        : `${pendingCount} sincronização(ões) pendente(s)`
                }
            </Text>
            {!isOnline && (
                <Text className="text-xs text-amber-600 opacity-70">Offline</Text>
            )}
        </View>
    );
}