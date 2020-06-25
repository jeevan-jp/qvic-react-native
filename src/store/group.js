import { observable, action } from 'mobx'
import auth from '@react-native-firebase/auth';
import { getFileName } from '../utils/utils'
import database from '@react-native-firebase/database';

      class Group { 
        @observable
        key = ''
        @observable
        name = ''
        @observable
        avatarSource = ''
        @observable
        avatarRef = ''
        @observable
        fileName = ''
        @observable
        adminID = ''
        @observable
        callUrl = ''
        @observable
        users = ''
      
        @action
        async save(selectedUserIds) {
          const imgData = await this.imageUpload()
          let newselectedUserIds = selectedUserIds.push(auth().currentUser.uid); 
          const key = await database().ref('Groups').push().key
          const group = {
            name: this.name,
            avatarSource: imgData.avatarSource,
            avatarRef: imgData.avatarRef,
            adminID: auth().currentUser.uid,
            users:newselectedUserIds,
            createdTs: Date.now(),
            callUrl: `https://meet.jit.si/${key}`,
            isCallActive: 0
          }
           console.log("bye",group);
          for(var i = 0; i<selectedUserIds.length; i++) {
            await database()
            .ref(`Users/${selectedUserIds[i]}/groups`)
            .push(key)  
          }
          alert(key + group);
          await database()
            .ref(`Groups/${key}`)
            .set(group)
          return key
        }
      
        @action
        async update() {
          const imgData = await this.imageUpload()
          console.log(this.isAdmin);
          const user = {
            name: this.name,
            phoneNumber: this.phoneNumber,
            avatarSource: imgData.avatarSource,
            avatarRef: imgData.avatarRef,
            isAdmin: this.isAdmin
          }
          console.log(this.name)
          auth().currentUser.updateProfile({displayName : this.name})
      
          await database()
            .ref('Users')
            .child(this.key)
            .set(user)
        }
      
        async imageUpload() {
          let data = {
            avatarSource: this.avatarSource,
            avatarRef: this.avatarRef
          }
          if (this.fileName !== '') {
            if (this.avatarRef !== '') {
              await firebase
                .storage()
                .ref(this.avatarRef)
                .delete()
            }
            const rImage = await firebase
              .storage()
              .ref('/profilePics/' + getFileName(this.fileName))
              .putFile(this.avatarSource)
            data = {
              avatarSource: rImage.downloadURL,
              avatarRef: rImage.ref
            }
          }
          return data
        }
      }
      export default Group;