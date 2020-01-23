import { UPDATE_AUDIO,INDIVIDUAL_AUDIO , AUDIO_FOR_BOOKS} from '../action/actionsType';

const initialState = {
  visible:false
}
function updateAudioReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_AUDIO:
        return {
            ...state,
        visible:action.visible
        }
        case INDIVIDUAL_AUDIO:
        return {
            ...state,
            language:action.language,
            languageCode:action.languageCode,
            version:action.version,
            bookId:action.bookId,
            chapterNumber:action.chapterNumber,
        }
        case AUDIO_FOR_BOOKS:
        return {
            ...state,
        books:action.books
        }
        default: 
        return state
    }
}

export default updateAudioReducer