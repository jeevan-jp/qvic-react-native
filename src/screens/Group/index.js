import React, { useState, useEffect } from 'react';

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
  TouchableOpacity
} from 'react-native';

import database from '@react-native-firebase/database';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height: FULL_HEIGHT, width: FULL_WIDTH } = Dimensions.get('window');

function Group(props) {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroupsAndUsers = async () => {
    try {
      database().ref(`/groups`).on('value', snap => {
        const data = snap.val();
        const allGroups = Object.keys(data).map(groupId => data[groupId]);
        setGroups(allGroups);
      });

      // fetch users
      const snapUser = await database().ref(`/users`).once('value');
      const userData = snapUser.val();
      setUsers(userData);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(`${err.message}`);
    }
  }

  useEffect(() => {
    fetchGroupsAndUsers();
  }, [])

  const createNewGroup = () => {
    props.navigation.navigate('CreateGroup');
  }

  const makeGroupCall = async (id, val) => {
    try {
      await database().ref(`/groups/${id}`).update({ callActive: val });
      console.log('call placed successfully');
    } catch (err) {
      alert(`${err.message}`);
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
            {
              !loading ? (
                <React.Fragment>
                  {
                    groups.map(({ id, name, description, users: gpUsers, callActive }, i) => (
                      <View style={styles.gpCardContainer} key={"gp" + i}>
                        <View>
                          <TouchableOpacity
                            onPress={e => {
                              const ids = Object.values(gpUsers);
                              const names = ids.map(id => users[id].name);
                              console.log('users', names);
                              alert(`GROUP MEMBERS: \n\n ${names.map(n => n)}`);
                            }}
                          >
                            <Text style={styles.gpName}>{name}</Text>
                          </TouchableOpacity>
                          <Text style={styles.gpDesc}>{description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => makeGroupCall(id, callActive ? 0 : 1)}>
                          <Text style={styles.callLabel}>{callActive ? 'cancel' : 'call'}</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  }
                  <View style={styles.button}>
                    <Button
                      onPress={createNewGroup}
                      title="+ New Group"
                      color="#841584"
                      accessibilityLabel="Create new group"
                    />
                  </View>
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
