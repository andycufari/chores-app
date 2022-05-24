import React, {useEffect} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from './App/navigation/RootNavigator';
import { AuthenticatedUserProvider, TeamProvider } from './App/providers';
import TeamService from './App/services/TeamService';

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
  let currentTeam;
  useEffect( () => {
    currentTeam =  TeamService.getLocalTeam();
  })

  return (
    <AuthenticatedUserProvider>
      <TeamProvider currentTeam={currentTeam}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <RootNavigator />
          </PaperProvider>
        </SafeAreaProvider>
      </TeamProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
