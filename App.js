import React from 'react';
import { StyleSheet, Text, View, Button, Switch, ScrollView, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
const config = require('./config');
import { getFirebaseRefByRest } from './apiFirebase';
import _ from 'lodash';
const PERSISTENT_PATH = 'persistent';
  
export default class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      status: 'Loading',
      selection: {},
      logined: false,
      rootPath: PERSISTENT_PATH,
      pathList: []
    };
    this.refsCache = [];
    this.loadSelected = this.loadSelected.bind(this);
    this.loadAll = this.loadAll.bind(this);
    this.loadPathItems = this.loadPathItems.bind(this);
    this.onLogined = this.onLogined.bind(this);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.login(config.EMAIL, config.PASSWORD)
      }
      else {
        this.onLogined();
      }
      
    }); 
  }

  subscribe = (path) => {
    const ref = firebase.database().ref(path);
    ref.keepSynced(true);
    this.refsCache.push(ref);
  }

  subscribeOn = (path) => {
    const ref = firebase.database().ref(path);
    debugger;
    ref.on('value', (snapshot) => {
      debugger;
      const val = snapshot.val();
      console.warn(path + ' loaded');
    });
  }

  loadPathItems() {
    getFirebaseRefByRest(this.state.rootPath, true).then((items) => {
      const paths = Object.keys(items);
      this.setState({ pathList: paths })
    })
  }

  onLogined() {
    debugger;
    this.setState({logined: true});
    this.loadPathItems();
  }

  login(userName, password) {
    firebase.auth()
    .signInAndRetrieveDataWithEmailAndPassword(userName, password)
    .then(onLogined)
    .catch(() => {
      this.setState({ status: 'Login error' })
    });
  }

  subscribeSelected = () => {
    const selectedPathList = this.state.pathList.filter(path => this.state[path]);
    for (var index in selectedPathList) {
      const path = selectedPathList[index];
      const subscribePath = `${this.state.rootPath}/${path}`;
      this.subscribe(subscribePath);
      if(this.state.subscribeOnListener) {
        this.subscribeOn(subscribePath);
      }
    }
  }
  
  loadSelected() {
    this.subscribeSelected();
  }

  loadAll() {
    const { rootPath } = this.state;
    this.subscribe(rootPath);
    if(this.state.subscribeOnListener) {
      this.subscribeOn(rootPath);
    }

  }
  renderSwitch(path) {
    return (
      <View key={path} style={styles.switchContainer}>
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
      {this.state.pathList.map((path) => this.renderSwitch(path) )}
    </View>
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
        { this.renderSwitches()}
        <Text>{this.state.status}</Text>
        { this.renderSwitch('subscribeOnListener')}
        <TextInput 
          onChangeText={(rootPath) => this.setState({rootPath})}
          value={this.state.rootPath} 
          testID= {"rootPath"}
          accessibilityLabel="rootPath"
          />
        </ScrollView>
        <Button
          onPress={() => this.loadPathItems()}
          title="Load Path Items"
          disabled={!this.state.logined}
          testID= {"reloadRootPathList"}
          accessibilityLabel="reloadRootPathList"
        />
        <Button
          onPress={() => this.loadSelected()}
          title="Load Selected"
          disabled={!this.state.logined}
          testID= {"loadSelected"}
          accessibilityLabel="loadSelected"
        />
        <Button
          onPress={() => this.loadAll()}
          title="Load All"
          testID= {"loadAll"}
          disabled={!this.state.logined}
          accessibilityLabel="loadAll"
        />
      </View>
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
      margin: 20
  },
  switchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  }
});

