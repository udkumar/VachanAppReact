import Realm from 'realm'
import LanguageSchema from '../models/LanguageSchema'
import VersionSchema from '../models/VersionSchema'
import BookSchema from '../models/BookSchema'
import ChapterSchema from '../models/ChapterSchema'
import VerseSchema from '../models/VerseSchema'
import BookIntroSchema from '../models/BookIntroSchema'
import IntroOutlineContentSchema from '../models/IntroOutlineContentSchema'
import SectionHeadingSchema from '../models/SectionHeadingSchema'

var RNFS = require('react-native-fs');

class DbQueries {
    async getRealm() {
    	try {
    		return await Realm.open({
				deleteRealmIfMigrationNeeded: true, 
				path: RNFS.DocumentDirectoryPath + '/VachanOnlineApp.realm ',
				schema: [LanguageSchema, VersionSchema, BookSchema, ChapterSchema,VerseSchema,BookIntroSchema,IntroOutlineContentSchema,SectionHeadingSchema] });
    	} catch (err) {
			console.log("error "+err)
    		return null;
    	}
	}
	async addBookData(bookModel,versionModel,languageModel){
		var realm = await this.getRealm()
		if (realm) {
			var ls = realm.objectForPrimaryKey('LanguageModel', languageModel.languageCode);
            if (ls) {
				realm.write(() => {
					let languages = realm.create('LanguageSchema', {
						languageName:languageModel.languageName,
						languageCode: languageModel.languageCode,
						version:[]
					})
					languages.version.push({
						versionName:versionModel.versionName,
						versionCode: versionModel.versionCode,
						books:[]
					})
					languages.version[0].books.push(bookModel)
					// console.log("done all create"+JSON.stringify(languages.version[0].books[0].chapters))
				}
			)
			}
		}
	}
	async queryBook(){
		var realm = await this.getRealm()
		var results = realm.objects('LanguageSchema')
		if(realm){
				return results
		}
	}

}
export default new DbQueries()