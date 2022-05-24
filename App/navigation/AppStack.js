import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from '../screens';
import { TeamsScreen } from '../screens';

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName='Teams'>
      <Stack.Screen name='Teams' component={TeamsScreen} />
      <Stack.Screen name='Home' component={HomeScreen} />
    </Stack.Navigator>
  );
};
