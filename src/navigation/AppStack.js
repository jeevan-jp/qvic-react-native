import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/PhoneAuth';
import CallKeep from '../screens/CallKeep';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function AppStack(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CallKeep">
        <Stack.Screen name="Home" component={Home} {...props} />
        <Stack.Screen name="CallKeep" component={CallKeep} {...props} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;