import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from './App/navigation/RootNavigator';
import { AuthenticatedUserProvider } from './App/providers';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};


const App = () => {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <RootNavigator />
        </PaperProvider>
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
