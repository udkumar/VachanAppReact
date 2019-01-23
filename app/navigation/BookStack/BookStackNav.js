
import { StackNavigator } from "react-navigation";

import BottomTabNav from './BottomTabNav'
import DownloadStack from '../DownloadStack'

import Bookmarks from '../../screens/Bookmarks/Bookmarks'
import SelectBook from '../../screens/SelectBook/SelectBook'

import Search from '../../screens/Search/Search'
import History from '../../screens/History/History'
import Bible from '../../screens/Bible/Bible'
import Setting from "../../screens/settings/Settings";
import Video from "../../screens/Video"
import GoogleMaps from '../../screens/GoogleMaps'
import Images from '../../screens/Images'
import About from '../../screens/About/About'

const BookStackNav = StackNavigator({
    BottomTabNav:{
        screen:BottomTabNav
    },
	SelectBook: {
		screen:SelectBook,
    },
    Bookmarks:{
        screen:Bookmarks
    },
    DownloadStack:{
        screen:DownloadStack
    },
    // LastRead: {
	// 	screen: LastRead,
    // },
    Bible:{
      screen:Bible
    },
    History:{
        screen:History
    },
    Video: {
		screen: Video,
    },
    GoogleMaps: {
      screen: GoogleMaps,
    },
    Images: {
		screen: Images,
    },
    Search: {
		screen: Search,
    },
    Setting:{
        screen:Setting,
    },
    About: {
		screen: About,
    }
})

export default BookStackNav;