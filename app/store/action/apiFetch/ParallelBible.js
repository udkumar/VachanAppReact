import { FETCH_PARALLEL_BIBLE, 
  PARALLEL_BIBLE_SUCCESS,
   PARALLEL_BIBLE_FAILURE,
   FETCH_PARALLEL_VERSION_BOOKS,
   PARALLEL_BIBLE_BOOKS_SUCCESS,
   PARALLEL_BIBLE__BOOKS_FAILURE } from "../actionsType";


export const fetchParallelBible = payload=>({
  type: FETCH_PARALLEL_BIBLE,
  payload
})

export const parallelBibleSuccess= payload => ({
  type: PARALLEL_BIBLE_SUCCESS,
  payload
})

export const parallelBiblefailure = error => ({
  type: PARALLEL_BIBLE_FAILURE,
  error:error,
})

export const fetchParallelVersionBooks = payload=>({
  type: FETCH_PARALLEL_VERSION_BOOKS,
  payload
})

export const ParallelBibleBooksSuccess= payload => ({
  type: PARALLEL_BIBLE_BOOKS_SUCCESS,
  payload
})

export const ParallelBibleBooksfailure = error => ({
  type: PARALLEL_BIBLE__BOOKS_FAILURE,
  error:error,
})

