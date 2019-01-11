import { createStackNavigator } from "react-navigation";
import Note from '../screens/Note/Notes'
import EditNote from '../screens/Note/EditNote/'

const NoteStack = createStackNavigator({
	Note: {
        screen: Note,
    },
    EditNote:{
        screen:EditNote
    }
    
})

export default NoteStack;