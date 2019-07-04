import ApiUtils from './ApiUtils'
const API_BASE_URL = 'https://stagingapi.autographamt.com/v1/'

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
            return await fetch(API_BASE_URL + "versiondetails", {  
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
    async getContent(sourceId,type,bookNum) {
        try {
            // var chapter = chapterNum  === undefined ? '' : '/' + chapterNum
            return await fetch(API_BASE_URL + "sources" +'/'+ sourceId +'/'+type+'/'+62, {  
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
    async availableBooks(sourceId){
        try {
            return await fetch(API_BASE_URL + "books" +'/'+ sourceId , {  
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
    }
}
export default APIFetch;