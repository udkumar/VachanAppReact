


'use strict';

import Realm from 'realm'

export default class BookmarksBookId extends Realm.Object {}
BookmarksBookId.schema = {
    name: 'BookmarksBookId',
    properties: {
        bookId:'string',
        chapterNumber:'int?[]'
    }
};