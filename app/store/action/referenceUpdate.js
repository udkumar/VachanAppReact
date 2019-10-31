import {SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE} from './actionsType.js'

export const selectedBook = (bookId,bookName,totalChapters)=>{
    return {
        type:SELECTED_BOOK,
        bookId:bookId,
        bookName:bookName,
        totalChapters:totalChapters,
    }
}
export const selectedChapter = (chapterNumber,totalVerses)=>{
    return {
        type:SELECTED_CHAPTER,
        chapterNumber:chapterNumber,
        totalVerses:totalVerses,
    }
}

export const selectedVerse = (verseNumber)=>{
    return {
        type:SELECTED_VERSE,
        verseNumber:verseNumber,
    }
}





