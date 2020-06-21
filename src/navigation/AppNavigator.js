
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

function AppNavigator(props) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('insdie app navigator');
    auth().onAuthStateChanged(userData => {
      console.log('onAuthStateChanged userData: ', userData);
      setUser(userData);
    });
  }, []);

  return user
    ? <AppStack user={user} {...props} />
    : <AuthStack user={user} {...props} />
}

export default AppNavigator;