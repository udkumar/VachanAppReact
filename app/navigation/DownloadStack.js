import { createStackNavigator } from "react-navigation";
import DownloadVersion from '../screens/Downloads/DownloadVersion'
import DownloadLanguage from '../screens/Downloads/DownloadLanguage'

const  DownloadStack= createStackNavigator({
	DownloadLanguage: {
        screen: DownloadLanguage,
    },
    DownloadVersion:{
        screen:DownloadVersion
    }
    
})

export default DownloadStack;