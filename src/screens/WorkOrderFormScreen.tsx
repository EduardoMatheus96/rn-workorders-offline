import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useObject, useRealm } from '@realm/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { WorkOrder } from '../database/schemas/WorkOrderSchema';
import { RootStackParamList } from '../navigation/types';
import { WorkOrderFormData, workOrderSchema } from '../schemas/workOrderSchema';

type FormRouteProp = RouteProp<RootStackParamList, 'WorkOrderForm'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderForm'>;

const STATUS_OPTIONS: { label: string; value: WorkOrderFormData['status'] }[] = [
    { label: 'Pendente', value: 'Pending' },
    { label: 'Em Andamento', value: 'In Progress' },
    { label: 'Concluído', value: 'Completed' },
];

export function WorkOrderFormScreen() {
    const route = useRoute<FormRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const realm = useRealm();
    const { id } = route.params ?? {};

    const existingOrder = useObject(WorkOrder, id ?? '');
    const isEditMode = !!id && !!existingOrder;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<WorkOrderFormData>({
        resolver: zodResolver(workOrderSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'Pending',
            assignedTo: '',
        },
    });

    useEffect(() => {
        if (isEditMode && existingOrder) {
            reset({
                title: existingOrder.title,
                description: existingOrder.description ?? '',
                status: existingOrder.status,
                assignedTo: existingOrder.assignedTo,
            });
        }
    }, [isEditMode, existingOrder, reset]);

    const onSubmit = (data: WorkOrderFormData) => {
        const now = new Date().toISOString();

        realm.write(() => {
            if (isEditMode && existingOrder) {
                existingOrder.title = data.title;
                existingOrder.description = data.description ?? '';
                existingOrder.status = data.status;
                existingOrder.assignedTo = data.assignedTo;
                existingOrder.updatedAt = now;
                existingOrder.completed = data.status === 'Completed';
                existingOrder._isPendingSync = true;
                existingOrder._pendingOperation = 'update';
            } else {
                realm.create(WorkOrder, {
                    _id: String(uuid.v4()),
                    title: data.title,
                    description: data.description ?? '',
                    status: data.status,
                    assignedTo: data.assignedTo,
                    createdAt: now,
                    updatedAt: now,
                    completed: data.status === 'Completed',
                    deleted: false,
                    _isPendingSync: true,
                    _pendingOperation: 'create',
                });
            }
        });

        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled">

                    {/* Título */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            Título <Text className="text-red-500">*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={`bg-white border rounded-xl px-4 h-12 text-gray-800 ${
                                        errors.title ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder="Ex: Manutenção preventiva..."
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    returnKeyType="next"
                                />
                            )}
                        />
                        {errors.title && (
                            <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>
                        )}
                    </View>

                    {/* Descrição */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">Descrição</Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={`bg-white border rounded-xl px-4 py-3 text-gray-800 ${
                                        errors.description ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder="Descreva os detalhes da ordem..."
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={styles.textArea}
                                />
                            )}
                        />
                        {errors.description && (
                            <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>
                        )}
                    </View>

                    {/* Status */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            Status <Text className="text-red-500">*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field: { onChange, value } }) => (
                                <View className="flex-row gap-2">
                                    {STATUS_OPTIONS.map(option => (
                                        <TouchableOpacity
                                            key={option.value}
                                            onPress={() => onChange(option.value)}
                                            className={`flex-1 h-10 rounded-xl items-center justify-center border ${
                                                value === option.value
                                                    ? 'bg-blue-600 border-blue-600'
                                                    : 'bg-white border-gray-200'
                                            }`}>
                                            <Text
                                                className={`text-xs font-semibold ${
                                                    value === option.value ? 'text-white' : 'text-gray-500'
                                                }`}>
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        />
                    </View>

                    {/* Responsável */}
                    <View className="mb-8">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            Responsável <Text className="text-red-500">*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="assignedTo"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={`bg-white border rounded-xl px-4 h-12 text-gray-800 ${
                                        errors.assignedTo ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder="Nome do responsável..."
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    returnKeyType="done"
                                />
                            )}
                        />
                        {errors.assignedTo && (
                            <Text className="text-red-500 text-xs mt-1">{errors.assignedTo.message}</Text>
                        )}
                    </View>

                    {/* Botão de submit */}
                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-blue-600 h-14 rounded-2xl items-center justify-center">
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-base">
                                {isEditMode ? 'Salvar Alterações' : 'Criar Ordem'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: { padding: 16 },
    textArea: { minHeight: 100 },
});