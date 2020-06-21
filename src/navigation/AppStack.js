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
import JitsiVideoCall from '../screens/JitsiVideoCall';
import Spalsh from '../screens/splash';
import Conversation from '../components/conversation';
import Contact from '../components/contact';
import Contacts from '../screens/contacts';
import Chat from '../screens/chat';
import {Header} from '../components/header';
import {ChatHeader} from '../components/chatHeader';
import Profile from '../screens/profile';
const Stack = createStackNavigator();

function AppStack(props) {
  const { user } = props;
  const [initialRouteName, setInitialRouteName] = useState(null);

  useEffect(() => {
    if(user && user.uid) {
      setInitialRouteName(user.displayName ? 'Profile':'Conversation');
    }
  }, [user]);

  return initialRouteName ? (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Home" component={Home} {...props} />
        <Stack.Screen name="CallKeep" component={CallKeep} {...props} />
        <Stack.Screen
          name="Group"
          component={Group}
          options={{
            title: 'Your Groups',
            headerStyle: { backgroundColor: '#466bff' },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff',
            }
          }}
          {...props}
        />
        <Stack.Screen
          name="UserHome"
          component={UserHome}
          options={{
            title: 'Your Groups',
            headerStyle: { backgroundColor: '#466bff' },
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff',
            }
          }}
          {...props}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{ title: 'Create New Group' }}
          {...props}
        />
        <Stack.Screen
          name="JitsiVideoCall"
          component={JitsiVideoCall}
          options={{ header: () => null }}
          user={user}
          {...props}
        />
         <Stack.Screen
         name="Splash"
         component={Spalsh}
         options={{ header: () => null }}
         {...props}
         />
                 <Stack.Screen
         name="Profile"
         component={Profile}
         options={{ header: () => <Header nav={navigation} title={'Profile'} absolute back /> }}
         {...props}
         />
                   <Stack.Screen
         name="Conversation"
         component={Conversation}
         options={{ header: (navigation) => <Header nav={navigation} title={'Profile'} absolute rightIcon={'person'} /> }}
         {...props}
         />
     <Stack.Screen
         name="Contact"
         component={Contacts}
         options={{ header: (navigation) => <Header nav={navigation} title={'Contacts'} absolute rightIcon={'person'} /> }}
         {...props}
         />
       <Stack.Screen
         name="Chat"
         component={Chat}
         options={{ header: (navigation) => <ChatHeader
          nav={navigation}
          uri={navigation.state.params.imageURL}
          title={navigation.state.params.title}
        /> }}
         {...props}
         /> 
 

      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <View></View>
  );
}

export default AppStack;