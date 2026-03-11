import React from 'react';
import { useSyncStore } from '../../../stores/syncStore';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export function SyncStatusBar() {
    const { t } = useTranslation();
    const { networkStatus, isSyncing, pendingCount } = useSyncStore();
    const isOnline = networkStatus === 'online';

    return (
        <View
            className={`flex-row items-center gap-2 px-4 py-2 ${
                isOnline
                    ? 'bg-emerald-50 dark:bg-inmeta-greenDark'
                    : 'bg-amber-50 dark:bg-inmeta-greenDark'
            }`}
            accessibilityLiveRegion="polite"
        >
            <View className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 dark:bg-inmeta-greenAccent' : 'bg-amber-500'}`} />
            <Text className={`text-xs font-medium flex-1 ${
                isOnline
                    ? 'text-emerald-700 dark:text-inmeta-greenAccent'
                    : 'text-amber-700 dark:text-amber-400'
            }`}>
                {isSyncing
                    ? t('sync.syncing')
                    : isOnline
                        ? t('sync.connected')
                        : t('sync.pendingCount', { count: pendingCount })
                }
            </Text>
            {!isOnline && (
                <Text className="text-xs text-amber-600 dark:text-amber-400 opacity-70">
                    {t('sync.offline')}
                </Text>
            )}
        </View>
    );
}