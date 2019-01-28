import { StackNavigator ,TabNavigator} from "react-navigation";
import StudyHelp from '../../StudyHelp'
import NotePad from '../../NotePad'
import Audio from '../../Audio'
import Video from '../../Video'
import Foonotes from'../../Footnotes'
import Summary from'../../Summary'
import Commentry from'../../Commentry'
import Dictionary from'../../Dictionary'
import HighLights from '../../Highlights/Highlights'
import Notes from '../../Note/Notes'
import Bookmarks from '../../Bookmarks/Bookmarks'
import History from '../../History/History'
import Icon from 'react-native-vector-icons/MaterialIcons'



const BottomTab = TabNavigator(
	{
    NotePad:{
        screen:NotePad,
        navigationOptions: {
            tabBarLabel: 'NotePad',
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
        tabBarOptions: {
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
    Commentry:{
        screen:Commentry
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
    Notes:{
        screen:Notes
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