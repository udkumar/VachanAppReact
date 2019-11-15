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


import {
	Platform,
} from 'react-native';
import { lang } from 'moment';
import { constColors } from './colors';
var RNFS = require('react-native-fs');

class DbHelper {

    async getRealm() {
    	try {
    		return await Realm.open({
				schemaVersion: 25,
				deleteRealmIfMigrationNeeded: true, 
				path:
					Platform.OS === 'ios'
					? RNFS.MainBundlePath + '/vachanApp.realm'
					: RNFS.DocumentDirectoryPath + '/vachanApp.realm',
				schema: [LanguageModel, VersionModel, BookModel, ChapterModel, VerseModel, NoteModel, NoteStylingModel,VerseStylingModel, ReferenceModel, HistoryModel,BookmarksListModel,HighlightsModel,VerseMetadataModel] });
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

	async queryBooksWithCode(verCode: string, langCode: string, bookId?: string, text?: string) {
		let realm = await this.getRealm();
    	if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langCode);
			if (result) {
				let resultsA = result.versionModels;
				resultsA = resultsA.filtered('versionCode ==[c] "' + verCode + '"');
				if (resultsA.length > 0) {
					let resultsB = resultsA[0].bookModels;				
					if (bookId) {
						resultsB = resultsB.filtered('bookId ==[c] "' + bookId + '"');
						return resultsB;
					}
					if (text) {
						 resultsB = resultsB.filtered('bookName CONTAINS[c] "' + text + '"').sorted("bookNumber");
						 return resultsB
						}
					return resultsB.sorted("bookNumber");
				}
				return null;
			}
			return null;
		}
		return null;
	}

	async queryInVerseText(verCode: string, langName: string, text: string) {
		let realm = await this.getRealm();
    	if (realm) {
			let result1 = realm.objects("VerseModel");
			result1 = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"');
			result1 = result1.filtered('text CONTAINS[c] "' + text + '"');
			return result1;
		}
		return null;
	}
	async queryHighlights(langName, verCode, bookId){
		let realm = await this.getRealm();
		if (realm){
			var result1 = realm.objects("HighlightsModel");
			if(bookId == null ){
				
				let highlightList = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"' )
				return highlightList
			}
			else{
				let highlight = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId ==[c]   "' + bookId + '"' )
				return highlight
			}
			
		}
				
	}
	async updateHighlightsInVerse(langName, verCode, bId, cNum, vNum, isHighlight){
		let realm = await this.getRealm()
		let  result1= realm.objects('HighlightsModel');
		let highlight = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" &&  bookId == "' + bId + '" && chapterNumber == "'+cNum+'" && verseNumber == "'+vNum+'"')
		// console.log("LANG CODE "+langName+"bVER CODE "+verCode+" BID "+bId+" CNUM "+cNum+" VNUM "+vNum+" ISHIGHLIGHT "+isHighlight)
		if (realm) {
			realm.write(() => {
				if(isHighlight == true){
				if(Object.keys(highlight).length === 0){
				console.log("highlight length",Object.keys(highlight).length)
				console.log("highlight ",highlight)

					realm.create('HighlightsModel', {
						languageName: langName,
						versionCode: verCode,
						bookId: bId,
						chapterNumber: cNum,
						verseNumber: vNum
					})
				}
				}
				else{
					realm.delete(highlight); 
				}
				})
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

	

	async updateBookmarkInBook(langName,verCode,bId,cNum, isBookmark) {
		let realm = await this.getRealm();
		if(realm){
			realm.write(() => {
			let chapter = realm.objects('BookmarksListModel').filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" &&  bookId == "' + bId + '" && chapterNumber == "'+cNum+'"')
			if(isBookmark){
				if(chapter==cNum){
					return
				}
				else{
					console.log(" if bookmark "+isBookmark)
					realm.create('BookmarksListModel',{
						bookId:bId,
						chapterNumber:cNum,
						versionCode:verCode,
						languageName:langName
					})
				}
				
			}
			else{
			let bookmarkData = realm.objects('BookmarksListModel').filtered('chapterNumber = $0', cNum)
			console.log("len bookmark : " + bookmarkData)
			realm.delete(bookmarkData); 
			}

			})
		}

	}
	async queryBookmark(langName,verCode,bId,chapter){

		let realm = await this.getRealm()

			if (realm){
				let result1 = realm.objects("BookmarksListModel");
				
				if(chapter == null  && bId == null){
					let bookmarksList = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" ')
					return bookmarksList
				}
				else{
					let bookmarks = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" && bookId =="' + bId + '" && chapterNumber == "' + chapter + '"')
					return bookmarks
				}
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

	async addHistory(langName, verCode, bId, cNum, timeStamp) {
		let realm = await this.getRealm();
		if (realm) {
			realm.write(() => {
				realm.create('HistoryModel', {
					languageName: langName,
					versionCode: verCode,
					bookId: bId,
					chapterNumber: cNum,
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
					return result
		}
		return null
	}
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

	async addNewVersion(langName,verCode,bookmodel,sourceId){
      console.log("add new version ",langName,verCode,sourceId)

		let realm = await this.getRealm();
		if(realm){
			let result = realm.objectForPrimaryKey("LanguageModel",langName)
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
						bookIdList.push(bookmodel[i].bookId)
						}
						resultsB[0].bookNameList = bookIdList
					resultsB[0].downloaded = true;
				})
			}
			else{
			var found = false;
			for(var i=0;i<resultBoook.length;i++){
				console.log("book is version Code  " ,resultBoook[i].languageName)
				if(resultBoook[i].versionCode == verCode){
					console.log("VERSION ALREADY ADDED")
					found = true
				}
			}
			if(found==false){
				console.log("add version ")
				
					realm.write(() => {
						for(var i=0;i<bookmodel.length;i++){
						realm.create('BookModel', bookmodel[i])
					}
					resultsB[0].bookNameList = bookmodel[i].bookId
					resultsA[0].downloaded = true;

					})
					
			}
		}
	}
	}
	}

	async queryVersions(langName,verCode,bookId,chapterNumber){
		 console.log("query version ",langName,verCode,bookId,chapterNumber)
		let realm = await this.getRealm()
		if(realm){
		var version = realm.objects('ChapterModel').filtered('chapterOwner.languageName ==[c] "' + langName + '" && chapterOwner.versionCode ==[c] "' + verCode + '" && chapterOwner.bookId ==   "' + bookId + '" && chapterNumber ==   "' + chapterNumber + '"' )
		return version
		}

	}
}

export default new DbHelper();