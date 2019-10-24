import { EDIT_NOTE, DELETE_NOTE } from '../action/actionsType';

const initialState = {
    
    bookId: '1jn',
    chapterNumber:1,
    verseNumber: 1,
    index:-1,
    bookName:'1 john'
    
}
function editNoteReducer(state=initialState,action){
    switch(action.type) {
        case EDIT_NOTE:
        return {
            ...state,
            bookId:action.bookId,
            bookName:action.bookName,
            chapterNumber:action.chapterNumber,
            verseNumber:action.verseNumber
        }
        case DELETE_NOTE:
        return{
            ...state,
            mobile:action.mobile,
            refferalStatus:action.refferalStatus,
            iconColor:action.iconColor,
            numberStatus:action.numberStatus,
        }
        
        default: 
        return state
    }
}

export default editNoteReducer