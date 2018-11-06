'use strict';

import Realm from 'realm'

export default class VerseSummaryModel extends Realm.Object {}
VerseSummaryModel.schema = {
    name: 'VerseSummaryModel',
    properties: {
        text:'string',
        bold:'bool'
    }
};