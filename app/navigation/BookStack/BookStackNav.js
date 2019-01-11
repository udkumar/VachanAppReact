
import { createStackNavigator } from "react-navigation";

import BottomTabNav from './BottomTabNav'
import DownloadStack from '../DownloadStack'

import Bookmarks from '../../screens/Bookmarks/Bookmarks'
import SelectBook from '../../screens/SelectBook/SelectBook'


const BookStackNav = createStackNavigator({
	SelectBook: {
		screen: SelectBook,
    },
    Bookmarks:{
        screen:Bookmarks
    },
    BottomTabNav:{
        screen:BottomTabNav
    },
    DownloadStack:{
        screen:DownloadStack
    }
})

export default BookStackNav;