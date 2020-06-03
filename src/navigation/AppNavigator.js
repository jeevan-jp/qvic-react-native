
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

function AppNavigator(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth().onAuthStateChanged(userData => {
      console.log('onAuthStateChanged userData: ', userData);
      setUser(userData);
    })
  }, []);

  return user
    ? <AppStack user={user} />
    : <AuthStack user={user} />
}

export default AppNavigator;