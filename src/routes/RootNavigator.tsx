import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { WorkOrderDetailScreen } from '../screens/WorkOrderDetailScreen';
import { WorkOrderFormScreen } from '../screens/WorkOrderFormScreen';
import { WorkOrderListScreen } from '../screens/WorkOrderListScreen';
import { RootStackParamList } from './types';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

const Stack = createStackNavigator<RootStackParamList>();

function BackIcon() {
  const { isDark } = useTheme();
  return (
    <Icon
      name="arrow-left"
      size={22}
      color={isDark ? colors.white : colors.gray900}
      style={styles.backIcon}
    />
  );
}

function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
      <Icon
        name={isDark ? 'sun' : 'moon'}
        size={20}
        color={isDark ? colors.inmetaGreenAccent : colors.gray500}
      />
    </TouchableOpacity>
  );
}

export function RootNavigator() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const headerStyle = {
    backgroundColor: isDark ? colors.inmetaGreenMid : colors.white,
    shadowColor: isDark ? 'transparent' : '#000',
    elevation: isDark ? 0 : 4,
  };

  const headerTintColor = isDark ? colors.white : colors.gray900;

  return (
    <Stack.Navigator
      initialRouteName="WorkOrderList"
      screenOptions={{
        headerBackImage: BackIcon,
        headerStyle,
        headerTintColor,
      }}
    >
      <Stack.Screen
        name="WorkOrderList"
        component={WorkOrderListScreen}
        options={{
          title: t('workOrderList.title'),
          headerRight: () => <ThemeToggleButton />,
        }}
      />
      <Stack.Screen
        name="WorkOrderDetail"
        component={WorkOrderDetailScreen}
        options={{ title: t('workOrderDetail.title') }}
      />
      <Stack.Screen
        name="WorkOrderForm"
        component={WorkOrderFormScreen}
        options={({ route }) => ({
          title: route.params?.id
            ? t('workOrderForm.titleEdit')
            : t('workOrderForm.titleNew'),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backIcon: { marginLeft: 8 },
  themeButton: { marginRight: 16 },
});