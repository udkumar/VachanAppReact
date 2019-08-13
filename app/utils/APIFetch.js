import ApiUtils from './ApiUtils'
import { getBookNumberFromMapping } from './UtilFunctions';
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
            return await fetch(API_BASE_URL + "bibles", {  
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
    async getContent(sourceId,type,bookId) {
        try {
            // console.log("source id  "+sourceId+" type "+type+"book num "+bookNum)
            // var chapter = chapterNum  === undefined ? '' : '/' + chapterNum
            return await fetch(API_BASE_URL + "bibles" +'/'+ sourceId +'/'+"books"+'/'+bookId+'/'+type, {  
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
            return await fetch(API_BASE_URL +"bibles"+"/"+sourceId+"/"+"books", {  
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
    async getNumberOfChapter(sourceId,bookId){
        try {
            return await fetch(API_BASE_URL +"bibles"+"/"+sourceId+"/"+"books"+"/"+bookId+"/"+"chapters", {  
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

    async getChapterContent(sourceId,bookId,chapterNum){
        try {
            return await fetch(API_BASE_URL +"bibles"+"/"+sourceId+"/"+"books"+"/"+bookId+"/"+"chapter"+"/"+chapterNum, {  
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