import {createStore,combineReducers,applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import editNoteReducer from "./reducer/editNoteReducer";
import UpdateVersionReducer from './reducer/updateVersionReducer';
import updateStylingReducer from './reducer/updateStylingReducer';
import splitScreenReducer from './reducer/splitScreenReducer';
import updateAudioReducer from './reducer/updateAudioReducer';
import APIReducer from './reducer/fetchAPI';



//use only when having mutiple reducer for single reducer direct import it to index.js of app

const rootReducer = combineReducers({
    editNote: editNoteReducer,
    updateVersion:UpdateVersionReducer,
    updateStyling:updateStylingReducer,
    updateSplitScreen:splitScreenReducer,
    updateAudio:updateAudioReducer,
    APIFetch:APIReducer
});

export default function configureStore(){
    return createStore(rootReducer,applyMiddleware(thunkMiddleware))
}

