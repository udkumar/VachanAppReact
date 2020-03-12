import { FETCH_DICTIONARY_CONTENT } from '../../action/actionsType'
import {dictionaryContentSuccess,dictionaryContentFailure}  from '../../action/'
import { put, takeLatest, call,fork } from 'redux-saga/effects'
import fetchApi from '../../api';
const API_BASE_URL = 'https://api.vachanonline.net/v1/dictionaries/'

// function* fetchCommentaryLanguage(params) {
//     try {
//       const payload = params.payload 
//       const languages = API_BASE_URL 
//       const response = yield call(fetchApi,languages)
//       const contentCommentry = {content:"Commentary",contentVersion:response}
//       yield put(commentaryLanguageSuccess(contentCommentry))
//       yield put(commentaryLanguageFailure(null))

//     } catch (e) {
//       yield put(commentaryLanguageFailure(e))
//       yield put(commentaryLanguageSuccess([]))

//     }
// }

function* fetchDictionaryContent(params){
  try {
  const payload = params.payload 
      const content = API_BASE_URL+payload.parallelContentSourceId
      const res = yield call(fetchApi,content)
      yield put(dictionaryContentSuccess(res))
      yield put(dictionaryContentFailure(null))

  } catch (e) {
  yield put(dictionaryContentFailure(e))
  yield put(dictionaryContentSuccess([]))

  } 
}

export const watchDictionary = [
  takeLatest(FETCH_DICTIONARY_CONTENT, fetchDictionaryContent)
]