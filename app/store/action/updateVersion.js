import { UPDATE_VERSION , SELECTED_BOOK,SELECTED_CHAPTER,SELECTED_VERSE,UPDATE_CONTENT_TYPE} from "./actionsType";

export const updateVersion = (language,languageCode,version,sourceId,downloaded)=>{
    return {
        type:UPDATE_VERSION,
        language:language,
        languageCode:languageCode,
        version:version,
        sourceId:sourceId,
        downloaded:downloaded
    }
}

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
export const updateContentType = (contentType)=>{
    return{
        type: UPDATE_CONTENT_TYPE,
        contentType:contentType
    }
}
