import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { WorkOrderDetailScreen } from '../screens/WorkOrderDetailScreen';
import { WorkOrderFormScreen } from '../screens/WorkOrderFormScreen';
import { WorkOrderListScreen } from '../screens/WorkOrderListScreen';
import { RootStackParamList } from './types';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { StyleSheet } from 'react-native';


const Stack = createStackNavigator<RootStackParamList>();

function BackIcon() {
  return (
    <Icon
      name="arrow-left"
      size={22}
      color={colors.gray900}
      style={styles.backIcon}
    />
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WorkOrderList"
      screenOptions={{
        headerBackImage: BackIcon,
      }}
    >
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

const styles = StyleSheet.create({
  backIcon: { marginLeft: 8 },
});