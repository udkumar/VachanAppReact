
import { FETCH_DOWNLOADED_VERSION_CONTENT,VERSION_DOWNLOADED_CONTENT_FAILURE,VERSION_DOWNLOADED_CONTENT_SUCCESS} from '../../actionsType';

export const fetchDownloadedVersionContent  = payload => ({
    type: FETCH_DOWNLOADED_VERSION_CONTENT,
    payload,
  })
  
  export const versionContentDownloadedSuccess = payload => ({
    type: VERSION_DOWNLOADED_CONTENT_SUCCESS,
    payload,
  })
  
  export const versionContentDownloadedFailure = error => ({
    type: VERSION_DOWNLOADED_CONTENT_FAILURE,
    error:error,
  })
  