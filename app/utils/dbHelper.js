'use strict';

import Realm from 'realm'
import LanguageModel from '../models/LanguageModel'
import VersionModel from '../models/VersionModel'
import BookModel from '../models/BookModel'
import NoteModel from '../models/NoteModel'
import ChapterModel from '../models/ChapterModel'
import VerseComponentsModel from '../models/VerseComponentsModel'
import StylingModel from '../models/StylingModel'
import ReferenceModel from '../models/ReferenceModel'
import BookmarksListModel from '../models/BookmarksListModel'
import HighlightsModel from '../models/HighlightsModel'
import HistoryModel from '../models/HistoryModel';


import {
	Platform,
} from 'react-native';
import { lang } from 'moment';
var RNFS = require('react-native-fs');

class DbHelper {

    async getRealm() {
    	try {
    		return await Realm.open({
				schemaVersion: 4,
				// deleteRealmIfMigrationNeeded: true, 
				path:
					Platform.OS === 'ios'
					? RNFS.MainBundlePath + '/autographa.realm'
					: RNFS.DocumentDirectoryPath + '/autographa.realm',
				schema: [LanguageModel, VersionModel, BookModel, ChapterModel, VerseComponentsModel, NoteModel, StylingModel, ReferenceModel, HistoryModel,BookmarksListModel,HighlightsModel] });
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

	async queryInVerseText(verCode: string, langCode: string, text: string) {
		let realm = await this.getRealm();
    	if (realm) {
			let result1 = realm.objects("VerseComponentsModel");
			result1 = result1.filtered('languageCode ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '"');
			result1 = result1.filtered('text CONTAINS[c] "' + text + '"');
			return result1;
		}
		return null;
	}
	async queryHighlights(langCode, verCode, bookId){
		let realm = await this.getRealm();
					if (realm){
						let result1 = realm.objects("HighlightsModel");
						let highlight = result1.filtered('languageCode ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '"')
						return highlight
					}
				
	}
	async updateHighlightsInVerse(langCode, verCode, bId, cNum, vNum, isHighlight) {
		let realm = await this.getRealm()
		let  result1= realm.objects('HighlightsModel');
		let highlight = result1.filtered('languageCode ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '" &&  bookId == "' + bId + '" && chapterNumber == "'+cNum+'" && verseNumber == "'+vNum+'"')
		console.log("LANG CODE "+langCode+"bVER CODE "+verCode+" BID "+bId+" CNUM "+cNum+" VNUM "+vNum+" ISHIGHLIGHT "+isHighlight)
		if (realm) {
			realm.write(() => {
				if(isHighlight){
				realm.create('HighlightsModel', {
					languageCode: langCode,
					versionCode: verCode,
					bookId: bId,
					chapterNumber: cNum,
					verseNumber: vNum
				})
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
            var ls = realm.objectForPrimaryKey('LanguageModel', languageModel.languageCode);
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

	async queryBookIdModels(verCode: string, langCode: string) {
		let realm = await this.getRealm();
    	if (realm) {
			let result = realm.objectForPrimaryKey("LanguageModel", langCode);
			let resultsA = result.versionModels;
			resultsA = resultsA.filtered('versionCode == [c] "' + verCode + '"');
			if (resultsA.length > 0) {
				let resultsB = resultsA[0].bookModels.sorted("bookNumber");
				let bookIdModels = [];
				for (var i=0; i<resultsB.length; i++) {
					var bModel = {bookId:resultsB[i].bookId, bookName:resultsB[i].bookName,
						section: resultsB[i].section, bookNumber: resultsB[i].bookNumber,
						languageCode: langCode, versionCode: verCode, numOfChapters:resultsB[i].chapterModels.length };
						bookIdModels.push(bModel);
				}		
				return bookIdModels;
			}
			return null;
		}
		return null;
	}

	

	async updateBookmarkInBook(langCode,verCode,bId,cNum, isBookmark) {
		let realm = await this.getRealm();
		if(realm){
			realm.write(() => {
			let chapter = realm.objects('BookmarksListModel').filtered('languageCode ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '" &&  bookId == "' + bId + '" && chapterNumber == "'+cNum+'"')

			if(isBookmark){
				console.log(" if bookmark "+isBookmark)
				realm.create('BookmarksListModel',{
					languageCode: langCode,
					versionCode: verCode,
					bookId: bId,
					chapterNumber: cNum,
				})
			}
			else{
			console.log("else bookmark "+isBookmark)
			let bookmarkData = realm.objects('BookmarksListModel').filtered('chapterNumber = $0', cNum)
			console.log("len bookmark : " + bookmarkData)
			realm.delete(bookmarkData); 
			}

			})
		}

	}
	async queryBookmark(langCode,verCode,bId){
		let realm = await this.getRealm()

			if (realm){
				let result1 = realm.objects("BookmarksListModel");
				let bookmarks = result1.filtered('languageCode ==[c] "' + langCode + '" && versionCode ==[c] "' + verCode + '"')
				return bookmarks
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

	async addHistory(langCode, verCode, bId, cNum, timeStamp) {
		let realm = await this.getRealm();
		if (realm) {
			realm.write(() => {
				realm.create('HistoryModel', {
					languageCode: langCode,
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
			realm.delete(historyData); // Deletes all
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
			console.log("language deleted")
		})
	}
	//add langauge list from api to db 
	async addLangaugeList(languageModel){
		console.log("langauge list in db helper "+JSON.stringify(languageModel))
		let realm = await this.getRealm();
		// let code = resultsA.filtered('languageCode == [c] "' + langCode + '"')
		if(realm){
			try {
				realm.write(() => {
					realm.create('LanguageModel', languageModel);
				})
			  } catch (e) {
				console.log("Error on creation "+e)
			  }
		}
	}
	async getLangaugeList(){
		let realm = await this.getRealm();
		if(realm){
			console.log(" GET LANGAUGE ")
			try {
					let result = realm.objects('LanguageModel');
					return result
					// realm.write(() => {
					// 	realm.delete(result); 
					// })

			  } catch (e) {
				console.log("Error on  "+e)
			  }
			// console.log(" GET LANGAUGE if ")
		}
	}
}

export default new DbHelper();