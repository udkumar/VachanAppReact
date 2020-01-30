import {UPDATE_COMMENTARY_ID} from "./actionsType";

export const updateCommentary = (sourceId)=>{
    return {
        type:UPDATE_COMMENTARY_ID,
        commentarySourceId:sourceId,
    }
}

