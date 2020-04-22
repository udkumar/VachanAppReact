import { USER_INFO  } from '../action/actionsType';

const initialState = {
   email:null,
   uid:null,
   userName:'',
   
}

function UserInfoReducer(state=initialState,action){
    switch(action.type) {
        case USER_INFO:
        return {
            ...state,
            email:action.payload.email,
            uid:action.payload.uid,
            userName:action.payload.userName,
            phoneNumber:action.payload.phoneNumber
        }
    
        default: 
        return state
    }
}

export default UserInfoReducer