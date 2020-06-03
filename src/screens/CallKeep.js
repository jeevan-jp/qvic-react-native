/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
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
  Dimensions
} from 'react-native';
import database from '@react-native-firebase/database';

const { height: FULL_HEIGHT, width: FULL_WIDTH } = Dimensions.get('window');

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RNCallKeep from 'react-native-callkeep';
import UUIDGenerator from 'react-native-uuid-generator';

const CallKeep = (props) => {
  const checkPermissions = async () => {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
    console.log('granted', granted);
    return granted;
  }
  console.log('inside app navigatorrr-------');

  useEffect(() => {
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

    const onNativeCall = () => {
      console.log('onNativeCall');
    }

    const onAnswerCallAction = () => {
      console.log('onAnswerCallAction');
    }

    const onEndCallAction = () => {
      console.log('onEndCallAction');
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

    const makeCall = () => {

      UUIDGenerator.getRandomUUID((uuid) => {
        console.log(uuid);
        // RNCallKeep.setAvailable(false);
        // RNCallKeep.endAllCalls();

        setTimeout(() => {
          try {
            console.log('calling');
            const handle = uuid;
            const contactIdentifier = "9968967600";
            RNCallKeep.displayIncomingCall(uuid, handle, contactIdentifier, 'number', false);
          } catch (err) {
            console.error('CallKeep error:', err.message);
          }
        }, 500);

        RNCallKeep.addEventListener('didReceiveStartCallAction', onNativeCall);
        RNCallKeep.addEventListener('answerCall', onAnswerCallAction);
        RNCallKeep.addEventListener('endCall', onEndCallAction);
        RNCallKeep.addEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', onToggleMute);
        RNCallKeep.addEventListener('didPerformDTMFAction', onDTMF);

        return () => {
          RNCallKeep.removeEventListener('didReceiveStartCallAction', onNativeCall);
          RNCallKeep.removeEventListener('answerCall', onAnswerCallAction);
          RNCallKeep.removeEventListener('endCall', onEndCallAction);
          RNCallKeep.removeEventListener('didDisplayIncomingCall', onIncomingCallDisplayed);
          RNCallKeep.removeEventListener('didPerformSetMutedCallAction', onToggleMute);
          RNCallKeep.removeEventListener('didPerformDTMFAction', onDTMF);
        }
      });
    }

    const call = () => {
      console.log('foo bar....');
      checkPermissions()
      .then(allowed => {
        if(!allowed) {
          RNCallKeep.setup(options)
          .then(res => {
            console.log('accepted', res);
            makeCall();
          })
          .catch(err => console.log('err', res));
          makeCall();
        } else {
          try {
            console.log('asking for permission');
            RNCallKeep.setup(options)
              .then(res => {
                console.log('accepted', res);
                makeCall();
              })
              .catch(err => console.log('err', res));
          } catch (err) {
            console.error('initializeCallKeep error: ', err.message);
          }
        }
      });
    }

    const dbOperation = async (user) => {
      try {
        const {uid, phoneNumber: phone} = user;
        const snap = await database().ref(`/users/${uid}`).once('value');
        const data = snap.val();

        const addStatusListener = (flag) => {
          console.log('adding fb listener---------', flag);
          database().ref(`/users/${uid}/status`).on('value', snap => {
            const status = snap.val();
            console.log('status', status);
            if(status == 1) {
              console.log('status looks good=============initiate calling protocol');
              call();
            }
          });
        }

        if(uid && !data.phone) {
          await database().ref(`/users/${uid}`).set({
            name: 'test-user',
            userId: uid,
            phone,
            status: 0,
          });
          addStatusListener(1);
        } else {
          addStatusListener(2);
        }
      } catch(err) {
        console.log('err', err);
      }
    }

    if(props.user) dbOperation(props.user);
  }, []);

  const onButtonPress = () => {
    const uid = props.user.uid;
    database().ref(`/users/${uid}/status`).set(1);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          {/* <Header /> */}
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.button}>
              <Button
                onPress={onButtonPress}
                title="Call Everyone"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
            {/* <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks /> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    alignItems: 'center',
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
    marginTop: FULL_HEIGHT * 0.5,
    width: FULL_WIDTH * 0.8,
  }
});

export default CallKeep;
