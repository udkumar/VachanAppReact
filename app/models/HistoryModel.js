import Realm from 'realm'

export default class HistoryModel extends Realm.Object {}
HistoryModel.schema = {
    name: 'HistoryModel',
    properties: {
    	languageName: 'string',
    	versionCode: 'string',
        bookId: 'string',
        chapterNumber:'int',
        time:'date'
    }
};