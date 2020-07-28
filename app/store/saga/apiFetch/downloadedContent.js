
import { FETCH_DOWNLOADED_VERSION_CONTENT } from '../../action/actionsType'
import { versionContentDownloadedSuccess, versionContentDownloadedFailure } from '../../action/'

import { put, takeLatest} from 'redux-saga/effects'
import DbQueries from '../../../utils/dbQueries'
import AsyncStorageUtil from '../../../utils/AsyncStorageUtil'
import { AsyncStorageConstants } from '../../../utils/AsyncStorageConstants'

const API_BASE_URL = 'https://api.vachanonline.net/v1/'

function* fetchDownloadedVersionContent(params) {
  try {
    let chapterContent = []
    const payload = params.payload
    let downloaded = yield AsyncStorageUtil.getAllItems([
      AsyncStorageConstants.Keys.Downloaded,
    ])
    if (downloaded[0][1]) {
      const response = yield DbQueries.queryVersions(payload.language, payload.version, payload.bookId, payload.chapter)
      yield put(versionContentDownloadedSuccess(response[0]))
      yield put(versionContentDownloadedFailure(null))
    }
  }
  catch (e) {
    yield put(versionContentDownloadedFailure(e))
    yield put(versionContentDownloadedSuccess([]))
  }
}
export const watchDownloadedContent = [
  takeLatest(FETCH_DOWNLOADED_VERSION_CONTENT, fetchDownloadedVersionContent)
]