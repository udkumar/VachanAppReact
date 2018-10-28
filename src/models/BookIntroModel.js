'use strict';

import Realm from 'realm'

export default class BookIntroModel extends Realm.Object {}
BookIntroModel.schema = {
    name: 'BookIntroModel',
    properties: {
        type:'string',
        introText:{text: 'string', indexed: false,bold:'bool'},
    }
};