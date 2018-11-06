'use strict';

import Realm from 'realm'

export default class BookSummerydModel extends Realm.Object {}
BookSummerydModel.schema = {
    name: 'BookSummerydModel',
    properties: {
        text:'string',
        bold:'bool'
    }
};