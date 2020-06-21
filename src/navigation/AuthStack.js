// In App.js in a new project

import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// import PhoneAuthScreen from '../screens/PhoneAuth';
import { NavigationContainer } from '@react-navigation/native';
import Verify from '../screens/verify';
import Register from '../screens/register';

const Stack = createStackNavigator();

function AuthStack(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        {/* <Stack.Screen name="PhoneAuthScreen" component={PhoneAuthScreen} options={{header: () => null}} /> */}
        <Stack.Screen name="Register" component={Register} options={{header: () => null}} {...props} />
        <Stack.Screen name="Verify" component={Verify} options={{header: () => null}} {...props} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStack;