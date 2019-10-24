import {EDIT_NOTE} from './actionsType.js'
import {DELETE_NOTE} from './actionsType.js'

export const updateBCV = (id,bookName,chapNum,verseNum)=>{
    return {
        type:EDIT_NOTE,
        bookId:id,
        bookName:bookName,
        chapterNumber:chapNum,
        verseNumber:verseNum
    }
}
export  const deleteNote = (time,index)=>{
    return{
        type:DELETE_NOTE,
        time:time,
        index:index
    }
}

