import {createStore,combineReducers,applyMiddleware} from 'redux'
import editNoteReducer from "./reducer/editNoteReducer";
import thunkMiddleware from 'redux-thunk'

//use only when having mutiple reducer for single reducer direct import it to index.js of app

const rootReducer = combineReducers({
    editNote: editNoteReducer,
});

export default function configureStore(){
    return createStore(rootReducer,applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    // loggerMiddleware // neat middleware that logs actions
  ))
}

