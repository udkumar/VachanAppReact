import Realm from 'realm'
import LanguageSchema from '../models/LanguageSchema'
import VersionSchema from '../models/VersionSchema'
import BookSchema from '../models/BookSchema'
import ChapterSchema from '../models/ChapterSchema'
import VerseSchema from '../models/VerseSchema'
var RNFS = require('react-native-fs');

class DbQueries {
    async getRealm() {
    	try {
    		return await Realm.open({
				deleteRealmIfMigrationNeeded: true, 
				path: RNFS.DocumentDirectoryPath + 'vachanOnline.realm ',
				schema: [LanguageSchema, VersionSchema, BookSchema, ChapterSchema,VerseSchema] });
    	} catch (err) {
    		return null;
    	}
	}
	addBookData(){
		var realm = this.getRealm()
		console.log("hello db queries ")

	}
    
}
export default new DbQueries()