import React from 'react';
import { Text, View } from 'react-native';
import { WorkOrderStatus } from '../../../types/workOrder';

const STATUS_STYLES: Record<WorkOrderStatus, string> = {
    'Pending': 'bg-[#F59E0B]',
    'In Progress': 'bg-[#3B82F6]',
    'Completed': 'bg-[#10B981]',
};

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
    'Pending': 'Pendente',
    'In Progress': 'Em Andamento',
    'Completed': 'Concluído',
};

interface StatusBadgeProps {
    status: WorkOrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <View className={`px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
            <Text className="text-white text-xs font-semibold tracking-wide">
                {STATUS_LABELS[status]}
            </Text>
        </View>
    );
}