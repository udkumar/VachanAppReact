import React, {Component} from 'react'
import { AppRegistry,AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga'
import { Provider } from "react-redux";
import { persistStore,persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react'
import SplashScreen from 'react-native-splash-screen'

import {createStore,applyMiddleware,combineReducers} from 'redux'
import App from './App'
import rootSaga from './app/store/saga/'
import rootReducer from './app/store/reducer/'
// import updateStylingReducer from './app/store/reducer/updateStylingReducer'
// import UpdateVersionReducer from './app/store/reducer/updateVersionReducer'

const sagaMiddleware = createSagaMiddleware()


const persistConfig = {
    // Root?
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['updateVersion','updateStyling'],
  };
const reducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
  )

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

class RNRedux extends Component{
    // componentDidMount(){
    //     // await this.setInitialValue()
    //       SplashScreen.hide()
    //     }
    // async componentDidMount() {
    //       // var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
    //       // this.setState({email})
    //       var config = {
    //         apiKey: "AIzaSyDUc9nH-YlnKD9YmJ8oisBfcAbUZh-6wg0",
    //         authDomain: "vachan-go.firebaseapp.com",
    //         databaseURL: "https://vachan-go.firebaseapp.com",
    //         projectId: "vachan-go",
    //         storageBucket: "vachan-go.appspot.com",
    //          messagingSenderId: "486797934259"
    //        };
    //       firebase.initializeApp(config);
    //         // var email = await AsyncStorageUtil.getItem(AsyncStorageConstants.Keys.BackupRestoreEmail, "")
    //         // this.setState({email})          
    // }

    render(){
    return <Provider store={store}>
                <PersistGate 
                    persistor={persistor}
                >
                <App/>   
            </PersistGate >
            </Provider>
    }
}
AppRegistry.registerComponent('VachanGo', () => RNRedux ) ;
