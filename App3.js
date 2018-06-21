import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import firebase from 'react-native-firebase';
const config = require('./config');

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
      if(obj !== null && obj !== undefined) {
          switch(typeof obj) {
          case 'number':
              bytes += 8;
              break;
          case 'string':
              bytes += obj.length * 2;
              break;
          case 'boolean':
              bytes += 4;
              break;
          case 'object':
              var objClass = Object.prototype.toString.call(obj).slice(8, -1);
              if(objClass === 'Object' || objClass === 'Array') {
                  for(var key in obj) {
                      if(!obj.hasOwnProperty(key)) continue;
                      sizeOf(obj[key]);
                  }
              } else bytes += obj.toString().length * 2;
              break;
          }
      }
      return bytes;
  };

  function formatByteSize(bytes) {
      if(bytes < 1024) return bytes + " bytes";
      else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
      else return(bytes / 1073741824).toFixed(3) + " GiB";
  };

  return formatByteSize(sizeOf(obj));
};

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { loaded: 'abc', index: 2 };
    //this.onRelogin = this.onRelogin.bind(this);
    this.loadRoute = this.loadRoute.bind(this);
    this.refsCache = [];
  }
  componentDidMount() {
    let firstLoad = true;
    firebase.auth().onAuthStateChanged((user) => {
      debugger;
      if(!firstLoad) return;
      firstLoad = false;
      if(!user) {
        this.login(config.EMAIL, config.PASSWORD)
      }
      else {
       // this.loadRoute();

        // var connectedRef = firebase.database().ref(".info/connected");
        // connectedRef.on("value", (snap) => {
        //   if (snap.val() === false) {
        //     debugger
        //     this.subscribeOn('/matrixes/matrix8/0/value/0');
        //   }
        // });
      }
      
    }); 
  }

  subscribe = (path) => {
    debugger;
    const ref = firebase.database().ref(path);
    ref.keepSynced(true);
    this.refsCache.push(ref);
    // ref.on('value', (snapshot) => {
    //   debugger;
    //   console.log(path);
    //   const v = snapshot.val();
    //   const test =  memorySizeOf(v)
    //   console.warn('data loaded')
    //   const text = v[0].value[0].BR1.lastInArea;
    //   this.setState({loaded: text})
    // });
  }

  subscribeOn = (path) => {
    const ref = firebase.database().ref(path);
    ref.on('value', (snapshot) => {
      debugger;
      console.log(path);
      const v = snapshot.val();
      if(!v) return;
      const test =  memorySizeOf(v)
      console.warn('data loaded')
      const text = v[0].value[0].BR1.lastInArea;
      this.setState({loaded: text})
    });
    ref.once('value').then((snapshot) => {
      debugger;
      console.log(path);
      const v = snapshot.val();
      if(!v) return;
      const test =  memorySizeOf(v)
      console.warn('data loaded')
      const text = v[0].value[0].BR1.lastInArea;
      this.setState({loaded: text})
    });
  }

 loadRoute(count) {
    // this.subscribe('/dailyMatrix');
    // this.subscribe('/dailyMatrix2');
    // this.subscribe('/dailyMatrix3');
debugger;

    //firebase.database().ref('/matrixes/matrix7').remove();
    if(count) {
      for (let i = 1; i <= count; i++) { 
        this.subscribe('/matrixes/matrix' + i);
      }
    }
    else {
      this.subscribe('/matrixes');
    }
     //this.subscribe('/matrixes/matrix5');
    // this.subscribe('/matrixes/matrix6');
     //this.subscribe('/matrixes/matrix7');
     //this.subscribe('/matrixes/matrix8');

   //this.subscribeOn('/matrixes');

    
  }

  login(userName, password) {
    firebase.auth()
    .signInAndRetrieveDataWithEmailAndPassword(userName, password)
    .then(() => {
      this.loadRoute();
    })
    .catch(() => {
      debugger;
    });
  }

  loadAll() {
    this.loadRoute();
  }

  loadByIndexCount() {
    const index = parseInt(this.state.index);
    this.loadRoute(index);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>11{this.state.loaded}</Text>
        <TextInput
          onChangeText={(index) => this.setState({index})}
          testID= {"indexCount"}
          style={{width: 200}}
          accessibilityLabel= {"indexCount"}
          value={this.state.index}
        />
        <Button
          onPress={() => this.loadByIndexCount()}
          title="Load by index"
          testID= {"loadByIndex"}
          accessibilityLabel="loadByIndex"
        />
        <Button
          onPress={() => this.loadAll()}
          title="Load all"
          testID= {"loadAll"}
          accessibilityLabel="loadAll"
        />
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
