'use strict';

import Realm from 'realm'

export default class BookIntroModel extends Realm.Object {}
BookIntroModel.schema = {
    name: 'BookIntroModel',
    properties: {
        type:'string',
        introText:{type: 'string', indexed: false},
        bold:'bool'
    }
};