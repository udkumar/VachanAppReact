import { UPDATE_COMMENTARY_ID,  } from '../action/actionsType';

const initialState = {
    commentarySourceId:67
}
function updateCommentaryReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_COMMENTARY_ID:
        return {
            ...state,
            commentarySourceId:action.commentarySourceId
        }
        
        default: 
        return state
    }
}

export default updateCommentaryReducer