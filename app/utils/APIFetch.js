import ApiUtils from './ApiUtils'
// import timestamp from '../assets/timestamp'
const API_BASE_URL = 'https://stagingapi.autographamt.com/app/'

var APIFetch = {
    async getLanguages() {
        try {
            return await fetch(API_BASE_URL + "languages", {  
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .catch(e => e)
        } catch(error) {
            return error;
        }
    },

    async getVersions() {
        try {      
            return await fetch(API_BASE_URL + "versions", {  
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .catch(e => e)
        } catch(error) {
            return error;
        }
    },
    async getContent(versionId) {
        try {
            return await fetch(API_BASE_URL + "content" +'/'+ versionId, {  
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            })
            .then(ApiUtils.checkStatus)
            .then((response) => response.json())
            .catch(e => e)
        } catch(error) {
            return error;
        }
    },
}
export default APIFetch;