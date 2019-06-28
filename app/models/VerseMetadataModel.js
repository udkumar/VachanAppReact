'use strict';

import Realm from 'realm'

export default class VerseMetadataModel extends Realm.Object {}
VerseMetadataModel.schema = {
    name: 'VerseMetadataModel',
    properties: {
        // style:'',
        // header:'',
        // verseOwner: {type: 'linkingObjects', objectType: 'ChapterModel', property: 'verseModels' }
    }
};