'use strict';

import Realm from 'realm'

export default class VerseMetadataModel extends Realm.Object {}
VerseMetadataModel.schema = {
    name: 'VerseMetadataModel',
    properties: {
        styling:{type: 'string?[]'},
        VerseMetadataOwner: {type: 'linkingObjects', objectType: 'VerseModel', property: 'metadata' }
    }
};