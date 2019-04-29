// import React, { Component } from 'react';
// import {
//   Text, TouchableOpacity,
//   ScrollView,AppRegistry,
//    StyleSheet, View, Platform,
//     Picker, ActivityIndicator, Button, Alert
// } from 'react-native';

// import { TabNavigator } from "react-navigation";
// import Languagelist from '../LanguagesList'
// import VersionList from '../Versionlist'


// const Tabs = TabNavigator({
//   Languagelist: {
//     screen: Languagelist,
//     navigationOptions: {
//         tabBarLabel:"Languages"
//     }
//   },
//   VersionList: {
//       screen: VersionList,
//       navigationOptions: {
//           tabBarLabel:"Versions"
//       }
//   },
 
// }, {
//   tabBarOptions: {  
//     activeTintColor: '#f2f2f2',
//     activeBackgroundColor: '#2EC4B6',
//     inactiveTintColor: '#666',
    
//     swipeEnabled: false,
//     labelStyle: {
//       fontSize: 18,
//     },
//   }
// });


// export default class Language extends Component{
//   constructor(props){
//     super(props)
//   }
//   navigateTo = (screen,params) => {
//     this.props.navigation.navigate(screen,params)
    
//   }
//   static navigationOptions = ({navigation}) =>({
//     headerTitle: 'Change Language',
//   })
//   render() {
 
//     return(
//       <Tabs 
//         screenProps={{
//           navigateTo: this.navigateTo,
//           updateLanguage:this.props.screenProps.updateLanguage,
//           updateBookList:this.props.screenProps.updateBookList,
//           updatVersionId:this.props.screenProps.updatVersionId
//         }}
//       />

//     )
//   }
// }
 
