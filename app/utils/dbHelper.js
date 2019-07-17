'use strict';

import Realm from 'realm'
import LanguageModel from '../models/LanguageModel'
import VersionModel from '../models/VersionModel'
import BookModel from '../models/BookModel'
import NoteModel from '../models/NoteModel'
import ChapterModel from '../models/ChapterModel'
import VerseModel from '../models/VerseModel'
import StylingModel from '../models/StylingModel'
import ReferenceModel from '../models/ReferenceModel'
import BookmarksListModel from '../models/BookmarksListModel'
import HighlightsModel from '../models/HighlightsModel'
import HistoryModel from '../models/HistoryModel';
import VerseMetadataModel from '../models/VerseMetadataModel'

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
				schemaVersion: 18,
				// deleteRealmIfMigrationNeeded: true, 
				path:
					Platform.OS === 'ios'
					? RNFS.MainBundlePath + '/vachanApp.realm'
					: RNFS.DocumentDirectoryPath + '/vachanApp.realm',
				schema: [LanguageModel, VersionModel, BookModel, ChapterModel, VerseModel, NoteModel, StylingModel, ReferenceModel, HistoryModel,BookmarksListModel,HighlightsModel,VerseMetadataModel] });
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
						let result1 = realm.objects("HighlightsModel");
						let highlight = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"')
						return highlight
					}
				
	}
	async updateHighlightsInVerse(langName, verCode, bId, cNum, vNum, isHighlight){
		let realm = await this.getRealm()
		let  result1= realm.objects('HighlightsModel');
		let highlight = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" &&  bookId == "' + bId + '" && chapterNumber == "'+cNum+'" && verseNumber == "'+vNum+'"')
		console.log("LANG CODE "+langName+"bVER CODE "+verCode+" BID "+bId+" CNUM "+cNum+" VNUM "+vNum+" ISHIGHLIGHT "+isHighlight)
		if (realm) {
			realm.write(() => {
				if(isHighlight){
				realm.create('HighlightsModel', {
					languageName: langName,
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
		console.log("language name in update bookmark "+langName+" vercode "+verCode+" bid "+bId+" cnum "+cNum+" isbookmark "+isBookmark)
		let realm = await this.getRealm();
		if(realm){
			realm.write(() => {
			let chapter = realm.objects('BookmarksListModel').filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '" &&  bookId == "' + bId + '" && chapterNumber == "'+cNum+'"')
			if(isBookmark){
				console.log(" if bookmark "+isBookmark)
				realm.create('BookmarksListModel',{
					bookId:bId,
					chapterNumber:cNum,
					versionCode:verCode,
					languageName:langName
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
	async queryBookmark(langName,verCode,bId){
		let realm = await this.getRealm()

			if (realm){
				let result1 = realm.objects("BookmarksListModel");
				let bookmarks = result1.filtered('languageName ==[c] "' + langName + '" && versionCode ==[c] "' + verCode + '"')
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
	// //add langauge list from api to db 
	// async addLangaugeList(languageModel,versionModel){
	// 	console.log("langauge list in db helper "+JSON.stringify(languageModel.languageCode))
	// 	let realm = await this.getRealm()
	// 	// let code = resultsA.filtered('languageCode == [c] "' + langCode + '"')
			
	// 	if(realm){
	// 		let result = realm.objectForPrimaryKey('LanguageModel', languageModel.languageCode);
	// 		console.log("result "+result)
	// 		try {
	// 			if(result){
	// 				for (var i=0; i<result.versionModels.length; i++){
	// 					var vModel = result.versionModels[i]
	// 					console.log("version code in table "+vModel.versionCode+ "version code from json "+JSON.stringify(versionModel))
	// 					if (vModel.versionCode == versionModel.versionCode) {
	// 						return
	// 					}
	// 					realm.write(() => {
	// 						result.versionModels.push(versionModel)
	// 					})
	// 				}
	// 			}
	// 			else{
	// 				realm.write(() => {
	// 					realm.create('LanguageModel', languageModel)
	// 				})
	// 			}
				
	// 		  } catch (e) {
	// 			console.log("Error on creation "+e)
	// 		  }
	// 	}
	// }
	async addLangaugeList(languageModel,versionModel){
		let realm = await this.getRealm()
			
		if(realm){
			let result = realm.objectForPrimaryKey('LanguageModel', languageModel.languageName)
			try {
				if(result){
					console.log("result key found primary key" +JSON.stringify(result.versionModels)+"langauge name"+languageModel.languageName)
					for (var i=0; i<=result.versionModels.length-1; i++){
						var vModel = result.versionModels[i]
						for(var j=0; j<=versionModel.length-1; j++){
							if (vModel.versionCode == versionModel[j].versionCode) {
								return
							}
						}
						realm.write(() => {
							result.versionModels.push(versionModel)
						})
					}
				}
				else{
					realm.write(() => {
						console.log("langauge added")
						realm.create('LanguageModel', languageModel)
					})
				}
				
				
			  } catch (e) {
				console.log("Error on creation "+e)
			  }
			
		}
	}
	// async addLangaugeList(languageModel,versionModel){
	// 	console.log("languagge name add "+languageModel.languageName)
	// 	let realm = await this.getRealm()
			
	// 	if(realm){
	// 		// let result = realm.objects('LanguageModel').filtered('LanguageModel ==[c] "' + languageModel.languageName +'"');
	// 		let result = realm.objectForPrimaryKey('LanguageModel', languageModel.languageName)
	// 		try {
	// 			// if(result.length>0){
	// 			// 	let language = realm.objects('LanguageModel');
	// 			// 	realm.write(() => {
	// 			// 		console.log("langauge added")
	// 			// 		realm.delete(language)
	// 			// 	})
	// 			// }
	// 			realm.write(() => {
	// 				realm.create('HistoryModel', {
	// 					languageName: langName,
	// 					versionCode: verCode,
	// 					bookId: bId,
	// 					chapterNumber: cNum,
	// 					time: timeStamp
	// 				})
	// 				realm.create('LanguageModel', languageModel)
	// 				console.log("langauge added")

	// 			})
	// 		  } catch (e) {
	// 			console.log("Error on creation "+e)
	// 		  }
			
	// 	}
	// }
	async getLangaugeList(){
		let realm = await this.getRealm();
		if(realm){
					let result = realm.objects('LanguageModel');
					console.log(" GET LANGAUGE ")
					return result
		}
		return null
	}

	async addNewVersion(langName,versCode,bookmodel){
		console.log("language code "+langName+" vercODE "+versCode)
		let realm = await this.getRealm();
		if(realm){
			var result = realm.objects('BookModel').filtered('languageName ==[c] "' + langName +'"versionCode==[c] "' + versCode +'"');
			// var results = realm.objects('LanguageModel').filtered('languageName ==[c] "' + langName +'"');
			// var results = realm.objects('VersionModel').filtered('languageName ==[c] "' + langName +'"versionCode==[c] "' + versCode +'"');
			if(results !=null){
					console.log("add new version ::::::::::::")
			}
			console.log("results "+results)
			// realm.write(() => {
			// realm.delete(realm.objects('BookModel')); 
			// })
			try {
				if(result == 0){
					realm.write(() => {
						// console.log("uniquee add "+bookmodel)
						// realm.create('BookModel', bookmodel)

						// result[0].downloaded = true;

					})
					// realm.write(() => {
					// 	// console.log("uniquee add "+bookmodel)
					// 	realm.create('LanguageModel', bookmodel)

					// 	result[0].downloaded = true;

					// })
					
				}
				else{
					console.log("result in add new version "+JSON.stringify(result[0].bookId ))
				}
		  } catch (e) {
			console.log("Error on QUERY new  "+e)
		  }
			
			
		}
	}

	// async queryVersion(langName,versCode){
	// 	let realm = await this.getRealm();
	// 	if (realm){
	// 		try {
	// 			var result = realm.objects('BookModel').filtered('languageName ==[c] "' + langName +'"versionCode==[c] "' + versCode +'"');
	// 			// return result
	// 			if(result){

	// 				return {
	// 					downloaded:true,
						
	// 				}
	// 			}
	// 			var result1 = realm.objects('LanguageModel').filtered('languageName ==[c] "' + langName+'"');
	// 			return result1
	// 			// let result1 = realm.objects("BookModel");
	// 			// let result  = result1.filtered('chapters')
	// 			// console.log("result data"+result1)
	// 			// return result
	// 			// realm.write(() => {
	// 			// 	realm.delete(result); 
	// 			// })
			

				
				
	// 	  } catch (e) {
	// 		console.log("Error on QUERY VERSION "+e)
	// 	  }
	// 	}
	// }
}

export default new DbHelper();