var ApiUtils = {  
    checkStatus: function(response) {
      console.log("response in Api utils "+JSON.stringify(response))
      if (response.ok) {
        return response;
      } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
  };
  export { ApiUtils as default };