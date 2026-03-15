import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useObject, useRealm } from '@realm/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { WorkOrder } from '../realm/schemas/WorkOrderSchema';
import { StatusBadge } from '../atoms/work-orders/StatusBadge';
import { RootStackParamList } from '../routes/types';
import { formatDateFull } from '../utils/formatDate';
import { InfoRow } from '../atoms/work-orders/InfoRow';
import { useTheme } from '../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


type DetailRouteProp = RouteProp<RootStackParamList, 'WorkOrderDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderDetail'>;

export function WorkOrderDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { id } = route.params;
  const { t } = useTranslation();
  const { iconColor } = useTheme();
  const realm = useRealm();
  const insets = useSafeAreaInsets();


  const order = useObject(WorkOrder, id);

  const handleDelete = () => {
    Alert.alert(
      t('workOrderDetail.deleteConfirmTitle'),
      t('workOrderDetail.deleteConfirmMessage'),
      [
        { text: t('workOrderDetail.deleteConfirmCancel'), style: 'cancel' },
        {
          text: t('workOrderDetail.deleteConfirmOk'),
          style: 'destructive',
          onPress: () => {
            realm.write(() => {
              if (order) {
                order.deleted = true;
                order.deletedAt = new Date().toISOString();
                order._isPendingSync = true;
                order._pendingOperation = 'delete';
              }
            });
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-inmeta-greenDark items-center justify-center" style={{ paddingTop: insets.top }}>
        <Icon name="alert-circle" size={48} color={iconColor.muted} />
        <Text className="text-gray-400 dark:text-inmeta-greenText text-sm mt-3">
          {t('workOrderDetail.notFound')}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-inmeta-greenDark" style={{ paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View className="bg-white dark:bg-inmeta-greenMid rounded-2xl border border-gray-100 dark:border-inmeta-greenBorder p-4 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <StatusBadge status={order.status} />
            {order._isPendingSync && (
              <View className="flex-row items-center gap-1">
                <Icon name="cloud-off" size={12} color={iconColor.muted} />
                <Text className="text-xs text-gray-400 dark:text-inmeta-greenText">
                  {t('workOrderDetail.pendingSync')}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {order.title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-inmeta-greenText leading-relaxed">
            {order.description}
          </Text>
        </View>

        <View className="bg-white dark:bg-inmeta-greenMid rounded-2xl border border-gray-100 dark:border-inmeta-greenBorder px-4 mb-4">
          <InfoRow
            icon="user"
            label={t('workOrderDetail.assignedTo')}
            value={order.assignedTo}
          />
          <InfoRow
            icon="calendar"
            label={t('workOrderDetail.createdAt')}
            value={formatDateFull(order.createdAt)}
          />
          <InfoRow
            icon="refresh-cw"
            label={t('workOrderDetail.updatedAt')}
            value={formatDateFull(order.updatedAt)}
          />
          <InfoRow icon="hash" label="ID" value={order._id} />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleDelete}
        className="absolute right-24 w-14 h-14 rounded-full bg-red-500 items-center justify-center shadow-lg"
        accessibilityLabel={t('workOrderDetail.deleteOrder')}
        style={{ bottom: 24 + insets.bottom }}
      >
        <Icon name="trash-2" size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('WorkOrderForm', { id: order._id })}
        className="absolute right-5 w-14 h-14 rounded-full bg-inmeta-orange items-center justify-center shadow-lg"
        accessibilityLabel={t('workOrderDetail.editOrder')}
        style={{ bottom: 24 + insets.bottom }}
      >
        <Icon name="edit-2" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 16, paddingBottom: 96 },
});