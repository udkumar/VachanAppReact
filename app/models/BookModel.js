'use strict';

import Realm from 'realm'

export default class BookModel extends Realm.Object {}
BookModel.schema = {
    name: 'BookModel',
    properties: {
      bookId: 'string',
      bookName: 'string',
      bookNumber: 'int',
      section: {type: 'string', default: 'NT'},
      chapterModels: 'ChapterModel[]',
      bookmarksList: 'int?[]',
      bookIntroModels:'BookIntroModel[]',
      // bookSummerydModels:'BookSummerydModel[]',
      bookOwner: {type:'linkingObjects', objectType: 'VersionModel', property:'bookModels' }
    }
};