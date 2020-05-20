import {firebase} from './firebase.environment';

export const environment = {
  production: true,
  firebaseConfig: {
    ...firebase.config
  }
};
