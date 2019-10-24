import React, {Component} from 'react'
import { AppRegistry } from 'react-native';
import App from './App'
import { Provider } from "react-redux";
import {editNoteReducer} from './app/store/reducer/editNoteReducer'

import configureStore from './app/store/configureStore';
const store = configureStore()

class RNRedux extends Component{
    render(){
    return <Provider store={store}><App/></Provider>

    }
}
AppRegistry.registerComponent('AutographaGo_ReactNative', () =>RNRedux);
