import React, { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { WorkOrder } from '../realm/schemas/WorkOrderSchema';
import { WorkOrderCard } from '../atoms/work-orders/WorkOrderCard';
import { SyncStatusBar } from '../atoms/work-orders/SyncStatusBar';
import { RootStackParamList } from '../routes/types';
import { useSyncManager } from '../hooks/useSyncManager';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';


type NavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderList'>;

type FilterTab = 'All' | 'Pending' | 'In Progress' | 'Completed';

const FILTER_TABS: FilterTab[] = ['All', 'Pending', 'In Progress', 'Completed'];

const TAB_ACTIVE_COLOR: Record<FilterTab, string> = {
  All: 'border-blue-600',
  Pending: 'border-amber-500',
  'In Progress': 'border-blue-500',
  Completed: 'border-emerald-500',
};

const TAB_ACTIVE_TEXT: Record<FilterTab, string> = {
  All: 'text-blue-600',
  Pending: 'text-amber-500',
  'In Progress': 'text-blue-500',
  Completed: 'text-emerald-500',
};

export function WorkOrderListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const { iconColor } = useTheme();

  useSyncManager();

  const orders = useQuery(
    {
        type: WorkOrder,
        query: col => col.filtered('deleted == false').sorted('createdAt', true),
    },
);

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders;
    return orders.filtered('status == $0', activeFilter);
  }, [orders, activeFilter]);

  const counts = useMemo<Record<FilterTab, number>>(
    () => ({
      All: orders.length,
      Pending: orders.filtered('status == "Pending"').length,
      'In Progress': orders.filtered('status == "In Progress"').length,
      Completed: orders.filtered('status == "Completed"').length,
    }),
    [orders],
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-inmeta-greenDark">
      <SyncStatusBar />

      <View className="bg-white dark:bg-inmeta-greenMid border-b border-gray-100 dark:border-inmeta-greenBorder">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {FILTER_TABS.map(tab => {
            const isActive = tab === activeFilter;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveFilter(tab)}
                className={`flex-row items-center gap-1.5 px-4 py-3 border-b-2 ${
                  isActive ? TAB_ACTIVE_COLOR[tab] : 'border-transparent'
                }`}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  className={`text-sm font-medium whitespace-nowrap ${
                    isActive ? TAB_ACTIVE_TEXT[tab] : 'text-gray-400 dark:text-inmeta-greenText'
                  }`}
                >
                  {t(`workOrderList.tabs.${tab}`)}
                </Text>
                <View
                  className={`min-w-[20px] h-5 px-1.5 rounded-full items-center justify-center ${
                    isActive ? 'bg-gray-100 dark:bg-inmeta-greenMid' : 'bg-gray-100 dark:bg-inmeta-greenMid'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isActive ? TAB_ACTIVE_TEXT[tab] : 'text-gray-400 dark:text-inmeta-greenText'
                    }`}
                  >
                    {counts[tab]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders as unknown as WorkOrder[]}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <WorkOrderCard
            order={item}
            onPress={() =>
              navigation.navigate('WorkOrderDetail', { id: item._id })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-24">
            <Icon name="clipboard" size={48} color={iconColor.muted} />
            <Text className="text-gray-400 dark:text-inmeta-greenText text-sm mt-3">
              {t('workOrderList.emptyState')}
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('WorkOrderForm', {})}
        className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-inmeta-orange items-center justify-center shadow-lg"
        accessibilityLabel={t('workOrderList.newOrder')}
      >
        <Icon name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    tabsContent: { paddingHorizontal: 8 },
    listContent: { padding: 16, paddingBottom: 96 },
});