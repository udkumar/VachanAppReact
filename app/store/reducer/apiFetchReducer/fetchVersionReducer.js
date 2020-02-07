import {FETCH_VERSION_LANGUAGE,FETCH_VERSION_BOOKS,FETCH_VERSION_CONTENT,VERSION_LANGUAGE_SUCCESS,VERSION_BOOKS_SUCCESS,VERSION_CONTENT_SUCCESS,VERSION_LANGUAGE_FAILURE,VERSION_BOOKS_FAILURE,VERSION_CONTENT_FAILURE } from '../../action/actionsType'

const initialState = {
    data:[],
    chapterContent:[],
    totalVerses:null,
    error:null,
    loading:false
}
function fetchVersionReducer(state=initialState,action){
    switch(action.type) {
        case FETCH_VERSION_LANGUAGE:
        return{
            ...state,
            loading:true,
        }
        case VERSION_LANGUAGE_SUCCESS:
        return {
            ...state,
            loading:false,
            data:action.payload
        }
        case VERSION_LANGUAGE_FAILURE:
        return {
            ...state,
            loading:false,
            error:action.error
        }
        case FETCH_VERSION_BOOKS:
        return{
            ...state,
            loading:true,
        }
        case VERSION_BOOKS_SUCCESS:
        return {
            ...state,
            loading:false,
            data:action.payload
        }
        case VERSION_BOOKS_FAILURE:
        return {
            ...state,
            loading:false,
            error:action.error
        }
        case FETCH_VERSION_CONTENT:
        return{
            ...state,
            loading:true,
        }
        case VERSION_CONTENT_SUCCESS:
        return {
            ...state,
            loading:false,
            chapterContent:action.chapterContent,
            totalVerses:action.totalVerses,
        }
        case VERSION_CONTENT_FAILURE:
        return {
            ...state,
            loading:false,
            error:action.error
        }
        default: 
        return state
    }
}

export default fetchVersionReducer