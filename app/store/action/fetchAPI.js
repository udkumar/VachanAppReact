import { FETCH_TODOS_SUCCESS, FETCH_TODOS_FAILURE, FETCHING_TODOS } from './actionsType';
import ApiUtils from '../../utils/ApiUtils'


     
export function fetchAPI(api,type) {
    var content_type =  type === 'mp3' ? 'audio/mpeg' : 'text/plain'
    return (dispatch) => {
    dispatch(getToDos());
    return fetch(api,
            {   
                method:'GET',
                headers:{
                'Accept': content_type,
                'Content-Type':  content_type 
            }
        })
        .then( (res)=>checkStatus(res,type))
        .then((response) =>{dispatch(getToDosSuccess(response))})
        .catch(e => dispatch(getToDosFailure(e)))
    }
  }

function checkStatus(response,type) {
    console.log("checkStatus ",response)
      if (response.ok && response.status == 200) {
        // return| type == 'mp3' ? reponse.arrayBuffer() : response.json().then(data => data)
        return response
      } else {
        let error = new Error(response.statusText);
        error.response = response;
        console.log("error api util ",ApiUtils)
        throw error;
      }
    }

function getToDos() {
    return {
        type: FETCHING_TODOS
    }
}

function getToDosSuccess(data) {
    return {
        type: FETCH_TODOS_SUCCESS,
        data:data
    }
}

function getToDosFailure(error) {
    console.log("response error ",error)
    return {
        type: FETCH_TODOS_FAILURE
    }
}