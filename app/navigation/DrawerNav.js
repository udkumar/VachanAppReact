import { DrawerNavigator } from "react-navigation";

import BookStackNav from './BookStack/BookStackNav'

import DrawerScreen from '../screens/DrawerScreen/DrawerScreen'

const DrawerNav = DrawerNavigator(
  {
    Home: {
      screen:BookStackNav
    }
  }, {
    contentComponent: DrawerScreen,
    drawerWidth: 300
  }
	
)

export default DrawerNav;