import { createStackNavigator } from "react-navigation";

const StudyResourcesStack = createStackNavigator({
	NotesText: {
		screen: NotesText,
	},
	Summary:{
		screen:Summary
    },
    Commentry:{
        screen:Summary
    },
    Dictionary:{
        screen:Dictionary
    }
	
    
})

export default StudyResourcesStack;