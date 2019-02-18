var ApiUtils = {  
    checkStatus: function(response) {
      if (response.ok) {
        console.log("response ok "+response)
        return response;
      } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }
  };
  export { ApiUtils as default };