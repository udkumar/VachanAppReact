// all of our routes
import {createStackNavigator, createDrawerNavigator,createSwitchNavigator,createAppContainer} from 'react-navigation'

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

import SelectionTab from '../screens/ReferenceSelection/'
import BookMarks from '../screens/Bookmarks/';
const StackNavigate = createStackNavigator(
  {  
      // StudyHelp:{screen:StudyHelp},
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
      // StudyHelp:{screen:StudyHelp},
      Commentary:{screen:Commentary}
      // Video:{
      //   screen:Video
      // },
      // Audio:{
      //   screen:Audio
      // },
     
  },
  
  { 
    defaultNavigationOptions: {
      headerTintColor: '#fff',
      headerStyle:{ backgroundColor:"#3F51B5" },
      headerTitleStyle: { fontWeight: 'normal',},
    },
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
  }
  // transitionConfig:() => ({
  // 	transitionSpec: {
  // 		duration: 200,
  // 		timing: Animated.timing,
  // 		easing: Easing.step0,
  // 	},
  // }),
  }
  

)

const SwitchNavigator = createSwitchNavigator({
    StackNavigate: { screen: StackNavigate },
  });
  
export const AppNavigator = createAppContainer(SwitchNavigator);

