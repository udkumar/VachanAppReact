import { AppRegistry } from 'react-native';
import App from './app/utils/routes'
import React, {Component} from 'react'
import sampleplay from'./app/screens/Audio/sampleplayer'

import AddData from './app/utils/AddData'
export default class AutographaGo extends Component {

    render(){
        return(
            <App/>
        )
    }
}

AppRegistry.registerComponent('AutographaGo_ReactNative', () =>App);