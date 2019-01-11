
import { createStackNavigator } from "react-navigation";

import HighLights from '../../screens/Highlights/Highlights'
import Notes from '../../screens/Note/Notes'
import Bookmarks from '../../screens/Bookmarks/Bookmarks'

const NotePadStack = createStackNavigator({
	HighLights: {
		screen: HighLights,
	},
	Bookmarks:{
		screen:Bookmarks
    },
    Notes:{
        screen:Notes
    }
})

export default NotePadStack;