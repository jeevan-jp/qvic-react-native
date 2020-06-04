import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import database from '@react-native-firebase/database';

import { View, Text } from 'react-native';

import Home from '../screens/PhoneAuth';
import CallKeep from '../screens/CallKeep';
import { NavigationContainer } from '@react-navigation/native';
import Group from '../screens/Group';
import UserHome from '../screens/UserHome';
import CreateGroup from '../screens/Group/CreateGroup';


const Stack = createStackNavigator();

function AppStack(props) {
  const { user } = props;
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    if(user && user.uid) {
      database().ref(`/users/${user.uid}/isAdmin`).once('value', snap => {
        const isAdmin = snap.val();
        console.log('isAdmin', isAdmin);
        setInitialRouteName(isAdmin ? 'Group' : 'UserHome');
      });
    }
  }, [user]);

  return initialRouteName ? (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Home" component={Home} {...props} />
        <Stack.Screen name="CallKeep" component={CallKeep} {...props} />
        <Stack.Screen name="Group" component={Group} {...props} />
        <Stack.Screen
          name="UserHome"
          component={UserHome}
          options={{ title: 'Welcome' }}
          {...props}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{ title: 'Create New Group' }}
          {...props}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <View></View>
  );
}

export default AppStack;