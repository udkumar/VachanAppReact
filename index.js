import { AppRegistry } from 'react-native';
import App from './app/utils/routes'
// import App from './app/navigation'
// import Audio from './app/screens/Audio'
import React, {Component} from 'react'
import Googlesign from './app/screens/Googlesign'

//import AddData from './app/utils/AddData'
export default class AutographaGo extends Component {

    render(){
        return(
            <App/>
        )
    }
}

AppRegistry.registerComponent('AutographaGo_ReactNative', () =>App);