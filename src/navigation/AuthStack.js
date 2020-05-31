import { createStackNavigator } from 'react-navigation';
import getSlideFromRightTransition from 'react-navigation-slide-from-right-transition';

import Home from '../screens/PhoneAuth';
import CallKeep from '../screens/CallKeep';

const AuthStack = createStackNavigator(
  {
    Home: {screen: Home, navigationOptions: { header: null }},
    CallKeep: {
      screen: CallKeep,
      navigationOptions: {title: 'Set Up'}
    },
  },
  {
    initialRouteName: 'Home',
    mode: 'card',
    headerMode: 'float',
    transitionConfig: getSlideFromRightTransition,
    defaultNavigationOptions: {
      headerForceInset: { vertical: 'never' },
      headerTintColor: theme.colors.surface,
      headerStyle: {
        backgroundColor: theme.colors.primary,
        fontWeight: 'bold',
        height: 80,
        paddingTop: 30,
        color: '#fff'
      },
      gesturesEnabled: true,
    },
  },
);

export default AuthStack;