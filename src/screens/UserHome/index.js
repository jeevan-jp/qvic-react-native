import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Button,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';

import RNCallKeep from 'react-native-callkeep';
import database from '@react-native-firebase/database';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height: FULL_HEIGHT, width: FULL_WIDTH } = Dimensions.get('window');

function Group(props) {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callingGroup, setCallingGroup] = useState(null);

  const [isPermissionsGranted, setPermissionsGranted] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const options = {
    ios: {
      appName: 'QVIC',
    },
    android: {
      alertTitle: 'Permissions required',
      alertDescription: 'QVIC needs to access your phone accounts',
      cancelButton: 'Cancel',
      okButton: 'Ok',
    }
  };

  const checkPermissions = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    console.log('granted', granted);
    return granted;
  }

  const takePermissions = () => {
    checkPermissions()
      .then(allowed => {
        if(!allowed) {
          RNCallKeep.setup(options)
          .then(res => {
            console.log('setup complete', res);
            setPermissionsGranted(true);
          })
          .catch(err => {
            console.log('err', err);
            setPermissionsGranted(false);
          });
        } else {
          console.log('permissions already granted');
          setPermissionsGranted(true);
        }
      })
      .catch(err => {
        setPermissionsGranted(false);
      })
  }

  useEffect(() => {
    takePermissions();
  }, []);

  useEffect(() => {
    if(isPermissionsGranted) {
      fetchGroupAndUserData();
    } else if(isPermissionsGranted === false) {
      Alert.alert(
        'Insufficient Permissions',
        "Please allow necessary permission.",
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'Allow', onPress: takePermissions }
        ],
        { cancelable: false }
      );
    }
  }, [isPermissionsGranted])

  const fetchGroupAndUserData = async () => {
    try {
      database().ref(`/groups`).on('value', snap => {
        const data = snap.val();
        const allGroups = Object.keys(data).map(groupId => {
          const obj = data[groupId];

          if(obj.callActive && !callingGroup) {
            setCallingGroup({ groupId, groupName: obj.name, adminID: obj.adminID });
          }

          console.log('obj.callActive && callingGroup && callingGroup.groupId === groupId',
          obj.callActive, callingGroup, callingGroup && callingGroup.groupId === groupId);

          if(!obj.callActive && callingGroup && callingGroup.groupId === groupId) {
            setCallingGroup(null);
          }

          return obj;
        });
        setGroups(allGroups);
      });

      // // fetch users
      const snapUser = await database().ref(`/users`).once('value');
      const userData = snapUser.val();

      // fetchCurrentUserDetails
      const user = await auth().currentUser;
      setCurrentUser(user);

      setUsers(userData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(`${err.message}`);
    }
  }

  const onNativeCall = () => {
    console.log('onNativeCall');
  }

  const onAnswerCallAction = () => {
    console.log('onAnswerCallAction');
    props.navigation.navigate('JitsiVideoCall');
  }

  const onEndCallAction = () => {
    console.log('onEndCallAction');
    setCallingGroup(null);
  }

  const onIncomingCallDisplayed = () => {
    console.log('onIncomingCallDisplayed');
  }

  const onToggleMute = () => {
    console.log('onToggleMute');
  }

  const onDTMF = () => {
    console.log('onDTMF');
  }

  const makeCall = async () => {

    const uuid = callingGroup ? callingGroup.groupId : null;
    console.log('uuid', uuid);
    // RNCallKeep.setAvailable(false);
    // RNCallKeep.endAllCalls();

    try {
      console.log('calling');
      const handle = callingGroup.groupName;

      // get admin details for contactIdentifier
      const snap = await database().ref(`/users/${callingGroup.adminID}`).once('value');
      const data = snap.val();

      console.log('callingGroup.adminID', data.phone);

      RNCallKeep.displayIncomingCall(uuid, handle, 'QWIC - ' + handle, 'generic', false);
    } catch (err) {
      console.error('CallKeep error:', err.message);
    }

    RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCall);
    RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
    RNCallKeep.addEventListener('endCall', onEndCallAction);
    RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
    RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
    RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);
  }

  useEffect(() => {
    RNCallKeep.endAllCalls();


    if(setPermissionsGranted && callingGroup && callingGroup.groupId) {
      console.log('MAKING CALL');
      makeCall();
    }

    return () => {
      RNCallKeep.removeEventListener('didReceiveStartCallAction', onNativeCall);
      RNCallKeep.removeEventListener('answerCall', onAnswerCallAction);
      RNCallKeep.removeEventListener('endCall', onEndCallAction);
      RNCallKeep.removeEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
      RNCallKeep.removeEventListener('didPerformSetMutedCallAction', onToggleMute);
      RNCallKeep.removeEventListener('didPerformDTMFAction', onDTMF);
    }
  }, [callingGroup]);

  const endCall = () => {
    console.log('ending all calls');
    RNCallKeep.endAllCalls();
    setCallingGroup(null);
  }

  console.log('callingGroup', callingGroup);

  const pickCallFromApp = () => {
    RNCallKeep.endAllCalls();
    // also pass params to the app
    props.navigation.navigate('JitsiVideoCall', { url: "https://meet.jit.si/testing-jp1" });
  }

  return (
    <React.Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {
              !loading ? (
                <React.Fragment>
                  {
                    groups.map(({ id, name, description, users: gpUsers, callActive, adminID }, i) => (
                      <View style={styles.gpCardContainer} key={"gp" + i}>
                        <View>
                          <TouchableOpacity
                            onPress={e => {
                              const ids = Object.values(gpUsers);
                              const names = ids.map(id => users[id].name);
                              console.log('users', names);
                              alert(`ADMIN:\n${users[adminID].name} \n\nGROUP MEMBERS:\n${names.map(n => n)}`);
                            }}
                          >
                            <Text style={styles.gpName}>{name}</Text>
                          </TouchableOpacity>
                          <Text style={styles.gpDesc}>{description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {}}>
                          <Text style={styles.callLabel}>{callActive && callingGroup ? 'Incoming Call...' : ''}</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  }
                  {
                    callingGroup && callingGroup.groupId && (
                      <View style={styles.button}>
                        <Button
                          onPress={pickCallFromApp}
                          title="Pick Call from here"
                          color="#841584"
                          accessibilityLabel="Pick Call from here"
                        />
                      </View>
                    )
                  }
                  {
                    callingGroup && callingGroup.groupId && (
                      <View style={styles.button}>
                        <Button
                          onPress={endCall}
                          title="End Call"
                          color="#841584"
                          accessibilityLabel="End Call"
                        />
                      </View>
                    )
                  }
                </React.Fragment>
              ) : (
                <View style={{ marginTop: 30 }}>
                  <Text>One moment...</Text>
                </View>
              )
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </React.Fragment>
  )
}

export default Group;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  gpCardContainer: {
    borderWidth: 0,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.4,
    width: FULL_WIDTH,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  gpName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  gpDesc: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777'
  },
  callLabel: {
    fontSize: 14,
    color: '#841584'
  },
  body: {
    backgroundColor: Colors.white,
    alignItems: 'center',
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
  }
});
