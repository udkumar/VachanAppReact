
import { createStackNavigator } from "react-navigation";
import DownloadStack from './DownloadStack'
import Hints from '../screens/Hints/Hints'
import About from '../screens/About/About'

const SettingStack = createStackNavigator({
	DownloadStack: {
        screen: DownloadStack,
    },
    Hints:{
        screen:Hints
    },
    About:{
        screen:About
    }
    
})

export default SettingStack;