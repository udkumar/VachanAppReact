import { FETCH_COMMENTARY_LANGUAGE,COMMENTARY_LANGUAGE_FAILURE,COMMENTARY_LANGUAGE_SUCCESS } from "../../actionsType";


export const fetchCommentaryLanguage = payload =>({
type: FETCH_COMMENTARY_LANGUAGE,
payload
})

export const commentaryLanguageSuccess = payload => ({
  type: COMMENTARY_LANGUAGE_SUCCESS,
  payload
})

export const commentaryLanguageFailure = error => ({
  type: COMMENTARY_LANGUAGE_FAILURE,
  error:error,
})
