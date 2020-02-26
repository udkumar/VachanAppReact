
import { FETCH_VERSION_LANGUAGE,FETCH_VERSION_BOOKS,FETCH_VERSION_CONTENT } from '../../action/actionsType'
import {versionLanguageSuccess,versionLanguageFailure,versionBooksSuccess,versionBooksFailure,versionContentSuccess,versionContentFailure}  from '../../action/'
import {getBookNameFromMapping,getBookSectionFromMapping,getBookNumberFromMapping,getBookChaptersFromMapping} from '../../../utils/UtilFunctions';

import { put, takeLatest, call,fork,all } from 'redux-saga/effects'
import fetchApi from '../../api';
import DbQueries from '../../../utils/dbQueries'
// 
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
      let bookListData = []
      if(payload.isDownloaded == true ) {
         response = yield DbQueries.getDownloadedBook(payload.language,payload.versionCode)
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

      }
    var res = bookListData.length == 0 ? [] : bookListData.sort(function(a, b){return a.bookNumber - b.bookNumber})
    yield put(versionBooksSuccess(res))
    yield put(versionBooksFailure(null))
    } catch (e) {
    yield put(versionBooksFailure(e))
    yield put(versionBooksSuccess([]))

    }
  }

  function* fetchVersionContent(params) {
    try {
      let chapterContent=[]
      let totalVerses=null
      const payload = params.payload
      console.log("payload.isDownloaded ",payload.isDownloaded)
    if(payload.isDownloaded == true ) {
      const response = yield DbQueries.queryVersions(payload.language,payload.version,payload.bookId,payload.chapter) 
      console.log(" downloaded ......",response)
      chapterContent = response[0].verses
      totalVerses = response[0].length
    }
    else{
      const url = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
      const response = yield call(fetchApi,url)
      chapterContent = response.chapterContent.verses
      totalVerses = response.chapterContent.verses.length
      console.log("not downloaded ",response)
      console.log(" chapterContent ",chapterContent)
      console.log("totalVerses ",totalVerses)
    }
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
    takeLatest(FETCH_VERSION_CONTENT, fetchVersionContent)
  ]
  





