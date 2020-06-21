import React from 'react'
import { View, StatusBar } from 'react-native'

import { Provider } from 'mobx-react'
import AppNavigator from './src/navigation/AppNavigator'
// import AppNavigator from './src/layout/index'
import colors from './src/styles/colors'
import stores from './src/store'
import './src/utils/enableFontPatch'

export default class Root extends React.Component {
  render() {
    return (
      <Provider {...stores}>
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={colors.primary}
          />
          <AppNavigator />
        </View>
      </Provider>
    )
  }
}
