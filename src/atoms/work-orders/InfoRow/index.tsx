import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useTheme } from "../../../hooks/useTheme";

interface InfoRowProps {
    icon: string;
    label: string;
    value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
    const { iconColor } = useTheme();

    return (
        <View className="flex-row items-start gap-3 py-3 border-b border-gray-100 dark:border-inmeta-greenBorder">
            <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-inmeta-greenMid items-center justify-center mt-0.5">
                <Icon name={icon} size={14} color={iconColor.subtle} />
            </View>
            <View className="flex-1">
                <Text className="text-xs text-gray-400 dark:text-inmeta-greenText font-medium mb-0.5">{label}</Text>
                <Text className="text-sm text-gray-800 dark:text-white font-medium">{value}</Text>
            </View>
        </View>
    );
}