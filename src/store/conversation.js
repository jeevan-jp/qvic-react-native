import database from '@react-native-firebase/database'
import { action, observable } from 'mobx'
import auth from '@react-native-firebase/auth';

export const FETCH_CONVERSATION = 'FETCH_CONVERSATION'

export default class Conversation {
  constructor() {
    this.database = database()
  }

  @observable
  key = ''
  @observable
  conversations = null
  @observable
  isLoading = false

  @action
  fetchConversations() {
    this.isLoading = true
    database()
      .ref(`Users/${auth().currentUser.uid}`)
      .child('groups')
      .on('value', snapshot => {
        let conversations = []
        let promises = []
            console.log("hiiiii",snapshot.val());
            for(key in snapshot.val()){
              console.log("bro",snapshot.val()[key]);
              database()
              .ref(`Groups/${snapshot.val()[key]}`).on('value',snapshot =>{
                console.log("finak",snapshot);
             
                conversations.push(snapshot);   
                console.log("finakrgrt",conversations);
                this.conversations = conversations
                this.isLoading = false
           
              });
            }
       
      })
  }

  loadUserData(item, userkey) {
    return new Promise(async resolve => {
      const lastMsg = await this.database
        .ref('Messages')
        .child(item.key)
        .child(item.child('lastMsg').val())
        .once('value')

      item.forEach(async subItem => {
        if (subItem.val() === true && subItem.key !== userkey) {
          const user = await this.database
            .ref('Users')
            .child(subItem.key)
            .once('value')
          const data = {
            key: item.key,
            lastTime: item.val().lastTime,
            lastMessage: lastMsg.val() ? lastMsg.val().text : '',
            ...user.val()
          }
          console.log(`==============>${JSON.stringify(data, null, 2)}`);
          resolve(data)
        }
      })
    })
  }
}
