import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamScreen from '../screens/TeamScreen';

const Stack = createStackNavigator();

export const TeamStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Team'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Team' component={TeamScreen} />
    </Stack.Navigator>
  );
};
