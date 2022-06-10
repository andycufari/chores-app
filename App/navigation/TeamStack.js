import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamScreen from '../screens/TeamScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-elements';
import TestScreen from '../screens/TestScreen';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        tab name="Feed" 
        component={TeamScreen} 
        options={{
          tabBarLabel: "Tareas",
          tabBarIcon: () => {
            return <Icon type="material-community" name="logout" size={26}/>
          }
        }}
        />
      <Tab.Screen 
      name="Messages"
       component={TestScreen}
       options={{
        tabBarLabel: "Estadisticas",
        tabBarIcon: () => {
          return <Icon type="material-community" name="logout" size={26}/>
        }
      }} />
    </Tab.Navigator>
  );
}
export const TeamStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Team'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Team' component={Home} />
    </Stack.Navigator>
  );
};
