import React, { Component } from 'react'
import { View, Text } from 'react-native'
import auth from '@react-native-firebase/auth';

import style from '../styles/index'
import { inject } from 'mobx-react'

@inject('User')
@inject('Conversation')
@inject('Contact')
@inject('Chat')
class Spalsh extends Component {
  constructor(props) {
    super(props)
    this.state = { isLoading: true }
  }

  componentDidMount() {
    auth().onAuthStateChanged(userData => {
      console.log('onAuthStateChanged userData: ', userData);
      if(userData && userData.displayName) {
        this.props.User.key = userData
        this.props.Conversation.key = userData
        this.props.Contact.key = userData
        this.props.Chat.userKey = userData
        this.props.navigation.replace('Conversation')
      } else if(userData) {
        this.props.User.key = userData
        this.props.navigation.replace('Profile')

      }

       else this.props.navigation.replace('Register')
    });
  }

  render() {
    return (
      <View
        style={[
          style.container,
          { justifyContent: 'center', alignItems: 'center' }
        ]}
      >
        <Text>Loading</Text>
      </View>
    )
  }
}

export default Spalsh
