'use strict';

import Realm from 'realm'
export default class VersionModel extends Realm.Object {}
VersionModel.schema = {
    name: 'VersionModel',
    properties: {
		sourceId:'int',
    	versionName: 'string',
		versionCode: 'string',
		metaData:'LanguageMetaData[]',
		downloaded:'bool',
		bookNameList:'bookNameList[]',
        versionOwner: {type: 'linkingObjects', objectType: 'LanguageModel', property: 'versionModels' }
    }
};

