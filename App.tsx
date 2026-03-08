import './global.css';

import { RealmProvider } from '@realm/react'; 
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SyncMeta } from './src/database/schemas/SyncMetaSchema';
import { WorkOrder } from './src/database/schemas/WorkOrderSchema';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <RealmProvider
    schema={[WorkOrder, SyncMeta]}
    schemaVersion={1}
  >
    <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    </SafeAreaProvider>
  </RealmProvider>
  );
}

export default App;