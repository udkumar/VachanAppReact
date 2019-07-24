import { StackNavigator ,TabNavigator} from "react-navigation";
import StudyHelp from '../Navigate/StudyHelp'
import NotePad from '../Navigate/NotePad'
import Audio from '../Navigate/Audio'
import Video from '../Navigate/Video'
import Foonotes from '../Navigate/Footnotes'
import Summary from '../Navigate/Summary'
import Commentary from '../Navigate/Commentary'
import Dictionary from '../Navigate/Dictionary'
import HighLights from '../Navigate/Highlights'
import Note from '../Navigate/Note'
import Bookmarks from '../Navigate/Bookmarks'
import History from '../Navigate/History'



const BottomTab = TabNavigator(
	{
    NotePad:{
        screen:NotePad,
        navigationOptions: {
            tabBarLabel: 'My Content',
            // tabBarIcon: () => <Icon name="list" size={35} style={{color:'#fff'}}/>,
        }
    },
    StudyHelp:{
        screen:StudyHelp,
        navigationOptions: {
            tabBarLabel: 'StudyHelp',
         
        }
    },
    Audio:{
        screen:Audio,
        navigationOptions: {
            tabBarLabel: 'Audio',
          
        }
    },
    Video:{
        screen:Video,
        navigationOptions: {
            tabBarLabel: 'Video',
           
        }
    }
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
      
    }
	
)
const BottomTabNav = StackNavigator({
    BottomTab:{
        screen:BottomTab
    },
    Footnotes: {
		screen: Foonotes
	},
	Summary:{
		screen:Summary
    },
    Commentary:{
        screen:Commentary
    },
    Dictionary:{
        screen:Dictionary
    },
    HighLights: {
		screen: HighLights,
	},
	Bookmarks:{
		screen:Bookmarks
    },
    Note:{
        screen:Note
	},
	History:{
		screen:History
    }
},
{
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#3F51B5',
            height:32
        },
        headerTitleStyle: {
            color: 'white',
            fontWeight: 'normal',
            
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',
}
}
)

export default BottomTabNav