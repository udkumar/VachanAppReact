  import { FETCH_COMMENTARY_CONTENT,FETCH_COMMENTARY_LANGUAGE } from '../../action/actionsType'
  import {commentaryLanguageSuccess,commentaryLanguageFailure,commentaryContentSuccess,commentaryContentFailure}  from '../../action/'
  import { put, takeLatest, call,fork } from 'redux-saga/effects'
  import fetchApi from '../../api';
  const API_BASE_URL = 'https://api.vachanonline.net/v1/commentaries'
  
  function* fetchCommentaryLanguage(params) {
      try {
        const payload = params.payload 
        const languages = API_BASE_URL 
        const response = yield call(fetchApi,languages)
        const contentCommentry = {content:"Commentary",contentVersion:response}
        yield put(commentaryLanguageSuccess(contentCommentry))
      } catch (e) {
      yield put(commentaryLanguageFailure(e))
      }
  }
  
  function* fetchCommentaryContent(params){
    try {
    const payload = params.payload 
        const content = API_BASE_URL +"/"+payload.parallelContentSourceId+"/"+payload.bookId+"/"+payload.chapter
        const res = yield call(fetchApi,content)
        yield put(commentaryContentSuccess(res))
    } catch (e) {
    yield put(commentaryContentFailure(e))
    } 
  }

  export const watchCommentary = [
    takeLatest(FETCH_COMMENTARY_LANGUAGE, fetchCommentaryLanguage),
    takeLatest(FETCH_COMMENTARY_CONTENT, fetchCommentaryContent)
  ]