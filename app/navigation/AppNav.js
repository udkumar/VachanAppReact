
import { createStackNavigator } from "react-navigation";
import DrawerNav from './DrawerNav'

const AppDrawerNav = createStackNavigator({
	DrawerNav: {
		screen: DrawerNav,
    }
    
})

export default AppDrawerNav;