import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { View, Text } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';

function App(props) {
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const user = await auth().currentUser;
      console.log('user', user);
      setLoading(false);
    } catch(err) {
      console.log('err in App.js', err);
      setLoading(false);
    }
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

  return <AppNavigator {...props} />
}

export default App;
