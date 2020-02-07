import React, {Component} from 'react'
import { AppRegistry } from 'react-native';
import createSagaMiddleware from 'redux-saga'
import { Provider } from "react-redux";
import {createStore,applyMiddleware} from 'redux'

import App from './App'
import rootSaga from './app/store/saga/'
import rootReducer from './app/store/reducer/'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
  )
  sagaMiddleware.run(rootSaga)

class RNRedux extends Component{
    render(){
    return <Provider store={store}>
                <App/>   
            </Provider>
    }
}
AppRegistry.registerComponent('AutographaGo_ReactNative', () => RNRedux ) ;
