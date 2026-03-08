import './global.css';

import { RealmProvider } from '@realm/react'; 
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SyncMeta } from './src/database/schemas/SyncMetaSchema';
import { WorkOrder } from './src/database/schemas/WorkOrderSchema';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <RealmProvider
    schema={[WorkOrder, SyncMeta]}
    schemaVersion={1}
  >
    <SafeAreaProvider>
        <NavigationContainer>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <RootNavigator />
        </NavigationContainer>
    </SafeAreaProvider>
  </RealmProvider>
  );
}

export default App;