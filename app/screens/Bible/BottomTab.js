
import { TabNavigator } from "react-navigation";

import StudyHelp from '../../navigation/BookStack/StudyHelp'
import NotePadStack from '../../navigation/BookStack/NotePadStack'
import Audio from '../Audio'
import Video from '../Video'

const BottomTabNav = TabNavigator(
	{
    Audio:{
      screen:Audio
    },
    Video:{
      screen:Video
    },
    StudyHelp:{
      screen:StudyHelp
    },
    NotePadStack:{
      screen:NotePadStack
    }
	},
	{
		backBehavior: "none",
		tabBarPosition: "bottom"
	}
)
export default BottomTabNav
