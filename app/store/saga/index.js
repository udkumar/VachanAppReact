import { fork ,all} from 'redux-saga/effects'

import {watchVersion} from './apiFetch/fetchVersion'
import {watchCommentary} from './apiFetch/fetchCommentary'
import {watchAudio} from './apiFetch/fetchAudio'
import {watchAllContent} from './apiFetch/fetchAllContent'
import {watchParallelBible} from './apiFetch/parallelBible'
import {watchDownloadedContent} from './apiFetch/downloadedContent'


export default function* rootSaga() {
  yield all([
    ...watchVersion,
    ...watchCommentary,
    ...watchAudio,
    ...watchAllContent,
    ...watchParallelBible,
    ...watchDownloadedContent
  ])
}
//all saga put here its a root of all saga 
