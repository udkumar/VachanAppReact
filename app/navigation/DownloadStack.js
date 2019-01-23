import { StackNavigator } from "react-navigation";
import DownloadVersion from '../screens/Downloads/DownloadVersion'
import DownloadLanguage from '../screens/Downloads/DownloadLanguage'

const  DownloadStack= StackNavigator({
	DownloadLanguage: {
        screen: DownloadLanguage,
    },
    DownloadVersion:{
        screen:DownloadVersion
    }
    
})

export default DownloadStack;