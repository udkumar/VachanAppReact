import React, {Component} from 'react'
import { AppRegistry,AsyncStorage } from 'react-native';
import createSagaMiddleware from 'redux-saga'
import { Provider } from "react-redux";
import { persistStore,persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react'

import {createStore,applyMiddleware} from 'redux'
import App from './App'
import rootSaga from './app/store/saga/'
import rootReducer from './app/store/reducer/'
import { typography } from './app/utils/typography'

const sagaMiddleware = createSagaMiddleware()
  const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['updateVersion','updateStyling','userInfo'],
  };
const reducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
  )

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)
typography()


class RNRedux extends Component{

    render(){
     
    return <Provider store={store}>
            <PersistGate persistor={persistor}>
              <App/>   
            </PersistGate>
            </Provider>
    }
}

AppRegistry.registerComponent('VachanGo', () => RNRedux ) ;
