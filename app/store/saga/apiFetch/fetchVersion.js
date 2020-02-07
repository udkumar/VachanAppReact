
import { FETCH_VERSION_LANGUAGE,FETCH_VERSION_BOOKS,FETCH_VERSION_CONTENT } from '../../action/actionsType'
import {versionLanguageSuccess,versionLanguageFailure,versionBooksSuccess,versionBooksFailure,versionContentSuccess,versionContentFailure}  from '../../action/'
import { put, takeLatest, call,fork,all } from 'redux-saga/effects'
import fetchApi from '../../api';
import DbQueries from '../../../utils/dbQueries'
// 
const API_BASE_URL = 'https://api.autographamt.com/v1/'

//fetch audio available book ,audio file 
  function* fetchVersionLanguage() {
    try {
    const url = API_BASE_URL + "bibles"
    const response = yield call(fetchApi,url)
    yield put(versionLanguageSuccess(response))
    } catch (e) {
    yield put(versionLanguageFailure(e))
    }
  }
  
  function* fetchVersionBooks() {
    try {
    const response = yield call(fetchApi,)
    yield put(versionBooksSuccess(response))
    } catch (e) {
    yield put(versionBooksFailure(e))
    }
  }

  function* fetchVersionContent(params) {
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
      const url = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
      const response = yield call(fetchApi,url)
      chapterContent = response.chapterContent.verses
      totalVerses = response.chapterContent.verses.length
    }
    yield put(versionContentSuccess({chapterContent:chapterContent,totalVerses:totalVerses}))
    } catch (e) {
    yield put(versionContentFailure(e))
    }
  }
  
  export const watchVersion = [
    takeLatest(FETCH_VERSION_LANGUAGE, fetchVersionLanguage),
    takeLatest(FETCH_VERSION_BOOKS, fetchVersionBooks),
    takeLatest(FETCH_VERSION_CONTENT, fetchVersionContent)
  ]
  





