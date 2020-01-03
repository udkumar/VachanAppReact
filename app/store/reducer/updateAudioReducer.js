import { UPDATE_AUDIO  } from '../action/actionsType';

const initialState = {
  visible:false
}
function updateAudioReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_AUDIO:
        return {
            ...state,
        visible:action.visible
        }
        default: 
        return state
    }
}

export default updateAudioReducer