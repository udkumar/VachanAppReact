

const API_BASE_URL = 'https://api.autographamt.com/v1/'
const GIT_BASE_API = 'https://github.com/Bridgeconn/vachancontentrepository/raw/master/'
const GITRAW = 'https://github.com/Bridgeconn/vachancontentrepository/tree/master/'
const OWN_BASE_URL = 'https://raw.githubusercontent.com/neetuy/BibleContent/master/jpg_files/'


const fetchApi = async(url)=> {
  try {
      const response = await fetch(url)
      return response.json()
  } catch (error) {
      return error;
  }
}

// const fetchFromDB = async()=>{
//     try {
//         const response = await fetch(url)
//         return response.json()
//     } catch (error) {
//         return error;
//     } 

// }

export default fetchApi

