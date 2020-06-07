// In App.js in a new project

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PhoneAuthScreen from '../screens/PhoneAuth';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function AuthStack(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PhoneAuthScreen">
        <Stack.Screen name="PhoneAuthScreen" component={PhoneAuthScreen} options={{header: () => null}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStack;