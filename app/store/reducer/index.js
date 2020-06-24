
import {createStore,combineReducers,applyMiddleware,compose} from 'redux'
import { persistStore, persistReducer } from 'redux-persist';

import updateVersionReducer from './updateVersionReducer';
import updateStylingReducer from './updateStylingReducer';
import fetchVersionReducer from './apiFetchReducer/fetchVersionReducer'
import fetchCommentaryReducer from './apiFetchReducer/fetchCommentaryReducer'
import fetchDictionaryReducer from './apiFetchReducer/fetchDictionaryReducer'
import fetchAudioReducer from './apiFetchReducer/fetchAudioReducer'
import fetchContentReducer from './apiFetchReducer/fetchContentReducer'
import downloadedContent from './apiFetchReducer/downloadedContentReducer'
import userInfo from './UserInfoReducer'

const rootReducer = combineReducers({
    updateVersion:updateVersionReducer,
    updateStyling:updateStylingReducer,
    versionFetch:fetchVersionReducer,
    commentaryFetch:fetchCommentaryReducer,
    dictionaryFetch:fetchDictionaryReducer,
    audioFetch:fetchAudioReducer,
    contents:fetchContentReducer,
    downloadedBible:downloadedContent,
    userInfo:userInfo
})

export default  rootReducer