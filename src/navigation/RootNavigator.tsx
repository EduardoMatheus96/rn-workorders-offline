import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { WorkOrderDetailScreen } from '../screens/WorkOrderDetailScreen';
import { WorkOrderFormScreen } from '../screens/WorkOrderFormScreen';
import { WorkOrderListScreen } from '../screens/WorkOrderListScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="WorkOrderList">
      <Stack.Screen
        name="WorkOrderList"
        component={WorkOrderListScreen}
        options={{ title: 'Work Orders' }}
      />
      <Stack.Screen
        name="WorkOrderDetail"
        component={WorkOrderDetailScreen}
        options={{ title: 'Details' }}
      />
      <Stack.Screen
        name="WorkOrderForm"
        component={WorkOrderFormScreen}
        options={({ route }) => ({
          title: route.params?.id ? 'Edit Work Order' : 'New Work Order',
        })}
      />
    </Stack.Navigator>
  );
}
