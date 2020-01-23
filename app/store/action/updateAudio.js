import { UPDATE_AUDIO,INDIVIDUAL_AUDIO , AUDIO_FOR_BOOKS} from "./actionsType";

export const updateAudio = (visible)=>{
    return {
        type:UPDATE_AUDIO,
        visible:visible
    }
}

export const individualAudio = (language,languageCode,version,bookId,chapterNumber)=>{
    return {
        type:INDIVIDUAL_AUDIO,
        language:language,
        languageCode:languageCode,
        version:version,
        bookId:bookId,
        chapterNumber:chapterNumber,
    }
}

export const audioForBooks = (books)=>{
    return {
        type:AUDIO_FOR_BOOKS,
        books:books,
    }
}
