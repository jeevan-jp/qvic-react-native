import React, { Component } from 'react'
import { View, FlatList, ActivityIndicator, CheckBox,TouchableOpacity,StyleSheet } from 'react-native'

import style from '../../styles/index'
import { inject, observer } from 'mobx-react'
import Contact from '../../components/contact'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

import ImagePicker from 'react-native-image-picker'

import ProgressiveImage from '../../components/progressiveImage'
import colors from '../../styles/colors'

@inject('Contact')
@inject('Group')
@observer
export default class CreateGroup extends Component {

    constructor(props) {
        super(props)
        this.props.Contact.fetchContacts()
        this.state={selectedUserIds:[],
                     isFromFile: false
    }
      }
      onCheck = (item) => {
        console.log("--------------------------",item); 
        const {selectedUserIds}  = this.state;
        console.log(selectedUserIds.includes(item))
        if(!selectedUserIds.includes(item)) {
          let value = [...selectedUserIds,item];
          console.log(value);
          alert("if"+JSON.stringify(value)); 
          this.setState({selectedUserIds:[...selectedUserIds,item]})
        
        }
         else {

          this.setState({selectedUserIds:selectedUserIds.filter((i)=> i != item )},()=>{
            alert("else"+JSON.stringify(this.state.selectedUserIds)) 
          })
            
            }
      }
      
    
      loadView() {
        return (
          <View style={style.load}>
            <ActivityIndicator size={'large'} />
          </View>
        )
      }
      selectAvatar = () => {
        ImagePicker.showImagePicker(null, response => {
          if (response.didCancel) {
            // console.log('User cancelled image picker')
          } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error)
          } else if (response.customButton) {
            // console.log('User tapped custom button: ', response.customButton)
          } else {
            this.props.Group.avatarSource = response.path
            this.props.Group.fileName = response.fileName
            this.setState({ isFromFile: true + 9190 })
          }
        })
      }
    
      
  onSaveOrUpdate = () => {
    if (this.props.Group.key === '') {
      this.props.Group.save(this.state.selectedUserIds).then((key) => {
        alert(key);
          // this.props.navigation.replace('Splash')
        
      })
    } else {
      this.props.User.update(this.state.selectedUserIds).then(() => {
          // this.props.navigation.replace('Splash')
        
      })
    }
  }
      groupView() {
        return (
          <View>
            <TouchableOpacity
          style={[_style.avatar, { backgroundColor: '#fff', elevation: 15 }]}
          onPress={this.selectAvatar}
        >
          <ProgressiveImage
            style={[_style.avatar]}
            source={
              this.props.Group.avatarSource !== ''
                ? {
                    uri:
                      (this.state.isFromFile ? 'file:///' : '') +
                      this.props.Group.avatarSource
                  }
                : require('../../img/profile.png')
            }
            thumbnail={require('../../img/profile.png')}
          />
        </TouchableOpacity>
            <TextInput
          style={_style.textInput}
          underlineColorAndroid={'transparent'}
          placeholder={'Group Name'}
          onChangeText={text => (this.props.Group.name = text)}
          value={this.props.Group.name}
             />
            <FlatList
              data={this.props.Contact.contacts}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <View style={{flexDirection:"row",
                 width:'100%',
                 marginLeft: 30,
                 alignItems: "center"}} >
                 <View>
                    <CheckBox 
                    value={this.state.selectedUserIds.includes(item.key)}
                    onChange={() => {console.log("hi"); this.onCheck(item.key)}}
                    />
                 </View>
                <View style={{width:'80%'}}>
                <Contact
                  name={item.name}
                  avatarUrl={{ uri: item.avatarSource }}
                  onPress = {()=> {}}
                />
                </View>

                 </View>
              )}
            />
                    <TouchableOpacity
          style={style.addButton}
          onPress={
            () => {
               this.props.Group.users = this.state.selectedUserIds;
               this.onSaveOrUpdate()
              //  this.props.navigation.navigate('CreateGroup')
          }
          }
        >
          <Icon size={24} name={'check'} color={colors.white} />
        </TouchableOpacity>
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
const _style = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center'
  },
  textInput: {
    backgroundColor: colors.white,
    margin: 32,
    padding: 8,
    borderColor: colors.border,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 18,
    elevation: 6
  }
})