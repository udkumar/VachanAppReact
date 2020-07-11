
import { FETCH_PARALLEL_BIBLE,FETCH_PARALLEL_VERSION_BOOKS } from '../../action/actionsType'
import {parallelBibleSuccess,parallelBiblefailure, versionParallelBooksSuccess,versionParallelBooksFailure,}  from '../../action/'
import { put, takeLatest, call,fork,all } from 'redux-saga/effects'
import fetchApi from '../../api';
import DbQueries from '../../../utils/dbQueries'
// 
const API_BASE_URL = 'https://api.vachanonline.net/v1/'



function* fetchParallelVersionBooks(params) {
  try {
    const payload = params.payload
    console.log("PAYLOAD ",payload)
    // let downloaded = yield AsyncStorageUtil.getAllItems([
    //   AsyncStorageConstants.Keys.Downloaded,
    // ])
    let bookListData = []
    if(payload.downloaded) {
      // console.log("payload bible ")
      var response = yield DbQueries.getDownloadedBook(payload.language)
      console.log("book name downloaded  ",response)
       for(var i=0; i<=response.length-1;i++){
        // var bookId = response[i]
        var books = {
              bookId:response[i].bookId,
              bookName:response[i].bookName,
              section:getBookSectionFromMapping(response[i].bookId),
              bookNumber:response[i].bookNumber,
              numOfChapters:getBookChaptersFromMapping(response[i].bookId)
          }
        bookListData.push(books)
        }
        // console.log("book list fetch book list ")
        // console.log("book list fetch book list ",response)
    }
    else{
      // const url  = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books"
      var result = yield call(fetch,'https://api.vachanonline.net/v1/booknames')
      // console.log("response data  ",result)
      if(result.ok && result.status == 200){
        const response = yield result.json()
        // console.log("response data  ",response)
        for(var i =0;i<response.length;i++){
          // console.log("language name ",payload.language.toLowerCase(),response[i].language.name)
          if(payload.language.toLowerCase() == response[i].language.name){
            for(var j=0;j<=response[i].bookNames.length-1;j++){
              var books= {
                bookId:response[i].bookNames[j].book_code,
                bookName:response[i].bookNames[j].short,
                section:getBookSectionFromMapping(response[i].bookNames[j].book_code),
                bookNumber:response[i].bookNames[j].book_id,
                numOfChapters:getBookChaptersFromMapping(response[i].bookNames[j].book_code)
            }
            bookListData.push(books)
            }
          }
        }
      }
    }
    var res = bookListData.length == 0 ? [] : bookListData.sort(function(a, b){return a.bookNumber - b.bookNumber})
    yield put(versionParallelBooksSuccess(res))
    yield put(versionParallelBooksFailure(null))
    // console.log("NOT GETTING DATA ",bookListData)
  
  } catch (e) {
    console.log("ERROR ON GETTING BOOOKLIST ",e)
  yield put(versionParallelBooksFailure(e))
  yield put(versionParallelBooksSuccess([]))
  }
}


  function* fetchParalleBible(params) {
    try {
      let chapterContent=[]
      let totalVerses=null
      const payload = params.payload
    if(payload.isDownloaded == true ) {
      const response = yield call(DbQueries.queryVersions(payload.language,payload.version,payload.bookId,payload.chapter)) 
      chapterContent = response[0].verses
      totalVerses = response[0].length
    }
    else{
      console.log(" query chapter number ",payload.chapter)
      const url = API_BASE_URL + "bibles" + "/" + payload.sourceId + "/" + "books" + "/" + payload.bookId + "/" + "chapter" + "/" + payload.chapter
      const res = yield call(fetch,url)
      if(res.ok && res.status == 200){
        const response = yield res.json()
        // console.log("RESPONDE AND CHAPTER NUMBER ",response.chapterContent.verses)
        const chapterContent = response.chapterContent.verses
        const totalVerses = response.chapterContent.verses.length
        yield put(parallelBibleSuccess({parallelBible:chapterContent,totalVerses:totalVerses}))
        yield put(parallelBiblefailure(null))
      }
    }
    } catch (e) {
    yield put(parallelBiblefailure(e))
    yield put(parallelBibleSuccess([]))

    }
  }
  
  export const watchParallelBible = [
    takeLatest(FETCH_PARALLEL_BIBLE, fetchParalleBible),
    takeLatest(FETCH_PARALLEL_VERSION_BOOKS, fetchParallelVersionBooks),
  ]