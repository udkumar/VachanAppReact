import {REFERENCE_UPDATE,CHANGE_BOOK} from './actionsType.js'

export const referenceUpdate = (id,chapterNumber,totalChapters,verseNumber,totalVerses)=>{
    return {
        type:EDIT_NOTE,
        bookId:id,
        chapterNumber:chapterNumber,
        totalChapters:totalChapters,
        totalVerses:totalVerses,
        verseNumber:verseNumber

    }
}

export const changeBook = (language,version,bookId)=>{
    return {
        type:CHANGE_BOOK,
        language:language,
        version:version,
        bookId:bookId
    }
}



