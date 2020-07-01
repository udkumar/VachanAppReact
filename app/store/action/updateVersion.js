import { UPDATE_VERSION ,UPDATE_CONTENT_TYPE,UPDATE_VERSION_BOOK,UPDATE_MATA_DATA} from "./actionsType";

export const updateVersion = (payload)=>{
    return {
        type:UPDATE_VERSION,
        payload
    }
}
export const updateVersionBook = (payload)=>{
    return{
        type:UPDATE_VERSION_BOOK,
        payload
    }
}

export const updateContentType = (payload)=>{
    return{
        type: UPDATE_CONTENT_TYPE,
        payload
    }
}
export const updatematadata = (payload)=>{
    return{
        type: UPDATE_MATA_DATA,
        payload
    }
}



// export const availableContent =() =>{
//    return{
//     type: AVAILABLE_CONTENT,
//     contentType:contentType
//    } 
// }