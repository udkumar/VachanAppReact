import {NetInfo} from "react-native"

    var connectionInfo = {
    // connectionCheck: (id,callback)=>{return connectionInfo.isConnection(id,callback)},
    isConnection: async ()=>{ 
        try{
            return await NetInfo.isConnected.fetch()
            .then(isConnected => {
                if(isConnected){
                    return true
                }
                else {
                    return false
                }
            })
            .catch(error => error )
        }
    
        catch(error){
            return error
        }
        
    },

    addEventToConnection:  (id,callback)=>{
        NetInfo.isConnected.addEventListener(
            id,
            callback
        )},

    removeEventToConnection:(id,callback)=>{
        NetInfo.isConnected.removeEventListener(
            id,
            callback
        )}


} 


export { connectionInfo as default };