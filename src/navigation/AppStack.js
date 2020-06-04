import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/PhoneAuth';
import CallKeep from '../screens/CallKeep';
import { NavigationContainer } from '@react-navigation/native';
import Group from '../screens/Group';
import CreateGroup from '../screens/Group/CreateGroup';

const Stack = createStackNavigator();

function AppStack(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Group">
        <Stack.Screen name="Home" component={Home} {...props} />
        <Stack.Screen name="CallKeep" component={CallKeep} {...props} />
        <Stack.Screen name="Group" component={Group} {...props} />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{ title: 'Create New Group' }}
          {...props}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;