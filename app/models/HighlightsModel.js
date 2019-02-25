'use strict';

import Realm from 'realm'

export default class HighlightsModel extends Realm.Object {}
    HighlightsModel.schema = {
    name: 'HighlightsModel',
    properties: {
        bookId:'string',
        chapterNumber:'int',
        verseNumber:'string',
        versionCode:'string',
        languageCode:'string'
    }
}