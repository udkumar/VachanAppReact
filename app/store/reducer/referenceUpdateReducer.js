import { REFERENCE_UPDATE, CHANGE_BOOK  } from '../action/actionsType';

const initialState = {
    bookId: '1jn',
    chapterNumber:1,
    verseNumber: 1,
    bookName:'1 john'
    
}
function referenceUpdateReducer(state=initialState,action){
    switch(action.type) {
        case REFERENCE_UPDATE:
        return {
            ...state,
            bookId:id,
            chapterNumber:action.chapterNumber,
            totalChapters:action.totalChapters,
            totalVerses:action.totalVerses,
            verseNumber:action.verseNumber
        }
        case CHANGE_BOOK:
        return{
            ...state,
            language:action.language,
            version:action.version,
            bookId:action.bookId
        }
        default: 
        return state
    }
}

export default referenceUpdateReducer