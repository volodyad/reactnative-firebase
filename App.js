import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import config from './config';

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

const subscribe = (path) => {
  const ref = firebase.database().ref(path);
  ref.keepSynced(true);

   debugger;
  ref.on('value', (snapshot) => {
    debugger;
    console.log(path);
    const v = snapshot.val();
   const test =  memorySizeOf(v)
    console.warn('data loaded')
    const text = v[0].value[0].BR1.lastInArea;
    this.setState({loaded: text})
  });
}

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { loaded: 'abc' };
  }
  componentDidMount() {
    const loadRoute = () => {
      subscribe('./dailyMatrix');
      subscribe('./dailyMatrix2');
      subscribe('./dailyMatrix3');
      subscribe('./dailyMatrix4');
    }
    debugger;
    firebase.auth().onAuthStateChanged(function(user) {
      if(!user) {
        firebase.auth()
        .signInAndRetrieveDataWithEmailAndPassword('', '')
        .then(() => {
          const test1 = firebase.auth().currentUser;
          loadRoute();
        })
        .catch(() => {
          debugger;
        }) ;
      }
      else {
        loadRoute();
       }
    
    });
  
   
  }

  render() {
    debugger;
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>11{this.state.loaded}</Text>
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
