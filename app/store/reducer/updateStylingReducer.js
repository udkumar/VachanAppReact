
import {UPDATE_COLOR_MODE,UPDATE_FONT_SIZE,UPDATE_VERSE_IN_LINE,UPDATE_FONT_FAMILY} from '../action/actionsType'

import {nightColors, dayColors} from '../../utils/colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from '../../utils/dimens.js'
import {AsyncStorageConstants} from '../../utils/AsyncStorageConstants.js'




const initialState = {
    colorMode:AsyncStorageConstants.Values.dayColors,
    colorFile :dayColors,
    sizeMode:AsyncStorageConstants.Values.SizeModeNormal,
    sizeFile:mediumFont,
    verseInLine:AsyncStorageConstants.Values.verseInLine,
    fontFamily:AsyncStorageConstants.Values.FontFamily["hindi"]
  
}
function updateStyling(state=initialState,action){
    switch(action.type) {
        case UPDATE_FONT_SIZE:
            const sizes = { 
            sizeMode:()=>{
                switch(action.colorMode){
                case AsyncStorageConstants.Values.SizeModeXSmall:
                return {
                    sizeMode:AsyncStorageConstants.Values.SizeModeXSmall,
                    sizeFile:extraSmallFont
                }
                case AsyncStorageConstants.Values.SizeModeSmall:
                return{
                    sizeMode:AsyncStorageConstants.Values.SizeModeSmall,
                    sizeFile:smallFont
                   
                }
                case AsyncStorageConstants.Values.SizeModeNormal:
                return{
                    sizeMode:AsyncStorageConstants.Values.SizeModeNormal,
                    sizeFile:mediumFont
                    
                }
                case AsyncStorageConstants.Values.SizeModeLarge:
                return {
                    sizeMode:AsyncStorageConstants.Values.SizeModeLarge,
                    sizeFile:largeFont
                  
                }
                case AsyncStorageConstants.Values.SizeModeXLarge:
                return{
                    sizeMode:AsyncStorageConstants.Values.SizeModeXLarge,
                    sizeFile:extraLargeFont
                   
                }
                default: 
                return {
                  mediumFont
                }
                
            }
        }

        }
        return{
            ...state,
            fontValue:sizes.sizeMode()
        }
        
        case UPDATE_COLOR_MODE:
        const colors = {
            switchColor:()=>{ switch(action.sizeMode){
                case AsyncStorageConstants.Values.DayMode:
                return {
                    colorMode:AsyncStorageConstants.Values.DayMode,
                    colorFile:dayColors,
                  
                }
                case AsyncStorageConstants.Values.NightMode:
                return{
                    colorMode:AsyncStorageConstants.Values.NightMode,
                    colorFile:nightColors,
                }  
                default:
                return{
                    colorMode:AsyncStorageConstants.Values.DayMode,
                    colorFile:dayColors,
                }  
                

            }
        }
        }
        return {
            ...state,
            colorValue:colors.switchColor()
        }
       
        case UPDATE_VERSE_IN_LINE:
        const switchVerseInLine = {
            switchVerse : ()=>{
                switch(action.verseInLine){
                    case 0:
                    return {
                        verseInLine:true
                    }
                    case 1:
                    return{
                        verseInLine:false
                    }

            }
        }
        }
        return {
            ...state,
        verseInLine:switchVerseInLine.switchVerse(),
        }

        case UPDATE_FONT_FAMILY:
            console.log("font family reducer ",action.fontFamily)
        return{
            ...state,
            fontFamily:AsyncStorageConstants.Values.FontFamily[action.fontFamily]

        }
        
        default: 
        return state
    
    }
    
}

export default updateStyling