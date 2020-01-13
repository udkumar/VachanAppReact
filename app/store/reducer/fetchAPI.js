import { FETCH_TODOS_SUCCESS, FETCH_TODOS_FAILURE, FETCHING_TODOS } from '../action/actionsType';

const initialState = {
    data: [],
    isFetching: false,
    error: false
}
function APIReducer(state = initialState, action) {

    switch(action.type) {
        case FETCHING_TODOS:
            return {
                ...state,
                isFetching: true
            }
        case FETCH_TODOS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                data: action.data
            }
        case FETCH_TODOS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true
            }
        default:
            return state
    }
}

export default APIReducer