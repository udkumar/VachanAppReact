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
            // tabBarIcon: ({ tintColor }) => (
            //     <Icon name="edit"/>
            // )
        }
    },
    StudyHelp:{
        screen:StudyHelp,
        navigationOptions: {
            tabBarLabel: 'StudyHelp',
            // tabBarIcon: ({ tintColor }) => (
            //     <Icon name="edit"/>
            // )
        }
    },
    Audio:{
        screen:Audio,
        navigationOptions: {
            tabBarLabel: 'Audio',
            // tabBarIcon: ({ tintColor }) => (
            //     <Icon name="edit"/>
            // )
        }
    },
    Video:{
        screen:Video,
        navigationOptions: {
            tabBarLabel: 'Video',
            // tabBarIcon: ({ tintColor }) => (
            //     <Icon name="edit"/>
            // ) 
        }
    }
    },
    {   
        tabBarPosition: 'bottom',
        tabBarOptions: {
            upperCaseLabel: false,
        },
          style: {
            backgroundColor: '#fff',
          }
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
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerBackTitleStyle: {
            color: 'white',
        },
        headerTintColor: 'white',

}
}
)

export default BottomTabNav