import {UPDATE_COLOR_MODE,UPDATE_FONT_SIZE,UPDATE_COLOR,UPDATE_VERSE_IN_LINE} from './actionsType.js'

export const updateColorMode= (colorMode,colorFile)=>{
    return {
        type:UPDATE_COLOR_MODE,
        colorMode:colorMode,
        colorFile :colorFile,


    }
}
export const updateFontSize = (sizeMode,sizeFile)=>{
    return {
        type:UPDATE_FONT_SIZE,
        sizeMode:sizeMode,
        sizeFile:sizeFile,
    }
}

export const updateVerseInLine = (inline)=>{
    return {
        type:UPDATE_VERSE_IN_LINE,
        verseInLine:inline
    }
}

