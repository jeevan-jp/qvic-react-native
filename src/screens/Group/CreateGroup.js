import React, { useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  PermissionsAndroid,
  Platform,
  Button,
  Dimensions
} from 'react-native';

import database from '@react-native-firebase/database';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height: FULL_HEIGHT, width: FULL_WIDTH } = Dimensions.get('window');

function CreateGroup(props) {
  const [grouName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const createNewGroup = async () => {
    if(grouName === '' || description === '') alert(`${!grouName ? 'group name' : 'description'} empty`);
    else {
      setLoading(true);
      try {
        // get all to users to add to the group
        const snap = await database().ref(`/users`).once('value');
        const allUsers = snap.val();
        const allIds = Object.keys(allUsers);

        var newGroupId = database().ref('/groups').push().key;
        await database().ref(`/groups/${newGroupId}`).set({
          id: newGroupId,
          name: grouName,
          description,
          users: allIds,
          callActive: 0, // 0 - incactive, 1 - active
        });

        setLoading(false);
        alert(`group ${grouName} created.`)
        props.navigation.goBack();
      } catch(err) {
        setLoading(false);
        alert(err.message);
      }
    }
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.button}>
              <Text style={styles.label}>Enter group name</Text>
              <TextInput
                style={styles.textInput}
                placeholder='group name'
                placeholderTextColor='#ddd'
                value={grouName}
                onChangeText={setGroupName}
                maxLength={25}
              />
              <Text style={styles.label}>Group Info</Text>
              <TextInput
                style={{...styles.textInput, marginBottom: 30}}
                placeholder='small description'
                placeholderTextColor='#ddd'
                value={description}
                onChangeText={setDescription}
                maxLength={200}
              />
              <Button
                onPress={() => !loading && createNewGroup()}
                title={loading ? "creating..." : "submit"}
                color={loading ? "#ddd" : "#841584"}
                accessibilityLabel="Create new group"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

export default CreateGroup;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: FULL_HEIGHT
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  button: {
    marginTop: FULL_HEIGHT * 0.05,
    width: FULL_WIDTH * 0.8,
  },
  textInput: {
    marginTop: 8,
    marginBottom: 20,
    width: '100%',
    height: 45,
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    color: '#000',
    fontSize: 16
  },
});

  // // create user in db
  // var uid = 'v2gaw1yZk4SbaRbA6uYD2sd4jd83';
  // await database().ref(`/users/${uid}`).set({
  //   id: uid,
  //   name: 'Jacinda Ardern',
  //   dob: '1980-07-26',
  //   onCall: false,
  // });