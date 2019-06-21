'use strict';

import Realm from 'realm'

export default class VerseModel extends Realm.Object {}
VerseModel.schema = {
    name: 'VerseModel',
    properties: {
    	verseText: {type: 'string', indexed: true},
    	VerseNumber: {type: 'string', indexed: true},
        verseOwner: {type: 'linkingObjects', objectType: 'ChapterModel', property: 'verseModels' }
    }
};