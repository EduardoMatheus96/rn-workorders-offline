import React from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WorkOrderStatus } from '../../../types/workOrder';

const STATUS_STYLES: Record<WorkOrderStatus, string> = {
    'Pending': 'bg-[#F59E0B]',
    'In Progress': 'bg-[#3B82F6]',
    'Completed': 'bg-[#10B981]',
};

interface StatusBadgeProps {
    status: WorkOrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const { t } = useTranslation();

    return (
        <View className={`px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
            <Text className="text-white text-xs font-semibold tracking-wide">
                {t(`status.${status}`)}
            </Text>
        </View>
    );
}