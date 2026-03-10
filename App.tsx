import './global.css';

import { RealmProvider } from '@realm/react'; 
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SyncMeta } from './src/realm/schemas/SyncMetaSchema';
import { WorkOrder } from './src/realm/schemas/WorkOrderSchema';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/routes/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.root}>
      <RealmProvider schema={[WorkOrder, SyncMeta]} schemaVersion={1}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </RealmProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default App;