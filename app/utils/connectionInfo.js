import {NetInfo} from "react-native"

export  var connectionInfo = () =>{
    NetInfo.isConnected.fetch().then(isConnected => {
        console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      });
      function handleFirstConnectivityChange(isConnected) {
        console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
        NetInfo.isConnected.removeEventListener(
          'connectionChange',
          handleFirstConnectivityChange
        );
      }
      NetInfo.isConnected.addEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      );

} 