import { createAppContainer, createSwitchNavigator } from 'react-navigation';

// import AuthLoading from '../screens/AuthLoading';
import AppStack from './AppStack';
// import AuthStack from './AuthStack';

const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      // AuthLoading: AuthLoading,
      App: AppStack,
      // Auth: AuthStack,
    },
    {
      initialRouteName: 'App',
    },
  )
);

export default AppNavigator;