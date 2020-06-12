// all of our routes
import {createStackNavigator, createDrawerNavigator,createSwitchNavigator,createAppContainer} from 'react-navigation'
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
import Dictionary from '../screens/StudyHelp/Dictionary/'

import InfoGraphics from '../screens/StudyHelp/InfoGraphics/'
import More from '../screens/StudyHelp/More/'
import {connect} from 'react-redux'
import {updateContentType} from '../store/action/'
import StudyHelp from '../screens/StudyHelp/'

import Hints from '../screens/Hints/Hints'
import Reset from '../screens/backup/Reset'
import Register from '../screens/backup/Register'
import Login from '../screens/backup/Login'
import ProfilePage from '../screens/backup/ProfilePage'



import DrawerScreen from '../screens/DrawerScreen'
import Bible from '../screens/Bible'
import LanguageList from '../screens/LanguageList'
import Icon from 'react-native-vector-icons/MaterialIcons'

import SelectionTab from '../screens/ReferenceSelection/'
import BookMarks from '../screens/Bookmarks/';
import Infographics from '../screens/StudyHelp/InfoGraphics/';

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
        navigationOptions: ({ navigation }) => ({
          // title: null,  // Title to appear in status bar
          // header:null,
          // headerLeft :<MenuIcon navigate={navigation.navigate}/>,
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          
           
        })
      
      },
      Search: { screen: Search,

       },
      SelectionTab:{screen:SelectionTab,
        navigationOptions: { headerTitle:"Select Chapter" }
      },
      Notes:{ screen:Notes
      },
      LanguageList:{screen:LanguageList },
      EditNote:{screen:EditNote },
      NotePage:{screen:NotePage },
      StudyHelp:{screen:StudyHelp},
      Commentary:{screen:Commentary},
      Dictionary:{screen:Dictionary},
      About:{screen:About},
      Settings:{screen:Settings},
      Hints:{screen:Hints},
      History:{screen:History},
      BookMarks:{screen:BookMarks},
      Highlights:{screen:Highlights},
      NotePage:{screen:NotePage},
      Infographics:{screen:Infographics},
      Login:{screen: Login},
      Register:{screen: Register},
      Reset:{screen: Reset},
      ProfilePage:{screen:ProfilePage}

     
  },
  
  
  { 
    // headerMode: 'none',
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: "#3E4095",
          elevation: 0,
          shadowOpacity: 0,
          // height:40
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
  },
  
  }
)

const DrawerNavigate = createDrawerNavigator({
 
  StackNavigate:{
    screen: NavStack
  },

},
{
  // initialRouteName: 'Bible',
  contentComponent:DrawerScreen,
  drawerWidth: 250,
  overlayColor: 'rgba(52, 52, 52, 0.8)'
},
);

// const SignedOut = createStackNavigator({
//       Login:{screen: Login},
//       Register:{screen: Register},
//       Reset:{screen: Reset},

// }) 

const SwitchNavigator = createSwitchNavigator({
  DrawerNavigate:DrawerNavigate
  });
  
  export const AppNavigator = createAppContainer(SwitchNavigator);

  // export const AppNavigator = (signedIn = false) => createAppContainer(
  //   createSwitchNavigator(
  //     {
  //       SignedIn: {
  //         screen: DrawerNavigate
  //       },
  //       SignedOut: {
  //         screen: SignedOut
  //       }
  //     },
  //     {
  //       initialRouteName: signedIn ? "SignedIn" : "SignedOut"
  //     }
  //   )
  // )

