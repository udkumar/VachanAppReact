
import { FETCH_PARALLEL_BIBLE } from '../../action/actionsType'
import {parallelBibleSuccess,parallelBiblefailure,}  from '../../action/'
import { put, takeLatest, call,fork,all } from 'redux-saga/effects'
import fetchApi from '../../api';
import DbQueries from '../../../utils/dbQueries'
// 
const API_BASE_URL = 'https://api.vachanonline.net/v1/'



  function* fetchParalleBible(params) {
    try {
      let chapterContent=[]
      let totalVerses=null
      const payload = params.payload
    if(payload.isDownloaded == true ) {
      const response = yield call(DbQueries.queryVersions(payload.language,payload.version,payload.bookId,payload.chapter)) 
      chapterContent = response[0].verses
      totalVerses = response[0].length
    }
    else{
      console.log(" query chapter number ",payload.chapter)
      const url = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
      const res = yield call(fetch,url)
      if(res.ok && res.status == 200){
        const response = yield res.json()
        // console.log("RESPONDE AND CHAPTER NUMBER ",response.chapterContent.verses)
        const chapterContent = response.chapterContent.verses
        const totalVerses = response.chapterContent.verses.length
        yield put(parallelBibleSuccess({parallelBible:chapterContent,totalVerses:totalVerses}))
        yield put(parallelBiblefailure(null))
      }
    }
    } catch (e) {
    yield put(parallelBiblefailure(e))
    yield put(parallelBibleSuccess([]))

    }
  }
  
  export const watchParallelBible = [
    takeLatest(FETCH_PARALLEL_BIBLE, fetchParalleBible),
  ]