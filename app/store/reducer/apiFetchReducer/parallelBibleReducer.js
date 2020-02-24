import {FETCH_PARALLEL_BIBLE,PARALLEL_BIBLE_SUCCESS,PARALLEL_BIBLE_FAILURE,PARALLEL_SELECTED_BOOK,PARALLEL_SELECTED_CHAPTER,PARALLEL_SELECTED_VERSE} from '../../action/actionsType'

const initialState = {
    parallelBible:[],
    error:null,
    loading:false,
    bookId:'3jn',
    bookName:'3 यूहन्ना',
    chapterNumber:1,
    totalChapters:1,
    verseNumber: 1,
    totalVerses:15,

}
function parallelBibleReducer(state=initialState,action){
    switch(action.type) {
        case FETCH_PARALLEL_BIBLE:
        return{
            ...state,
            loading:true,
        }
        case PARALLEL_BIBLE_SUCCESS:
        return {
            ...state,
            loading:false,
            parallelBible:action.payload.parallelBible,
            
        }
        case PARALLEL_BIBLE_FAILURE:
        return {
            ...state,
            loading:false,
            error:action.error
        }
        case PARALLEL_SELECTED_BOOK:
        return {
            ...state,
            bookId:action.bookId,
            bookName:action.bookName,
            totalChapters:action.totalChapters,
        }
        case PARALLEL_SELECTED_CHAPTER:
        return {
            ...state,
            chapterNumber:action.chapterNumber,
            totalVerses:action.totalVerses,
        }
        case PARALLEL_SELECTED_VERSE:
        return {
            ...state,
            verseNumber:action.verseNumber,
        }
        default: 
        return state
    }
}

export default parallelBibleReducer