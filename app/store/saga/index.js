import { fork ,all} from 'redux-saga/effects'

import {watchVersion} from './apiFetch/fetchVersion'
import {watchCommentary} from './apiFetch/fetchCommentary'
import {watchAudio} from './apiFetch/fetchAudio'
import {watchAllContent} from './apiFetch/fetchAllContent'


export default function* rootSaga() {
  yield all([
    ...watchVersion,
    ...watchCommentary,
    ...watchAudio,
    ...watchAllContent
  ])
}
//all saga put here its a root of all saga 
