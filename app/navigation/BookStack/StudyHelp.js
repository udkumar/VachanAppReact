import { StackNavigator } from "react-navigation";

import Foonotes from'../../screens/Footnotes'
import Summary from'../../screens/Summary'
import Commentry from'../../screens/Commentry'
import Dictionary from'../../screens/Dictionary'

const StudyHelp = StackNavigator({
	Footnotes: {
		screen: Foonotes,
	},
	Summary:{
		screen:Summary
    },
    Commentry:{
        screen:Commentry
    },
    Dictionary:{
        screen:Dictionary
    }
})

export default StudyHelp;