
import { FETCH_VERSION_LANGUAGE,FETCH_VERSION_BOOKS,FETCH_VERSION_CONTENT} from '../../action/actionsType'
import {versionLanguageSuccess,versionLanguageFailure,versionBooksSuccess,versionBooksFailure,versionContentSuccess,versionContentFailure,versionContentDownloadedSuccess,versionContentDownloadedFailure}  from '../../action/'
import {getBookNameFromMapping,getBookSectionFromMapping,getBookNumberFromMapping,getBookChaptersFromMapping, getBookNumOfVersesFromMapping} from '../../../utils/UtilFunctions';

import { put, takeLatest, call,fork,all } from 'redux-saga/effects'
import fetchApi from '../../api';
import DbQueries from '../../../utils/dbQueries'
import AsyncStorageUtil from '../../../utils/AsyncStorageUtil'
import {AsyncStorageConstants} from '../../../utils/AsyncStorageConstants'

const API_BASE_URL = 'https://api.autographamt.com/v1/'

//fetch audio available book ,audio file 
  function* fetchVersionLanguage() {
    try {
    const url = API_BASE_URL + "bibles"
    const response = yield call(fetchApi,url)
    yield put(versionLanguageSuccess(response))
    yield put(versionLanguageFailure(null))

    } catch (e) {
    yield put(versionLanguageFailure(e))
    yield put(versionLanguageSuccess([]))

    }
  }
  
  function* fetchVersionBooks(params) {
    try {
      const payload = params.payload
      let downloaded = yield AsyncStorageUtil.getAllItems([
        AsyncStorageConstants.Keys.Downloaded,
      ])
      let bookListData = []
      if(downloaded[0][1]) {
        console.log("payload bible ")
        var response = yield DbQueries.getDownloadedBook(payload.language,payload.versionCode)
         for(var i = 0; i<response.length;i++){
          var bookId = response[i]
          var books = {
                bookId:bookId,
                bookName:getBookNameFromMapping(bookId,payload.language),
                section:getBookSectionFromMapping(bookId),
                bookNumber:getBookNumberFromMapping(bookId),
                numOfChapters:getBookChaptersFromMapping(bookId)
            }
          bookListData.push(books)
          }
          console.log("book list fetch book list ")
          console.log("book list fetch book list ",response)
      }
      else{
        const url  = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books"
        var response = yield call(fetchApi,url)
        for(var i =0;i<response[0].books.length;i++){
          var bookId = response[0].books[i].abbreviation
          var books= {
                bookId:bookId,
                bookName: getBookNameFromMapping(bookId,payload.language),
                section:getBookSectionFromMapping(bookId),
                bookNumber:getBookNumberFromMapping(bookId),
                numOfChapters:getBookChaptersFromMapping(bookId)
          }
          bookListData.push(books)
        }
        console.log("book list fetch book list ",response)
      }
      console.log("NOT GETTING DATA ")
    var res = bookListData.length == 0 ? [] : bookListData.sort(function(a, b){return a.bookNumber - b.bookNumber})
    yield put(versionBooksSuccess(res))
    yield put(versionBooksFailure(null))
    } catch (e) {
      console.log("ERROR ON GETTING BOOOKLIST ",e)
    yield put(versionBooksFailure(e))
    yield put(versionBooksSuccess([]))

    }
  }

  function* fetchVersionContent(params) {
    try {
      let chapterContent = []
      let totalVerses=null
      const payload = params.payload
      const url = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
      const response = yield call(fetchApi,url)
      chapterContent = response.chapterContent.verses
      totalVerses = response.chapterContent.verses.length
    yield put(versionContentSuccess({chapterContent:chapterContent,totalVerses:totalVerses}))
    yield put(versionContentFailure(null))
    } catch (e) {
      console.log("error fetch content ",e)

    yield put(versionContentFailure(e))
    yield put(versionContentSuccess([]))

    }
  }

  
  export const watchVersion = [
    takeLatest(FETCH_VERSION_LANGUAGE, fetchVersionLanguage),
    takeLatest(FETCH_VERSION_BOOKS, fetchVersionBooks),
    takeLatest(FETCH_VERSION_CONTENT, fetchVersionContent),
  ]




