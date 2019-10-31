import { UPDATE_VERSION, UPDATE_BOOK  } from '../action/actionsType';

const initialState = {
   language:'Hindi',
   version:'IRV',
   sourceId:'35',
   downloaded:false
}
function UpdateVersionReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_VERSION:
        return {
            ...state,
        language:action.language,
        version:action.version,
        sourceId:action.sourceId,
        downloaded:action.downloaded
        }
        case UPDATE_BOOK:
        return {
            ...state,
            bookId:action.bookId,
            bookName:action.bookName,
            chapterNumber:action.chapterNumber,
            verseNumber:action.verseNumber,
            verseText:action.verseText
        }
        default: 
        return state
    }
}

export default UpdateVersionReducer