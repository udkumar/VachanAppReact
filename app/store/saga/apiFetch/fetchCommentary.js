import { FETCH_COMMENTARY_CONTENT } from '../../action/actionsType'
import { commentaryContentSuccess, commentaryContentFailure } from '../../action/'
import { put, takeLatest, call } from 'redux-saga/effects'
const API_BASE_URL = 'https://api.vachanonline.net/v1/commentaries/'


function* fetchCommentaryContent(params) {
  try {
    const payload = params.payload
    const content = API_BASE_URL + payload.parallelContentSourceId + "/" + payload.bookId + "/" + payload.chapter
    const res = yield call(fetch, content)
    if (res.ok && res.status == 200) {
      const result = yield res.json()
      yield put(commentaryContentSuccess(result))
      yield put(commentaryContentFailure(null))
    } else {
      yield put(commentaryContentFailure(e))
      yield put(commentaryContentSuccess([]))
    }
  } catch (e) {
    yield put(commentaryContentFailure(e))
    yield put(commentaryContentSuccess([]))

  }
}

export const watchCommentary = [
  takeLatest(FETCH_COMMENTARY_CONTENT, fetchCommentaryContent)
]