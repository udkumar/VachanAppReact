'use strict';

import Realm from 'realm'

export default class HighlightsModel extends Realm.Object {}
    HighlightsModel.schema = {
    name: 'HighlightsModel',
    properties: {
        sourceId:'int',
        highlightsBookId:'HighlightsBookId[]',
        // languageName:'string',
        // versionCode:'string',
        // bookId:'string',
        // chapterNumber:'int',
        // verseNumber:'string'
    }
}