import { UPDATE_INFOGRAPHICS,INDIVIDUAL_AUDIO , AUDIO_FOR_BOOKS} from '../action/actionsType';
const BASE_URL='https://raw.githubusercontent.com/neetuy/BibleContent/master/jpg_files/'

const initialState = {
    fileName:'https://raw.githubusercontent.com/neetuy/BibleContent/master/jpg_files/HIN/12%20Tribes_Map.jpg'
}
function updateInfographicsReducer(state=initialState,action){
    switch(action.type) {
        case UPDATE_INFOGRAPHICS:
        return {
            ...state,
        fileName:BASE_URL+"HIN"+"/"+encodeURIComponent(action.fileName)+".jpg"
        }
        default: 
        return state
    }
}

export default updateInfographicsReducer