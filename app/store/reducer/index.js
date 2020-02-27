
import {createStore,combineReducers,applyMiddleware,compose} from 'redux'

import editNoteReducer from "./editNoteReducer";
import UpdateVersionReducer from './updateVersionReducer';
import updateStylingReducer from './updateStylingReducer';
import splitScreenReducer from './splitScreenReducer';
import updateInfographicsReducer from './updateInfographicsReducer'
import fetchVersionReducer from './apiFetchReducer/fetchVersionReducer'
import fetchCommentaryReducer from './apiFetchReducer/fetchCommentaryReducer'
import fetchAudioReducer from './apiFetchReducer/fetchAudioReducer'
import  fetchContentReducer from './apiFetchReducer/fetchContentReducer'
import parallelBibleReducer from './apiFetchReducer/parallelBibleReducer'
import downloadedContent from './apiFetchReducer/downloadedContentReducer'

 const rootReducer = combineReducers({
    editNote: editNoteReducer,
    updateVersion:UpdateVersionReducer,
    updateStyling:updateStylingReducer,
    updateSplitScreen:splitScreenReducer,
    infographics:updateInfographicsReducer,
    versionFetch:fetchVersionReducer,
    commentaryFetch:fetchCommentaryReducer,
    audioFetch:fetchAudioReducer,
    contents:fetchContentReducer,
    parallel:parallelBibleReducer,
    downloadedBible:downloadedContent
});
export default  rootReducer