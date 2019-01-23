
import { StackNavigator } from "react-navigation";

import HighLights from '../../screens/Highlights/Highlights'
import Notes from '../../screens/Note/Notes'
import Bookmarks from '../../screens/Bookmarks/Bookmarks'
import History from '../../screens/History/History'

const NotePadStack = StackNavigator({
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
})

export default NotePadStack;