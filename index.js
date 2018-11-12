import { AppRegistry } from 'react-native';
// import App from './app/utils/routes'
// import AddData from './app/screens/AddData'
import SplitScreen from './app/screens/SplitScreen'


import React, {Component} from 'react'

export default class AutographaGo extends Component {

    constructor(props) {
        super(props)
    }
    
    render(){
        return(
            <SplitScreen/>
        )
    }
}

AppRegistry.registerComponent('AutographaGo_ReactNative', () =>  SplitScreen);
