'use strict';

import Realm from 'realm';
import LanguageModel from '../models/LanguageModel';
import VersionModel from '../models/VersionModel';
import BookModel from '../models/BookModel';
import NoteModel from '../models/NoteModel';
import ChapterModel from '../models/ChapterModel';
import VerseModel from '../models/VerseModel';
import NoteStylingModel from '../models/NoteStylingModel';
import VerseStylingModel from '../models/VerseStylingModel';
import ReferenceModel from '../models/ReferenceModel';
import BookmarksListModel from '../models/BookmarksListModel';
import HighlightsModel from '../models/HighlightsModel';
import HistoryModel from '../models/HistoryModel';
import VerseMetadataModel from '../models/VerseMetadataModel';
import bookNameList from '../models/bookNameList';
import BookmarksBookId from '../models/BookmarksBookId'
import HighlightsBookId from '../models/HighlightsBookId'

import {
	Platform,
} from 'react-native';
var RNFS = require('react-native-fs');

class DbHelper {
    async getRealm() {
    	try {
    		return await Realm.open({
				schemaVersion: 10,
				deleteRealmIfMigrationNeeded: true, 
				path:
					Platform.OS === 'ios'
					? RNFS.MainBundlePath + '/vachanApp.realm'
					: RNFS.DocumentDirectoryPath + '/vachanApp.realm',
				schema: [LanguageModel.schema, VersionModel.schema, BookModel.schema, ChapterModel.schema, VerseModel.schema, NoteModel.schema, NoteStylingModel.schema,VerseStylingModel.schema, ReferenceModel.schema, HistoryModel.schema,BookmarksListModel.schema,HighlightsModel.schema,VerseMetadataModel.schema,bookNameList.schema,BookmarksBookId.schema,HighlightsBookId.schema] });
				// console.log('create db:', db.path)
			} catch (err) {
			console.log("error in getItem"+err)
    		return null;
    	}
    }

    async query(model: string, filter?: string, sort?: string, desc?: bool) {
		
		let realm = await this.getRealm();
    	if(realm) {
			let results = realm.objects(model);
		    if(filter) {
		        results = results.filtered(filter);
			}
			if(sort) {
			return results = results.sorted(sort,desc);
			}
			return results;
		}
		return null;
	}

    async queryVersionWithCode(verCode: string, langCode: string) {
		let realm = await this.getRealm();
    	if (realm) {
			// let result = realm.objectForPrimaryKey("LanguageModel", langCode);
			// let resultsA = result.versionModels;
			// resultsA = resultsA.filtered('versionCode ==[c] "' + verCode + '"');
			// return resultsA;
		}
		return null;
	}

	async queryBooksWithCode(verCode: string, langCode: string, text?: string) {
		let realm = await this.getRealm();
    	if (realm) {
				let resultsA = realm.objects("BookModel")
				console.log("result a ",JSON.stringify(resultsA))
				if (resultsA.length > 0) {
					var resultsB = resultsA.filtered('languageName ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '" && bookName CONTAINS[c] "'+text+'"').sorted("bookNumber");
					console.log(" result a ",resultsB.length)
					if(resultsB.length>0){
						return resultsB[0].bookId
					}
				}
				return null;
		}
		return null;
	}

	async queryInVerseText(verCode: string, langName: string, text: string) {
		let realm = await this.getRealm();
    	if (realm) {
			let resultsA = realm.objects("BookModel")
			var resultsB = resultsA.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"');
			if(resultsB.length > 0){
				var textValue =[]
				for(var i =0;i<=resultsB.length-1;i++){
					// var bookId = bookIdresultsB[i].bookName
					for(var j =0; j<=resultsB[i].chapters.length-1;j++){
						var matchedStr = resultsB[i].chapters[j].verses.filtered('text CONTAINS[c] "' + text + '"')
						if(Object.keys(matchedStr).length > 0){
							textValue.push({
								bookId:resultsB[i].bookId,
								chapterNumber:resultsB[i].chapters[j].chapterNumber,
								verseNumber: matchedStr[0].number,
								text:matchedStr[0].text,
								})
						}
					}
				}
				console.log(" verse in ",textValue)
				return textValue
			}
		}
		return null;
	}
	async queryHighlights(sourceId, bId, cNum){
		let realm = await this.getRealm();
		if (realm){
			let result1 = realm.objects("HighlightsModel");
				 if(sourceId == null && bId == null && cNum == null){
						if(Object.keys(result1).length > 0){
							return result1
						}
						else{
							return null
						}
				}
				if(bId == null && cNum == null){
					let highlights = result1.filtered('sourceId == "' + sourceId + '"')
					if(highlights.length > 0){
						let	highlightsId = highlights[0].highlightsBookId
						return highlightsId
					}
					else{
						return null
					}
				}
				else{
				let highlights = result1.filtered('sourceId == "' + sourceId + '"')
					if(highlights.length > 0){
							let bookmarksId = highlights[0].highlightsBookId
							let res = bookmarksId.filtered('bookId==[c] "' + bId + '"&& chapterNumber==[c] "' + cNum + '"')
							// let res = bookmarksId.filtered('bookId==[c] "' + bId + '"')
							console.log("bookmarks match chapter ",JSON.stringify(res.length))
							if(Object.keys(res).length>0){
								return res
							}
							else{
								return null
							}
						}
						else{
							return null
						}
				}
		}
				
	}
	// async addHighlightsInVerse(sourceId,arr){
	// 	console.log("sourceId,arr  ",sourceId,arr)
	// 	let realm = await this.getRealm()
	// 	if (realm) {
	// 		realm.write(() => {
	// 				var highlights = []
	// 				highlights.push(arr)
	// 				realm.create('HighlightsModel',highlights);
	// 		})
	// }
	// }

	async updateHighlightsInVerse(sourceId, bId, chapterNumber, verseNumber, isHighlight){
		let realm = await this.getRealm()
		var source = parseInt(sourceId)
		let sourcedata = realm.objects('HighlightsModel').filtered('sourceId=="'+source+'"')
		let vNum = parseInt(verseNumber)
		let cNum = parseInt(chapterNumber)
		if (realm) {
			// value =[]
			if(isHighlight){
				realm.write(() => {
					if(Object.keys(sourcedata).length == 0){
						console.log("SOURCE ID NOT PRESENT   ",)
					let highlights = realm.create('HighlightsModel', {sourceId:source, highlightsBookId: []});
							highlights.highlightsBookId.push({bookId: bId,  chapterNumber:cNum, verseNumber:[vNum]})
					}
					else{
						console.log("SOURCE ID PRESENT   ",)
						var addToBook = sourcedata[0].highlightsBookId.filtered('bookId==[c]"'+bId+'"&& chapterNumber==[c]"'+cNum+'"')
						console.log(" not bookid ",JSON.stringify(addToBook))
						if(Object.keys(addToBook).length == 0){
						console.log("	BOOK ID PRESENT   ",)
							console.log(" not bookid ",JSON.stringify(addToBook))
								sourcedata[0].highlightsBookId.push({bookId:bId,chapterNumber:cNum,verseNumber:[vNum]})
								// sourcedata[0].highlightsBookId[0].chapterNumber.push(cNum)
						}
						else{
						console.log("	BOOK ID PRESENT   ",)
						console.log(" not chapter ",JSON.stringify(addToBook))
							if(addToBook[0].verseNumber.indexOf(vNum) == -1){
								addToBook[0].verseNumber.push(vNum)
							}
						}
					}
				})
			}
			else{
				var addToBook = sourcedata[0].highlightsBookId.filtered('bookId==[c]"'+bId+'"&& chapterNumber==[c]"'+cNum+'"')
				console.log("delete ",addToBook[0])
				var index = addToBook[0].verseNumber.indexOf(vNum)
				if(addToBook[0].verseNumber.indexOf(vNum) != -1){
					realm.write(() => {
						addToBook[0].verseNumber.splice(index, 1)
						})
				}
			}
		}

		
	}

	async insert(model: string, value) {
		let realm = await this.getRealm();
		if (realm) {
	  		realm.write(() => {
				realm.create(model, value);
			});
	  	}
	}
	
	async insertNewBook(bookModel, versionModel, languageModel) {
		// console.log("bookModel "+JSON.stringify(bookModel)+ " version modal "+JSON.stringify(versionModel)+ "language modal "+JSON.stringify(languageModel))
		let realm = await this.getRealm();
		if (realm) {
            var ls = realm.objectForPrimaryKey('LanguageModel', languageModel.languageName);
            if (ls) {
                var pos = -1;
                for (var i=0; i<ls.versionModels.length; i++) {
                    var vModel = ls.versionModels[i];
                    if (vModel.versionCode == versionModel.versionCode) {
                        pos = i;
                        break;
                    }
                }
                if (pos > -1) {
                    var bModels = ls.versionModels[pos].bookModels;
                    // need to push bookmodel
                    for (var j=0; j<bModels.length; j++) {
                        if (bModels[j].bookId == bookModel.bookId) {
                            return;
                        }
                    }
                    realm.write(() => {
						ls.versionModels[pos].bookModels.push(bookModel);
						console.log("BOOK ADDED ")
                    });
                } else {
                    realm.write(() => {
						ls.versionModels.push(versionModel);
						console.log("verion model added ")    
                    });
                }
            } else {
                realm.write(() => {
					realm.create('LanguageModel', languageModel);
					console.log("langauge added")
                });
            }
	  	}
	}

	async queryBookIdModels(verCode: string, langName: string) {
		let realm = await this.getRealm();
    	if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langName);
			let resultsA = result.versionModels;
			resultsA = resultsA.filtered('versionCode == [c] "' + verCode + '"');
			if (resultsA.length > 0) {
				let resultsB = resultsA[0].bookModels.sorted("bookNumber");
				let bookIdModels = [];
				for (var i=0; i<resultsB.length; i++) {
					var bModel = {bookId:resultsB[i].bookId, bookName:resultsB[i].bookName,
						section: resultsB[i].section, bookNumber: resultsB[i].bookNumber,
						languageName: langName, versionCode: verCode, numOfChapters:resultsB[i].chapterModels.length };
						bookIdModels.push(bModel);
				}		
				return bookIdModels;
			}
			return null;
		}
		return null;
	}

	

	async updateBookmarkInBook(sourceId,bId,cNum, isBookmark) {
		console.log(" langName,verCode,bId,cNum, isBookmark) ",bId,cNum, isBookmark)
		let realm = await this.getRealm();
		if(realm){
			var source = parseInt(sourceId)
			let sourcedata = realm.objects('BookmarksListModel').filtered('sourceId=="'+source+'"')
			if(isBookmark){
				realm.write(() => {
					if(Object.keys(sourcedata).length == 0){
					let bookmarks = realm.create('BookmarksListModel', {sourceId:source, bookmarksBookId: []});
							bookmarks.bookmarksBookId.push({bookId: bId,  chapterNumber:[cNum]})
							// bookmarks.bookmarksBookId[0].chapterNumber.push(cNum)
								console.log(" add chapter ")
					}
					else{
						var addToBook = sourcedata[0].bookmarksBookId.filtered('bookId=="'+bId+'"')
						if(Object.keys(addToBook).length == 0){
							console.log(" not bookid ",JSON.stringify(addToBook))
								sourcedata[0].bookmarksBookId.push({bookId:bId,chapterNumber:[cNum]})
								// sourcedata[0].bookmarksBookId[0].chapterNumber.push(cNum)
							}
							else{
							console.log(" not chapter ",JSON.stringify(addToBook))
								if(addToBook[0].chapterNumber.indexOf(cNum) == -1){
									addToBook[0].chapterNumber.push(cNum)
								}
							}
					}
				})
			}
			else{
				var addToBook = sourcedata[0].bookmarksBookId.filtered('bookId=="'+bId+'"')
				console.log("nothing to delete ",addToBook[0].chapterNumber.indexOf(cNum))
				if(addToBook[0].chapterNumber.indexOf(cNum) > -1){
					realm.write(() => {
						addToBook[0].chapterNumber.splice(addToBook[0].chapterNumber.indexOf(cNum), 1)
						})
				}
				
			}
		}

	}
	async queryBookmark(sourceId,bId){
		// console.log("languagge version ",langName,verCode)

		let realm = await this.getRealm()
			// source id null  or bid null or both null 
			if (realm){
				let result1 = realm.objects("BookmarksListModel");
				 if(sourceId == null && bId == null){
						if(Object.keys(result1).length > 0){
							return result1
						}
						else{
							return null
						}
					 
				}
				else if(bId == null){
				let bookmarks = result1.filtered('sourceId == "' + sourceId + '"')
					if(bookmarks.length > 0){
						let bookmarksId = bookmarks[0].bookmarksBookId
						return bookmarksId
					}
				}
				else{
				let bookmarks = result1.filtered('sourceId == "' + sourceId + '"')
					if(bookmarks.length > 0){
					// console.log("bookmarks data ",bookmarks.length)
						let bookmarksId = bookmarks[0].bookmarksBookId
						let res = bookmarksId.filtered('bookId==[c] "' + bId + '"')
						console.log("bookmarks match chapter ",JSON.stringify(res.length))
						if(Object.keys(res).length>0){
							return res
						}
						else{
							return null
						}
					}
					
				}
			}
	}
	async deleteBookmark(){
		let realm = await this.getRealm();
		if(realm){
		realm.write(() => {
			let bookmarkList = realm.objects('BookmarksListModel')
			let highlights = realm.objects('HighlightsModel')
			realm.delete(bookmarkList); 
			realm.delete(highlights); 

		})
		}
		}
	async queryNotes() {
		let realm = await this.getRealm();
    	if (realm) {
			let results = realm.objects('NoteModel');
			return results.sorted('modifiedTime', true);
		}
		return null;
	}

	async addOrUpdateNote(index, body, createdTime, modifiedTime, refList){
		// console.log("verse list ",refList)
		let realm = await this.getRealm();
		if (realm) {
			let results = realm.objects('NoteModel').filtered('createdTime = $0', createdTime);
			realm.write(() => {
				if (index == -1) {
					realm.create('NoteModel', {body:body, createdTime:createdTime, modifiedTime:modifiedTime, 
						references:refList})
					console.log("write.. new notes..")
				} else {
					if (results.length > 0) {
						results[0].body = body;
						results[0].modifiedTime = modifiedTime;
						results[0].references = refList;
						console.log("update.. notes..")
					}
				}
		  });
		}
	}

	async deleteNote(createdTime){
		let realm = await this.getRealm();
		console.log("delete note : " + createdTime);
		realm.write(() => {
			let allNotes = realm.objects('NoteModel').filtered('createdTime = $0', createdTime);
			console.log("len note : " + allNotes.length);
			realm.delete(allNotes); // Deletes all
		});
	}
	async notesCharStyle(charIndex,styleOption){
		let realm = await this.getRealm();
		if(realm){
			console.log("value in db help "+charIndex+ " style option "+styleOption)
		}
	}

	async addHistory(sourceId,langName,langCode, verCode, bId, cNum,downloaded, timeStamp) {
		let realm = await this.getRealm();
		if (realm) {
			realm.write(() => {
				realm.create('HistoryModel', {
					sourceId:sourceId,
					languageName: langName,
					languageCode:langCode,
					versionCode: verCode,
					bookId: bId,
					chapterNumber: cNum,
					downloaded:JSON.parse(downloaded),
					time: timeStamp
				})
				console.log("write.. history complete..")
		  });
		}
	}

	async queryHistory() {
		let realm = await this.getRealm();
    	if (realm) {
			let results = realm.objects('HistoryModel')
			return results.sorted('time');
		}
		return null
	}

	async clearHistory() {
		let realm = await this.getRealm();
		realm.write(() => {
			let historyData = realm.objects('HistoryModel')
			realm.delete(historyData); 
		});
	}

    async deleteLanguage(langCode,verCode){
		let realm = await this.getRealm();
		realm.write(() => {
			let result = realm.objectForPrimaryKey("LanguageModel", langCode)
			let resultsA = result.versionModels
			let resultsB = resultsA.filtered('versionCode ==[c] "' + verCode + '"')
			realm.delete(resultsB)
			if (resultsA.length == 0) {
				realm.delete(result)
			}
		})
	}

	async addLangaugeList(languages){
		let realm = await this.getRealm()
			
		if(realm){
			for(var i=0; i<languages.length; i++){
				realm.write(() => {
					console.log("langauge added")
					realm.create('LanguageModel', languages[i])
				})
			}
		}
	}
	
	async getLangaugeList(){
		let realm = await this.getRealm();
		if(realm){
		let result = realm.objects('LanguageModel');
		if(Object.keys(result).length > 0){
		console.log("result language list found")
			return result
		}
		else{
		console.log("result language list not found")
			return null
		}
		}
	}
	// async updateLanguageList(langCode,verCode,bookList){
	// 	let realm = await this.getRealm()
	// 	if(realm){
	// 	let result = realm.objectForPrimaryKey("LanguageModel", langCode)
	// 	if(Object.keys(result).length>0){
	// 		let resultsA = result.versionModels;
	// 		let resultB = resultsA.filtered('versionCode == "'+verCode+'" ')
	// 		console.log("version code from db ",resultB[0].downloaded,resultB[0].sourceId)
	// 		realm.write(() => {
	// 			if (Object.keys(resultB).length > 0) {
	// 				if(resultB[0].downloaded === true){
	// 				}
	// 				else{
	// 					resultB[0].downloaded = true
	// 					resultB[0].bookNameList = bookList
	// 				}
				
	// 			}
	// 		});
	// 	}
	// 	}
	// }
	//get all available booklist
	async getDownloadedBook(langName,verCode){
		console.log("languaeg name ",langName,"version code ",verCode)
		let realm = await this.getRealm();
		console.log("realm ",realm)
		if(realm){
			console.log("realm  inside")
					let result = realm.objectForPrimaryKey("LanguageModel", langName);
					let resultsA = result.versionModels;
					let resultB = resultsA.filtered('versionCode == "'+verCode+'" ');
					return resultB[0].bookNameList
		}
	}
	//download version
	async addNewVersion(langName,verCode,bookmodel,sourceId){
		// angName,verCode,result,sourceId,bookListData
		let realm = await this.getRealm();
		if(realm){
			let result = realm.objectForPrimaryKey("LanguageModel",langName)
			// console.log("LanguageModel  ",result.length)
			let resultsA = result.versionModels
			var resultsB = resultsA.filtered('sourceId  =="' + sourceId + '"')
			var resultBoook = realm.objects('BookModel').filtered('languageName ==[c] "' + langName +'" ')
			
			if(bookmodel.length == 0){
				alert("no data to add")
			}
			else{
			var bookIdList =[]
			if(resultBoook.length == 0){
				// direct adding data to db 
				realm.write(() => {
						for(var i=0;i<bookmodel.length;i++){
						realm.create('BookModel', bookmodel[i])
						bookIdList.push({bookId:bookmodel[i].bookId,bookName:bookmodel[i].bookName,bookNumber:bookmodel[i].bookNumber})
						}
					resultsB[0].bookNameList = bookIdList
					resultsB[0].downloaded = true;
				})
			}
			else{
			console.log("some book is there ")
			var found = false;
			for(var i=0;i<resultBoook.length;i++){
				console.log("book is version Code  " ,resultBoook[i].languageName)
				if(resultBoook[i].versionCode == verCode){
					console.log("VERSION ALREADY ADDED")
					found = true
				}
			}
			// if(found==false){
			// 	console.log("add version ")
			// 		realm.write(() => {
			// 			for(var i=0;i<bookmodel.length;i++){
			// 			realm.create('BookModel', bookmodel[i])
			// 		}
			// 		resultsB[0].bookNameList = bookmodel[i].bookId
			// 		resultsA[0].downloaded = true;
			// 		})
					
			// }
		}
		
	}
	}
	}
	//query  chapter
	async queryVersions(langName,verCode,bookId){
		console.log("query version ",langName,verCode,bookId)
		let realm = await this.getRealm()
		
		if(realm){
			let result = realm.objects('BookModel')
			let data = result.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId =="' + bookId + '"' )
			// let resultsA = result.chapters[0]
			if(Object.keys(data).length > 0){
				console.log('downloaded book found ',Object.keys(data).length)
				return data
			}
			else{
				return null
			}
		}
	}
	async queryTextForNote(langName,verCode,bookId,chapterNumber,verseNumber){
		console.log("query version ",langName,verCode,bookId,chapterNumber,verseNumber)
		let realm = await this.getRealm()
		
		if(realm){
			let result = realm.objects('BookModel')
			let data = result.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId =="' + bookId + '"' )[0]
			let verse = data.chapters.filtered('chapterNumber =="' +chapterNumber+'"')[0]

			if(Object.keys(verse).length > 0){
				let val = verse.verses[verseNumber-1].text
				return val
			}
			else{
				return null
			}
		}
	}
	//query book
	// async queryBook(langName,verCode,bookId){
	// 	console.log("query version ",langName,verCode,bookId)
	// 	let realm = await this.getRealm()
	// 	if(realm){
	// 	var book = realm.objects('BookModel').filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId ==   "' + bookId + '"' )
	// 	if(book){
	// 		console.log(book," book from db ")
	// 	}
	// 	else{
	// 		console.log(" sorry no data present")

	// 	}
	// 	}
	// }
}

export default new DbHelper();