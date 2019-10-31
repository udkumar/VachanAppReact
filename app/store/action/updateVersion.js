import { UPDATE_VERSION , UPDATE_BOOK} from "./actionsType";


// export const changeBook = (language,version,bookId,sourceId)=>{
//     return {
//         type:CHANGE_BOOK,
//         language:language,
//         version:version,
//         bookId:bookId,
//         sourceId:sourceId
//     }
// }

export const updateVersion = (language,version,sourceId,downloaded)=>{
    return {
        type:UPDATE_VERSION,
        language:language,
        version:version,
        sourceId:sourceId,
        downloaded:downloaded
    }
}

export const updateBook = (bookId,bookName,chapterNumber,verseNumber,verseText)=>{
    return {
        type:UPDATE_BOOK,
        bookId:bookId,
        bookName:bookName,
        chapterNumber:chapterNumber,
        verseNumber:verseNumber,
        verseText:verseText
    }
}

