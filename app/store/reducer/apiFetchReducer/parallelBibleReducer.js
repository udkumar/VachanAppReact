import {FETCH_PARALLEL_BIBLE,PARALLEL_BIBLE_SUCCESS,PARALLEL_BIBLE_FAILURE,
    PARALLEL_BIBLE_BOOKS_SUCCESS,PARALLEL_BIBLE__BOOKS_FAILURE,FETCH_PARALLEL_VERSION_BOOKS} from '../../action/actionsType'

const initialState = {
    parallelBible:[],
    parallelBooks:[],
    error:null,
    loading:false,
}
function parallelBibleReducer(state=initialState,action){
    switch(action.type) {
        case FETCH_PARALLEL_BIBLE:
        return{
            ...state,
            loading:true,
        }
        case PARALLEL_BIBLE_SUCCESS:
        return {
            ...state,
            loading:false,
            parallelBible:action.payload.parallelBible,
            
        }
        case PARALLEL_BIBLE_FAILURE:
        return {
            ...state,
            loading:false,
            error:action.error
        }
        case FETCH_PARALLEL_VERSION_BOOKS:
        return{
            ...state,
            loading:true,
        }
        case PARALLEL_BIBLE_BOOKS_SUCCESS:
        return {
            ...state,
            loading:false,
            parallelBooks:action.payload.parallelBooks,
            
        }
        case PARALLEL_BIBLE__BOOKS_FAILURE:
        return {
            ...state,
            loading:false,
            error:action.error
        }

        default: 
        return state
    }
}

export default parallelBibleReducer