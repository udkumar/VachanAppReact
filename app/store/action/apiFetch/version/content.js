
import { FETCH_VERSION_CONTENT, VERSION_CONTENT_SUCCESS, VERSION_CONTENT_FAILURE } from '../../actionsType';

export const fetchVersionContent = payload=>({
  type: FETCH_VERSION_CONTENT,
  payload
})

export const versionContentSuccess = payload => ({
  type: VERSION_CONTENT_SUCCESS,
  chapterContent:payload.chapterContent,
  totalVerses:payload.totalVerses
})

export const versionContentFailure = error => ({
  type: VERSION_CONTENT_FAILURE,
  error:error,
})

