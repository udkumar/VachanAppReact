'use strict';

import Realm from 'realm'

export default class ChapterSummaryModel extends Realm.Object {}
ChapterSummaryModel.schema = {
    name: 'ChapterSummaryModel',
    properties: {
        text:'string',
        bold:'bool'
    }
};