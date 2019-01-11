
import { createBottomTabNavigator } from "react-navigation";

import StudyResourcesStack from './StudyResourcesStack'
import NotePadNav from './NotePadStack'

const BottomTabNav = createBottomTabNavigator({
	NotePadStack: {
		screen: NotePadNav,
	},
	StudyResourcesStack:{
		screen:StudyResourcesStack
	},
	Audio:{
		screen:Audio
	},
	Video:{
		screen:Video	
	},
	Image:{
		screen:Image
	}
    
}
)

export default BottomTabNav;