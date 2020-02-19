import { UPDATE_VERSION, SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE, UPDATE_CONTENT_TYPE  } from '../action/actionsType';

const initialState = {
   language:'Hindi',
   languageCode:'hin',
   version:'Indian Revised Bible',
   versionCode:'IRV',
   sourceId:45,
   downloaded:false,
   bookId:'3jn',
   bookName:'3 यूहन्ना',
   chapterNumber:1,
   totalChapters:1,
   verseNumber: 1,
   totalVerses:15,
   verseText:'',
   contentType:'bible',
   contentLanguage:'Hindi',
   contentLanguageCode:'hin',
   contentVersion:'Indian Revised Version',
   contentVersionCode:'IRV'
}
function UpdateVersionReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_VERSION:
        return {
            ...state,
        language:action.payload.language,
        languageCode:action.payload.languageCode,
        versionCode:action.payload.versionCode,
        sourceId:action.payload.sourceId,
        downloaded:action.payload.downloaded
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
            contentType:action.payload.contentType,
            contentLanguage:action.payload.contentLanguage,
            contentLanguageCode:action.payload.contentLanguageCode,
            contentVersion:action.payload.contentVersion,
            contentVersionCode:action.payload.contentVersionCode,
            contentSourceId:action.payload.contentSourceId
        }
        default: 
        return state
    }
}

export default UpdateVersionReducer