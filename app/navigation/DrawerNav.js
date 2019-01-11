import { createDrawerNavigator } from "react-navigation";

import BookStackNav from './BookStack/BookStackNav'
import SettingStack from './SettingStack'
import NoteStack from './NoteStack'

import HighLights from '../screens/Highlights/Highlights'
import Bookmarks from '../screens/Bookmarks/Bookmarks'
import Search from '../screens/Search/Search'
import History from '../screens/History/History'


const DrawerNav = createDrawerNavigator({
	  BookStack: {
		screen: BookStackNav,
    },
    NoteStack: {
		screen: NoteStack,
    },
    SettingStack: {
      screen: SettingStack,
    },
    HighLights: {
		screen: HighLights,
    },
    Bookmarks: {
		screen: Bookmarks,
    },
    Search: {
		screen: Search,
    },
    History: {
		screen: History,
    },
    
})

export default DrawerNav;