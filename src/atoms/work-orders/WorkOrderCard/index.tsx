import React from 'react';
import { WorkOrder } from '../../../realm/schemas/WorkOrderSchema';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBadge } from '../StatusBadge';
import Icon from 'react-native-vector-icons/Feather';
import { formatDateShort } from '../../../utils/formatDate';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';

interface WorkOrderCardProps {
    order: WorkOrder;
    onPress: () => void;
}

export function WorkOrderCard({ order, onPress }: WorkOrderCardProps) {
    const { t } = useTranslation();
    const { iconColor } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${order.title}, ${order.status}${order._isPendingSync ? `, ${t('workOrderCard.pendingSync')}` : ''}, ${t('workOrderCard.assignedTo')} ${order.assignedTo}, ${t('workOrderCard.createdAt')} ${formatDateShort(order.createdAt)}`}
            className="bg-white dark:bg-inmeta-greenMid rounded-2xl border border-gray-100 dark:border-inmeta-greenBorder p-4 mb-3"
        >
            <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1.5">
                        <StatusBadge status={order.status} />
                        {order._isPendingSync && (
                            <Icon name="cloud-off" size={14} color={iconColor.muted} />
                        )}
                    </View>
                    <Text
                        className="text-sm font-semibold text-gray-800 dark:text-white leading-snug"
                        numberOfLines={2}
                    >
                        {order.title}
                    </Text>
                </View>
                <Icon name="chevron-right" size={16} color={iconColor.muted} style={styles.chevronIcon} />
            </View>

            <View className="h-px bg-gray-100 dark:bg-inmeta-greenBorder my-3" />

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5 flex-1">
                    <Icon name="user" size={12} color={iconColor.muted} />
                    <Text className="text-xs text-gray-500 dark:text-inmeta-greenText font-medium" numberOfLines={1}>
                        {order.assignedTo}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1 shrink-0">
                    <Icon name="calendar" size={12} color={iconColor.muted} />
                    <Text className="text-xs text-gray-500 dark:text-inmeta-greenText">
                        {formatDateShort(order.createdAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chevronIcon: { marginTop: 2 },
});