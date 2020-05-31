import React, { useEffect, useState } from 'react';
import PhoneAuthScreen from './src/screens/PhoneAuth';
import auth from '@react-native-firebase/auth';
import CallKeep from './src/screens/CallKeep';
import { View, Text } from 'react-native';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const checkAuth = async () => {
    const user = await auth().currentUser;
    console.log('user', user);
    setLoading(false);
    setUser(user);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if(loading) {
    return (
      <View>
        <Text>One moment please..</Text>
      </View>
    )
  }

  if(user) return <CallKeep user={user} />
  else  return <PhoneAuthScreen />
}

export default App;
