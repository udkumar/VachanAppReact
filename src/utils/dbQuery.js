import Realm from 'realm'
import LanguageSchema from './models/LanguageSchema'
import VersionSchema from '../models/VersionSchema'
import BookSchema from '../models/BookSchema'
import ChapterSchema from '../models/ChapterSchema'
import VerseSchema from '../models/VerseSchema'
import ParseUSFMFile from './ParseUSFMFile'
var RNFS = require('react-native-fs');

class DbQuery {
    async getRealm() {
    	try {
    		return await Realm.open({
				schemaVersion: 1,
				deleteRealmIfMigrationNeeded: true, 
				path: RNFS.DocumentDirectoryPath + 'vachanOnline.realm ',
				schema: [LanguageSchema, VersionSchema, BookSchema, ChapterSchema,VerseSchema] });
    	} catch (err) {
    		return null;
    	}
    }
    addData(langC,verC,book,chap,verse){
		var realm = this.getRealm()
		
		
    }
}
export default new DbQuery