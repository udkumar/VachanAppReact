// import React,{Component } from 'react'
// import {View,Text,FlatList,Dimensions,WebView,BackHandler,Platform} from 'react-native'
// import DbHelper from '../utils/dbHelper.js'
// import USFMParser from '../utils/USFMParser'
// import TextParser from '../utils/TextParser'

// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;


// export default class AddData extends Component {
//     constructor(props){
//         super(props);
//         this.state = {
//             canGoBack: false
//         }
//         this.backHandler = this.backHandler.bind(this)
//         this.onNavigationStateChange = this.onNavigationStateChange.bind(this)
//     }

//     componentDidMount(){
//         if (Platform.OS === 'android') {
//             BackHandler.removeEventListener('hardwareBackPress',this.backHandler);
//           }
//    }
//    componentWillUnmount(){
//     if (Platform.OS === 'android') {
//         BackHandler.removeEventListener('hardwareBackPress',this.backHandler);
//       }
//    }
//    backHandler = () => {
//     if (this.state.canGoBack) {
//         this.webView.goBack();
//         return true;
//       }
//       return false;
//    }
//    onNavigationStateChange(navState) {
//     console.log("state of backbutton in navigation  "+this.state.canGoBack)
//     this.setState({
//         canGoBack: navState.canGoBack
//     });
//   }
//     render(){
//         console.log("state of backbutton  "+this.state.canGoBack)
//         return(
//             <WebView
//             ref={(webView) => { this.webView = webView; }}
//             source={{uri:'file:///android_asset/english_esv/AC.html'}}
//             onNavigationStateChange={this.onNavigationStateChange}
//           />
            
//         )
//     }
// }




import React, { Component } from 'react';
import {
  BackHandler,
  Platform,
  WebView,
} from 'react-native';

export default class splitScreen extends Component {
    constructor(){
        super();
        this.state = {
            canGoBack: false,
            ref: null,
          }
          this.onAndroidBackPress = this.onAndroidBackPress.bind(this)
    }
 

  onAndroidBackPress = () => {
    if (this.state.canGoBack && this.state.ref) {
      this.state.ref.goBack();
      return true;
    }
    return false;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  render() {
    return (
      <WebView
        source={{uri:'file:///android_asset/Bibles/english_bbe/index.html'}}
        ref={(webView) => { this.state.ref = webView; }}
        onNavigationStateChange={(navState) => { this.state.canGoBack = navState.canGoBack; }}
      />
    );
  }
}