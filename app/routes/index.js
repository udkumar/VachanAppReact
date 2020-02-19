// all of our routes
import {createStackNavigator, createBottomTabNavigator,createSwitchNavigator,createAppContainer} from 'react-navigation'
import React,{Component} from 'react';
import About from '../screens/About/About'
import Search from '../screens/Search/Search'
import Settings from '../screens/settings/Settings'
import Notes from '../screens/Note/index'
import EditNote from '../screens/Note/EditNote'
import NotePage from '../screens/Note/NotePage'
import Highlights from '../screens/Highlights/'
import History from '../screens/History/'
import Commentary from '../screens/StudyHelp/Commentary/'
import InfoGraphics from '../screens/StudyHelp/InfoGraphics/'
import More from '../screens/StudyHelp/More/'
import {connect} from 'react-redux'
import {updateContentType} from '../store/action/'
import StudyHelp from '../screens/StudyHelp/'

import Hints from '../screens/Hints/Hints'
import BackupRestore from '../screens/backup/BackupRestore'
// import DrawerScreen from '../screens/DrawerScreen/DrawerScreen'
import Bible from '../screens/Bible'
import LanguageList from '../screens/LanguageList'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import SelectionTab from '../screens/ReferenceSelection/'
import BookMarks from '../screens/Bookmarks/';
import Infographics from '../screens/StudyHelp/InfoGraphics/';

import ModalForSelection from '../screens/ModalForSelection'

const NavStack = createStackNavigator(
  {  
    // ModalForSelection:{
    //   screen:ModalForSelection,
    //   navigationOptions: {
    //     // title: 'Home',
    //     header: null
    //   },
    // },
      Bible:{
        screen:Bible,
        navigationOptions: {
          // title: 'Home',
          // header: null
        },
      },
      Search: { screen: Search,

       },
      BackupRestore: {screen: BackupRestore },
      SelectionTab:{screen:SelectionTab,
        navigationOptions: { headerTitle:"Select Chapter" }
      },
      Notes:{ screen:Notes
      },
      LanguageList:{screen:LanguageList },
      EditNote:{  screen:EditNote },
      NotePage:{ screen:NotePage },
      StudyHelp:{screen:StudyHelp},
      Commentary:{screen:Commentary,},
      About: { screen: About },
      Settings: { screen: Settings },
      Hints: { screen: Hints },
      History:{ screen:History},
      BookMarks:{  screen:BookMarks },
      Highlights:{screen:Highlights  },
      NotePage:{ screen:NotePage },
      Infographics:{ screen:Infographics, },
     
  },
  
  
  { 
    // headerMode: 'none',
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: "#3F51B5",
          elevation: 0,
          shadowOpacity: 0,
          height:40
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
  },
  
  }
)




const SwitchNavigator = createSwitchNavigator({
  NavStack:NavStack
  });
  
 export const AppNavigator = createAppContainer(SwitchNavigator);


