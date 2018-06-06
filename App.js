import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import config from 'config';

export default class App extends React.Component {
  componentDidMount() {
    return firebase.auth()
      .signInAndRetrieveDataWithEmailAndPassword(config.EMAIL, config.PASSWORD)
      .then(response => {
        const authUser = response.user;
        const ref = firebase.database().ref('/routes1/11');
        ref.keepSynced(true);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
