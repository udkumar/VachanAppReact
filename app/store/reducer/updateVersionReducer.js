import { UPDATE_VERSION, SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE, UPDATE_CONTENT_TYPE  } from '../action/actionsType';

const initialState = {
   language:'Hindi',
   languageCode:'hin',
   version:'IRV',
   sourceId:'45',
   downloaded:false,
   bookId:'3jn',
   bookName:'3 यूहन्ना',
   chapterNumber:1,
   totalChapters:1,
   verseNumber: 1,
   totalVerses:15,
   verseText:'',
   contentType:'bible'
}
function UpdateVersionReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_VERSION:
        return {
            ...state,
        language:action.language,
        languageCode:action.languageCode,
        version:action.version,
        sourceId:action.sourceId,
        downloaded:action.downloaded
        }
        case SELECTED_BOOK:
        return {
            ...state,
            bookId:action.bookId,
            bookName:action.bookName,
            totalChapters:action.totalChapters,
        }
        case SELECTED_CHAPTER:
        return {
            ...state,
            chapterNumber:action.chapterNumber,
            totalVerses:action.totalVerses,
        }
        case SELECTED_VERSE:
        return {
            ...state,
            verseNumber:action.verseNumber,
        }
        case UPDATE_CONTENT_TYPE:
        return {
            ...state,
            contentType:action.contentType,
        }
        default: 
        return state
    }
}

export default UpdateVersionReducer