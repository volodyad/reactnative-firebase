import React from 'react';
import { StyleSheet, Text, View, Button, Switch, ScrollView, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
const config = require('./config');
import { getFirebaseRefByRest } from './apiFirebase';
import _ from 'lodash';
const PERSISTENT_PATH = 'shiftManagers';
let i = 5;

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
    this.login = this.login.bind(this);
    this.goOnline = this.goOnline.bind(this);
  }

  fbConnected() {
    const connectedRef = firebase.database().ref(".info/connected");
    const result = new Promise((resolve) => {
      connectedRef.on("value", function(snap) {
        resolve(snap.val());
      });
    })
    return result;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        this.fbConnected().then(connected => {
          //this.login(config.EMAIL, config.PASSWORD)
          if(!connected) {
            this.setState({ offline: true, logined: true });
          }
          else {
            this.login(config.EMAIL, config.PASSWORD)
          }
        })
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
    ref.on('value', (snapshot) => {
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
    this.setState({logined: true});
 //   this.loadPathItems();
  }

  login(userName, password) {
    firebase.auth()
    .signInAndRetrieveDataWithEmailAndPassword(userName, password)
    .then(this.onLogined)
    .catch((err) => {
      debugger
      this.setState({ status: `Login error ${err}` })
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

  goOnline() {
    firebase.database().goOnline();
  }


  loadNoPerm() {

    firebase.database().ref('test')
    .orderByKey()
    .limitToFirst(1)
    .once('value')
    .then(snapshot => { 
      debugger;
      snapshot.val()
    });
return;
    debugger;
  //  firebase.database().goOffline();


    // const path = 'test';
    // const ref = firebase.database().ref(path);
    // ref.keepSynced(true);
    // ref.on('value', (snapshot) => {
    //   debugger;
    //   const val = snapshot.val();
    //   console.warn(path + ' loaded');
    // });
    //  debugger;
    //  const s = ref.orderBy("rangeFrom")
    //  .star(500)
    //  .limitToFirst(1)
    //  .once('value')
    //  .then((snap) => { debugger;
    //    const c = snap.val();
    // ref.set({'1': 1})
    // .then(() => {
    //   debugger;
    // }).catch(() => {
    // });
    //return;
    // const generateTestData = () => {
    //   return ([...Array(10).keys()].map(i => ({
    //     [i]: 
    //     {
    //       rangeFrom: 101,
    //       rangeTo: 200,
    //       accountNumber: '1'
    //     }})));
    // }

    const generateTestData1 = (i) => {
      return {
          rangeFrom: 107,
          rangeTo: 233,
          accountNumber: i,
          big: [...Array(10).keys()].map(i => i + 'awdawdadwadaweawdawddwaawawdlkajwdkajd;awd;akd;lakwdlak;dlka;ldwkalw;dkawndawdkawdakdja;lwdjdawjdadad')
        };
    }

  for(let i = 0; i < 1; i++ ) {
    firebase.database().ref(path + '/' + i)
      .set(generateTestData1(i)).then(() => {
      //  debugger; 
        console.log(i);
      }).catch(() => {
        //debugger;
      });
  }

  firebase.database().ref(path + '/0', (values) => {
    debugger;
  })
  

  //  firebase.database().goOnline();
    //    const s = ref.orderBy("rangeFrom")
    //  .startAt(500)
    //  .limitToFirst(1)
    //  .once('value')
    //  .then((snap) => { 
    //    //debugger;
    //   });
    //    const c = snap.val();
//     const { rootPath } = this.state;
//     const path = 'persistent/events2/OUT';
//     const ref = firebase.database().ref(path);
//    firebase.database().goOffline();
// debugger;
// const ref1 = firebase.database().ref('persistent/events2');
// ref1.on('value', (snapshot) => {
//   debugger;
//   const val = snapshot.val();

// });
//     ref.set({ id: 'megaevent '}).then(() => {
//       console.log('saved');
//       debugger;
//     }).catch(() => {
//       console.log('error');   debugger;

//     })
    // ref.on('value', (snapshot) => {
    //   debugger;
    //   const val = snapshot.val();
  
    // });
    

    // ref.set({ test: i++ }).then(() => {
    //   debugger;
  
    // });
    
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
        <Text>{this.state.offline}</Text>
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
          <Button
          onPress={() => this.loadNoPerm()}
          title="Load No Permission"
          testID= {"loadNoPerm"}
          disabled={!this.state.logined}
        />
        <Button
          onPress={() => this.goOnline()}
          title="Go online"
          testID= {"goOnline"}
          disabled={!this.state.logined}
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

