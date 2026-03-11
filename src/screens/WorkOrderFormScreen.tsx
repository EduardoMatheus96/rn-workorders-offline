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
import { WorkOrder } from '../realm/schemas/WorkOrderSchema';
import { RootStackParamList } from '../routes/types';
import { WorkOrderFormData, workOrderSchema } from '../types/workOrderSchema';
import { useTranslation } from 'react-i18next';

type FormRouteProp = RouteProp<RootStackParamList, 'WorkOrderForm'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'WorkOrderForm'>;

const getStatusOptions = (t: (key: string) => string) => [
    { label: t('status.Pending'), value: 'Pending' as WorkOrderFormData['status'] },
    { label: t('status.In Progress'), value: 'In Progress' as WorkOrderFormData['status'] },
    { label: t('status.Completed'), value: 'Completed' as WorkOrderFormData['status'] },
];

export function WorkOrderFormScreen() {
    const route = useRoute<FormRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const realm = useRealm();
    const { id } = route.params ?? {};
    const { t } = useTranslation();
    const STATUS_OPTIONS = getStatusOptions(t);

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

                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            {t('workOrderForm.fields.title')}<Text className="text-red-500"> *</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={`bg-white border rounded-xl px-4 h-12 text-gray-800 ${
                                        errors.title ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder={t('workOrderForm.fields.titlePlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    returnKeyType="next"
                                    accessibilityLabel={t('workOrderForm.fields.title')}
                                />
                            )}
                        />
                        {errors.title && (
                            <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">{t('workOrderForm.fields.description')}</Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={`bg-white border rounded-xl px-4 py-3 text-gray-800 ${
                                        errors.description ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder={t('workOrderForm.fields.descriptionPlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    style={styles.textArea}
                                    accessibilityLabel={t('workOrderForm.fields.description')}
                                />
                            )}
                        />
                        {errors.description && (
                            <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            {t('workOrderForm.fields.status')}<Text className="text-red-500"> *</Text>
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

                    <View className="mb-8">
                        <Text className="text-sm font-semibold text-gray-700 mb-1.5">
                            {t('workOrderForm.fields.assignedTo')}<Text className="text-red-500"> *</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="assignedTo"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    className={`bg-white border rounded-xl px-4 h-12 text-gray-800 ${
                                        errors.assignedTo ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder={t('workOrderForm.fields.assignedToPlaceholder')}
                                    placeholderTextColor="#9CA3AF"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    returnKeyType="done"
                                    accessibilityLabel={t('workOrderForm.fields.assignedTo')}
                                />
                            )}
                        />
                        {errors.assignedTo && (
                            <Text className="text-red-500 text-xs mt-1">{errors.assignedTo.message}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-blue-600 h-14 rounded-2xl items-center justify-center"
                        accessibilityState={{ disabled: isSubmitting }}
                        >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-white font-bold text-base">
                                {isEditMode ? t('workOrderForm.submit.edit') : t('workOrderForm.submit.create')}
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