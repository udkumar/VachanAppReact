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
import LanguageList from '../screens/LanguageList'
// import More from '../screens/More'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import SelectionTab from '../screens/ReferenceSelection/'
import BookMarks from '../screens/Bookmarks/';
import Infographics from '../screens/StudyHelp/InfoGraphics/';
import Header from '../components/Header';


// header: ({ scene, previous, navigation }) => {
//   const { options } = scene.descriptor;
//   const title =
//     options.headerTitle !== undefined
//       ? options.headerTitle
//       : options.title !== undefined
//       ? options.title
//       : scene.route.routeName;

//   return (
//     <MyHeader
//       title={title}
//       leftButton={
//         previous ? <MyBackButton onPress={navigation.goBack} /> : undefined
//       }
//     />
//   );
// };


const BibleStack = createStackNavigator(
  {  
    // Commentary:{screen:Commentary},
      Bible:{
        screen:Bible,
        // navigationOptions:Header,
        
        // ({
        //   headerStyle: {
        //     backgroundColor:"#3F51B5",
        //     shadowColor: 'black',
        //     shadowRadius: 5,
        //     shadowOpacity: 0.1,
        //     shadowOffset: {
        //       height: 3,
        //       width: 0,
        //     },
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
           
        // })
      },
  
     
      Search: { screen: Search },
      BackupRestore: {screen: BackupRestore },
      
      // More:{ screen:More,
      //   navigationOptions: { headerTitle:"More" }
      // },
      SelectionTab:{screen:SelectionTab,
        navigationOptions: { headerTitle:"Select Chapter" }
      },
      
      Notes:{ screen:Notes
      },
      
      LanguageList:{screen:LanguageList },

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
  
 
  }
)

const CommentaryStack = createStackNavigator({ 
    Commentary:{screen:Commentary,
      
    // navigationOptions:Header
  },
  LanguageList:{screen:LanguageList },

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
     
  }
);



const MoreStack = createStackNavigator(
 { 
  More:{ screen:More,
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
  About: { screen: About },
  Settings: { screen: Settings },
  Hints: { screen: Hints },
  History:{ screen:History},
  BookMarks:{  screen:BookMarks },
  Highlights:{screen:Highlights  },
  NotePage:{ screen:NotePage },
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
 
}
);
const InfoGraphicsStack = createStackNavigator(
  {Infographics:{ 
    screen:Infographics,
    // navigationOptions:Header
  },
  LanguageList:{screen:LanguageList },

},
{

  defaultNavigationOptions: {
    headerStyle: {
        backgroundColor: "#3F51B5",
        elevation: 0,
        shadowOpacity: 0,
        justifyContent:'center'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center' 
    }
},
}
);


BibleStack.navigationOptions = ({ navigation }) => {
  // console.log(" navigation in  stack bible  ",navigation)
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "Bible") {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });

  }

  return {
    tabBarVisible:tabBarVisible,
    tabBarLabel: 'Bible',
    tabBarIcon: () => <Icon name="book-open-page-variant" size={20} style={{color:'#fff'}}/>,
  //   tabBarOnPress:(nav,defaultNavigation)=>{
  //     console.log("BibleStack ",navigation)
  //     console.log("Tab Bar ON Press  dangerouslyGetParent ",navigation.dangerouslyGetParent())
  //     console.log("Tab Bar ON Press  ",nav)
  //     // nav.setParams(navigation.state.routes.routeName)
  //     // navigation.dangerouslyGetParent()
  //     defaultNavigation()
  // }
  }  
}

CommentaryStack.navigationOptions = ({ navigation }) => {
  // console.log("navigation stack commentary ", navigation.state)
  let tabBarVisible;

  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "Commentary") {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }
  return {
    tabBarVisible:tabBarVisible,
    tabBarLabel: 'Commentary',
    tabBarIcon: () => <Icon name="comment-text" size={20} style={{color:'#fff'}}/>,
    // tabBarOnPress:(nav,defaultNavigation)=>{
    //     console.log("CommentaryStack ",navigation)
    //     console.log("Tab Bar ON Press  ",nav)
    //     // nav.setParams(navigation.state.routes.routeName)
    //   console.log("Tab Bar ON Press  dangerouslyGetParent ",navigation.dangerouslyGetParent())

    //     // navigation.dangerouslyGetParent()
    //     defaultNavigation()
    // }
    
  };
};
InfoGraphicsStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "Bible") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible:tabBarVisible,
    tabBarLabel: 'InfoGraphics',
    tabBarIcon: () => <Icon name="chart-line" size={20} style={{color:'#fff'}}/>,
  //   tabBarOnPress:(nav,defaultNavigation)=>{
  //     // nav.setParams(navigation.state.routes.routeName)
  //     console.log("InfoGraphicsStack ",navigation)
  //     console.log("Tab Bar ON Press  ",nav)
  //     console.log("Tab Bar ON Press  dangerouslyGetParent ",navigation.dangerouslyGetParent())
  //     navigation.dangerouslyGetParent()
  //     defaultNavigation()
  // }
  };
};

MoreStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map(route => {
      if (route.routeName === "More") {
        tabBarVisible = true;
      } else {
        tabBarVisible = false;
      }
    });
  }
  return {
    tabBarVisible:tabBarVisible,
    tabBarLabel: 'More',
    tabBarIcon: () => <Icon name="menu" size={20} style={{color:'#fff'}}/>,
  };
};



const AppTabNavigator = createBottomTabNavigator(
  {
  BibleStack,
  CommentaryStack,
  InfoGraphicsStack,
  MoreStack,
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


