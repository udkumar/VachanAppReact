
'use strict';

import Realm from 'realm'

export default class BookmarksListModel extends Realm.Object {}
BookmarksListModel.schema = {
    name: 'BookmarksListModel',
    properties: {
        sourceId:'int',
        bookmarksBookId:'BookmarksBookId[]',
        // versionCode:'string',
        // languageName:'string',
        // bookId:'string',
        // chapterNumber:'int',
        
        // sourceId:'int',
    }
};