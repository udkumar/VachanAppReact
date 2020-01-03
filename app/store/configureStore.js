import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import editNoteReducer from "./reducer/editNoteReducer";
import UpdateVersionReducer from './reducer/updateVersionReducer';
import updateStylingReducer from './reducer/updateStylingReducer';
import splitScreenReducer from './reducer/splitScreenReducer';
import updateAudioReducer from './reducer/updateAudioReducer'



//use only when having mutiple reducer for single reducer direct import it to index.js of app

const rootReducer = combineReducers({
    editNote: editNoteReducer,
    updateVersion:UpdateVersionReducer,
    updateStyling:updateStylingReducer,
    updateSplitScreen:splitScreenReducer,
    updateAudio:updateAudioReducer
});

export default function configureStore(){
    return createStore(rootReducer,applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    // loggerMiddleware // neat middleware that logs actions
  ))
}

