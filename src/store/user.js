import { observable, action } from 'mobx'
import auth from '@react-native-firebase/auth';
import { getFileName } from '../utils/utils'
import database from '@react-native-firebase/database';

class User {
  constructor() {
    this.database = database()
  }

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
  isAdmin = false
  @observable
  phoneNumber = ''
  confirmResult = null

  @action
  async auth(phoneNumber) {
    this.phoneNumber = phoneNumber
    this.confirmResult = await auth()
      .signInWithPhoneNumber(phoneNumber)
    if (this.confirmResult.verificationId) {
      return true
    } else {
      this.confirmResult = null
      return false
    }
  }

  @action
  async verify(verificationCode) {
    console.log("confirming");
    if (this.confirmResult !== null) {
      const result = await this.confirmResult.confirm(verificationCode)
      console.log(result)
      if (result.user) return true
      else {
        return false
      }
    }
    return false
  }

  @action
  async getCurrentUser() {
    let key = undefined
    if (this.key) {
      key = this.key
    } else {
      const snapshot = await database()
        .ref('PhoneNumber')
        .once('value', this.phoneNumber)
      if (snapshot.val() !== null) {
        key = snapshot.val()[this.phoneNumber]
        if (key === undefined) return
      }
    }
    const userSnapshot = await database()
      .ref('Users')
      .child(key)
      .once('value')
    const _user = userSnapshot.val()
    if (_user) {
      this.name = _user.name
      this.avatarSource = _user.avatarSource
      this.avatarRef = _user.avatarRef
      this.phoneNumber = _user.phoneNumber
      this.key = key
      this.isAdmin = _user.isAdmin
      // this.groups = _user.groups
       
    }
    console.log(this.isAdmin);

  }

  @action
  async save() {
    const imgData = await this.imageUpload()
     
    const user = {
      name: this.name,
      phoneNumber: this.phoneNumber,
      avatarSource: imgData.avatarSource,
      avatarRef: imgData.avatarRef,
      isAdmin: this.isAdmin
    }
    auth().currentUser.updateProfile({displayName : this.name})

    const key = await database.ref('Users').push(user).key
     console.log(key);
    await this.database
      .ref(`PhoneNumber/${this.phoneNumber}`)
      .set(key)
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

export default User
