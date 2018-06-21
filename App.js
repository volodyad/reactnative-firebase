import React from 'react';
import { StyleSheet, Text, View, Button, Switch, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
const config = require('./config');

const PATH_LIST = [
  'account.json',
  'address.json',
  'checkList.json',
  'collect_on_delivery.json',
  'country.json',
  'daily_matrix_depot0030.json',
  'depot.json',
  'networks.json',
  'parcelRange.json',
  'pickup_locations.json',
  'road_speeds.json',
  'service.json',
  'vehicleTypes.json']
export default class App extends React.Component {
  constructor() {
    super();
    this.state = { status: 'Loading', selection: {}  };
    this.refsCache = [];
  }
  componentDidMount() {
    debugger;
    let firstLoad = true;
    firebase.auth().onAuthStateChanged((user) => {
      if(!firstLoad) return;
      firstLoad = false;
      if(!user) {
       // this.login(config.EMAIL, config.PASSWORD)
      }
      else {

      }
      
    }); 
  }

  subscribe = (path) => {
    const ref = firebase.database().ref(path);
    ref.keepSynced(true);
    this.refsCache.push(ref);
  }


  login(userName, password) {
    firebase.auth()
    .signInAndRetrieveDataWithEmailAndPassword(userName, password)
    .then(() => {
      this.subscribeSelected();
    })
    .catch(() => {
      debugger;
    });
  }

  subscribeSelected = () => {
    const selectedPathList = PATH_LIST.filter(path => this.state[path]);
    debugger;
    for (var path in selectedPathList) {
      this.subscribe(path);
    }
  }
  
  loadAll() {config.EMAIL, config.PASSWORD
    this.login(config.EMAIL, config.PASSWORD)
  }

  renderSwitch(path) {
    debugger;
    const s = config;
    return (
      <View key={path}>
        <Switch 
      
          onValueChange = {(value) => {
            this.setState({[path]: value})
          } }
          value = {this.state[path]}
          testID= {path}
          accessibilityLabel= {path}
        />
        <Text>{path}</Text>
      </View>
    )
  }

  renderSwitches() {
    return <View style={styles.switchListContainer}>
      {PATH_LIST.map((path) => this.renderSwitch(path) )}
    </View>
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        { this.renderSwitches()}
        <Text>{this.state.status}</Text>
        <Button
          onPress={() => this.loadAll()}
          title="Load"
          testID= {"load"}
          accessibilityLabel="load"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  switchListContainer: {
      flex: 1,
      alignItems: 'center',
      marginBottom: 100
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row'
}
});

