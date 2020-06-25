import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, CheckBox } from 'react-native'

import Contact from '../components/contact'
import style from '../styles/index'
import { inject, observer } from 'mobx-react'

@inject('Contact')
@inject('Group')
@observer
export default class CreateGroup extends Component {

    constructor(props) {
        super(props)
        this.props.Contact.fetchContacts()
      }
      onCheck = (item, i) => {
        console.log(item,i); 
      }
      
    
      loadView() {
        return (
          <View style={style.load}>
            <ActivityIndicator size={'large'} />
          </View>
        )
      }
      groupView() {
        return (
          <View>
            <FlatList
              data={this.props.Contact.contacts}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <ListItem>
                <Left>
                <Contact
                  name={item.name}
                  avatarUrl={{ uri: item.avatarSource }}

                />
                </Left>
                 <Right>
                    <CheckBox 
                    checked={item.checked}
                    onPress={() => this.onCheck(item,index)}
                    />
                 </Right>
                 </ListItem>
              )}
            />
          </View>
        )
      }
      render() {
        return (
          <View style={style.container}>
            {this.props.Contact.isLoading ? this.loadView() : this.groupView()}
          </View>
        )
      }
}