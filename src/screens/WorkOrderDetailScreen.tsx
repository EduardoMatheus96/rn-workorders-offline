import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useObject } from '@realm/react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WorkOrder } from '../realm/schemas/WorkOrderSchema';
import { StatusBadge } from '../atoms/work-orders/StatusBadge';
import { RootStackParamList } from '../routes/types';

type DetailRouteProp = RouteProp<RootStackParamList, 'WorkOrderDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderDetail'>;

function formatData(isoString: string): string {
    try {
        return new Date(isoString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '';
    };
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <View className="flex-row items-start gap-3 py-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mt-0.5">
                <Icon name={icon} size={14} color="#6B7280"/>
            </View>
            <View className="flex-1">
                <Text className="text-xs text-gray-400 font-medium mb-0.5">{label}</Text>
                <Text className="text-sm text-gray-800 font-medium">{value}</Text>
            </View>
        </View>
    );
}

export function WorkOrderDetailScreen() {
    const route = useRoute<DetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { id } = route.params;

    const order = useObject(WorkOrder, id);

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <Icon name="alert-circle" size={48} color="#D1D5DB"/>
                <Text className="text-gray-400 text-sm mt-3">Ordem não encontrada</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <StatusBadge status={order.status}/>
                        {order._isPendingSync && (
                            <View className="flex-row items-center gap-1">
                                <Icon name="cloud-off" size={12} color="#9CA3AF"/>
                                <Text className="text-xs text-gray-400">Pendente sync</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-lg font-bold text-gray-900 mb-2">{order.title}</Text>
                    <Text className="text-sm text-gray-500 leading-relaxed">{order.description}</Text>
                </View>

                <View className="bg-white rounded-2xl border border-gray-100 px-4 mb-4">
                    <InfoRow icon="user" label="Responsável" value={order.assignedTo}/>
                    <InfoRow icon="calendar" label="Criado em" value={formatData(order.createdAt)}/>
                    <InfoRow icon="refresh-cw" label="Atualizado em" value={formatData(order.updatedAt)}/>
                    <InfoRow icon="hash" label="ID" value={order._id}/>
                </View>
            </ScrollView>

            <TouchableOpacity 
                onPress={() => navigation.navigate('WorkOrderForm', { id: order._id })}
                className="absolute bottom-6 right-5 w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg"
                accessibilityLabel="Editar ordem de serviço"
            >
                <Icon name="edit-2" size={22} color="#FFFFFF"/>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: 16, paddingBottom: 96 },
});