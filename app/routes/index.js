// all of our routes
import {createStackNavigator, createBottomTabNavigator,createSwitchNavigator,createAppContainer} from 'react-navigation'
import React,{Component} from 'react';
import About from '../screens/About/About'
import Search from '../screens/Search/Search'
import Settings from '../screens/settings/Settings'
import Account from '../screens/Account'
import Notes from '../screens/Note/index'
import EditNote from '../screens/Note/EditNote'
import NotePage from '../screens/Note/NotePage'
import Highlights from '../screens/Highlights/'
import History from '../screens/History/'
import Commentary from '../screens/StudyHelp/Commentary/'

// import Audio from '../screens/Bible/Navigate/Audio/'
// import Video from '../screens/Bible/Navigate/Video/'
import StudyHelp from '../screens/StudyHelp/'

// import ReferenceSelection from 
// import ChapterSelection from '../screens/numberSelection/ChapterSelection'
import Hints from '../screens/Hints/Hints'
import BackupRestore from '../screens/backup/BackupRestore'
// import DrawerScreen from '../screens/DrawerScreen/DrawerScreen'
import Bible from '../screens/Bible'
// import BottomTab from '../screens/Bible/BottomTab'
import GoogleMaps from  '../screens/GoogleMaps'
import Images from '../screens/Images'
import LanguageList from '../screens/LanguageList'
import More from '../screens/More'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import SelectionTab from '../screens/ReferenceSelection/'
import BookMarks from '../screens/Bookmarks/';


const BibleStack = createStackNavigator(
  {  
    // Commentary:{screen:Commentary},
      Bible:{screen:Bible,
        navigationOptions: () => ({
          headerStyle: {
            backgroundColor:"#3F51B5",
            shadowColor: 'black',
            shadowRadius: 5,
            shadowOpacity: 0.1,
            shadowOffset: {
              height: 3,
              width: 0,
            },
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
           
        })
      },
  
      About: { screen: About },
      Settings: { screen: Settings },
      Hints: { screen: Hints },
      Search: { screen: Search },
      BackupRestore: {screen: BackupRestore },
      GoogleMaps:{ screen:GoogleMaps },
      Images:{ screen:Images},
      LanguageList:{screen:LanguageList },
      Account:{ screen:Account},
      
      More:{ screen:More,
        navigationOptions: { headerTitle:"More" }
      },
      SelectionTab:{screen:SelectionTab,
        navigationOptions: { headerTitle:"Select Chapter" }
      },
      BookMarks:{  screen:BookMarks },
      Highlights:{screen:Highlights  },
      Notes:{ screen:Notes
      },
      History:{ screen:History},

      EditNote:{  screen:EditNote },
      NotePage:{ screen:NotePage },
      StudyHelp:{screen:StudyHelp},
      // Commentary:{screen:Commentary}
      // Video:{
      //   screen:Video
      // },
      // Audio:{
      //   screen:Audio
      // },
     
  },
  
  { 
   
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: "#3F51B5",
          elevation: 0,
          shadowOpacity: 0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
  },
  navigationOptions: {
    tabBarLabel: 'Bible',
    tabBarIcon: () => <Icon name="book-open-page-variant" size={20} style={{color:'#fff'}}/>
  },
  // transitionConfig:() => ({
  // 	transitionSpec: {
  // 		duration: 200,
  // 		timing: Animated.timing,
  // 		easing: Easing.step0,
  // 	},
  // }),
  }
  

)

const CommentaryStack = createStackNavigator(
  { screen:Commentary,
      // navigationOptions: () => ({
      //     headerStyle: {
      //       backgroundColor:"#3F51B5",
      //     },
      //     headerTintColor: '#3F51B5',
      //     headerTitleStyle: {
      //       fontWeight: 'bold',
      //     },
           
        // })
  },
  {
  defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: "#3F51B5",
          elevation: 0,
          shadowOpacity: 0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
  },
      navigationOptions: {
          tabBarLabel: 'Commentary',
          tabBarIcon: () => <Icon name="comment-text" size={20} style={{color:'#fff'}}/>,
          

      },
  }
);
const ParallelBible = createStackNavigator(
  { screen:Commentary,
      navigationOptions: () => ({
          headerStyle: {
            backgroundColor:"#3F51B5",
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
           
        })
  },
  {
      navigationOptions:{
          tabBarLabel: 'Parallel',
      tabBarIcon: () => <Icon name="view-parallel" size={20} style={{color:'#fff'}}/>,
      },
  }
 
);
const InfoGraphics = createStackNavigator(
  { screen:Commentary,
      navigationOptions: () => ({
          headerStyle: {
            backgroundColor:"#3F51B5",
          
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
           
        })
  },
  {
      navigationOptions:{
          tabBarLabel: 'InfoGraphics',
          tabBarIcon: () => <Icon name="chart-line" size={20} style={{color:'#fff'}}/>,
      },
  }
);

const AppTabNavigator = createBottomTabNavigator(
  {
  BibleStack,
  CommentaryStack,
  ParallelBible,
  InfoGraphics
  },
  {   
    tabBarPosition: 'bottom',
    activeTintColor:'#fff',
    inactiveTintColor:'#D3D3D3',
    swipeEnabled:false,
    tabBarOptions: {
        labelStyle: { fontSize: 10,margin:0,padding:0 },
        showIcon: true,
        showLabel: true,
        activeTintColor: '#fff',
        upperCaseLabel: false,
        style: {
            backgroundColor: '#3F51B5', // Makes Android tab bar white instead of standard blue
        },
        indicatorStyle: {
            backgroundColor: '#fff',
        },
    },

},
);


const SwitchNavigator = createSwitchNavigator({
  AppTabNavigator: { screen: AppTabNavigator },
  });
  
export const AppNavigator = createAppContainer(SwitchNavigator);

