const api = require('./api').default;
const config = require('./config');
import firebase from 'react-native-firebase';

export const getFirebaseRefByRest = (refPath, shallow = false) => {
    return firebase.auth().currentUser.getIdToken().then(accessToken => {
      const options = { API: config.FIREBASE_DATABASE_URL };
      const url = `${refPath}.json?${
        shallow ? 'shallow=true&' : ''
      }auth=${accessToken}`;
      const headers = {};
      const body = null;
      return api.get(url, headers, body, options);
    });
  };