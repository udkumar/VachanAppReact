import Realm from 'realm'
import LanguageSchema from '../models/LanguageSchema'
import VersionSchema from '../models/VersionSchema'
import BookSchema from '../models/BookSchema'
import ChapterSchema from '../models/ChapterSchema'
import VerseSchema from '../models/VerseSchema'
var RNFS = require('react-native-fs');

class DbHelper {
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
	async addBook(bookModel,VersionModel,languageModel){
        var realm = await this.getRealm()
		if (realm) {
			realm.write(() => {
				realm.create('LanguageSchema', languageModel)
				realm.create('VersionSchema', VersionModel);
				realm.create('BookSchema', bookModel)

			});
        }
	}
	queryBook(){
		
	}
}
export default new DbHelper()