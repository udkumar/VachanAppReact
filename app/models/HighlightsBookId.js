
'use strict';

import Realm from 'realm'

export default class HighlightsBookId extends Realm.Object {}
HighlightsBookId.schema = {
    name: 'HighlightsBookId',
    properties: {
        bookId:'string',
        chapterNumber:'int',
        verseNumber:'int?[]'
    }
};