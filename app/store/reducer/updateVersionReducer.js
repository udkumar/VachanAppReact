import { UPDATE_VERSION, SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE, UPDATE_NOTE_BODY  } from '../action/actionsType';

const initialState = {
   language:'Hindi',
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
        
       
        default: 
        return state
    }
}

export default UpdateVersionReducer