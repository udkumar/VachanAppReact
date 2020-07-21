import { FETCH_DICTIONARY_CONTENT } from '../../action/actionsType'
import { dictionaryContentSuccess, dictionaryContentFailure } from '../../action/'
import { put, takeLatest, call } from 'redux-saga/effects'
const API_BASE_URL = 'https://api.vachanonline.net/v1/dictionaries/'

function* fetchDictionaryContent(params) {
  try {
    const payload = params.payload
    const content = API_BASE_URL + payload.parallelContentSourceId
    const res = yield call(fetch, content)
    // console.log("res ",res)
    if (res.ok && res.status == 200) {
      const result = yield res.json()

      yield put(dictionaryContentSuccess(result))
      yield put(dictionaryContentFailure(null))
    }
    else {
      yield put(dictionaryContentFailure(e))
      yield put(dictionaryContentSuccess([]))
    }

  } catch (e) {
    console.log("error ", e)
    yield put(dictionaryContentFailure(e))
    yield put(dictionaryContentSuccess([]))
  }
}

export const watchDictionary = [
  takeLatest(FETCH_DICTIONARY_CONTENT, fetchDictionaryContent)
]