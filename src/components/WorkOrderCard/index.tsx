import React from 'react';
import { WorkOrder } from '../../database/schemas/WorkOrderSchema';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBadge } from '../StatusBadge';
import Icon from 'react-native-vector-icons/Feather';

interface WorkOrderCardProps {
    order: WorkOrder;
    onPress: () => void;
}

function formatDate(isoString: string): string {
    try {
        return new Date(isoString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
        });
    } catch {
        return '';   
    }
} 

export function WorkOrderCard({ order, onPress }: WorkOrderCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="bg-white rounded-2xl border border-gray-100 p-4 mb-3"
        >
            <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1.5">
                        <StatusBadge status={order.status} />
                        {order._isPendingSync && (
                            <Icon name="cloud-off" size={14} color="#9CA3AF"/>
                        )}
                    </View>
                    <Text
                        className="text-sm font-semibold text-gray-800 leading-snug"
                        numberOfLines={2}
                    >
                        {order.title}
                    </Text>
                </View>
                <Icon name="chevron-right" size={16} color="#9CA3AF" style={styles.chevronIcon}/>
            </View>

            <View className="h-px bg-gray-100 my-3" />

            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5 flex-1">
                    <Icon name="user" size={12} color="#9CA3AF"/>
                    <Text className="text-xs text-gray-500 font-medium" numberOfLines={1}>
                        {order.assignedTo}
                    </Text>
                </View>
                <View className="flex-row items-center gap-1 shrink-0">
                    <Icon name="calendar" size={12} color="#9CA3AF"/>
                    <Text className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chevronIcon: { marginTop: 2 },
});