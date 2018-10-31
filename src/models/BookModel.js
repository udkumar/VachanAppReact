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
      BookIntroModels:'BookIntroModel[]',

      bookOwner: {type: 'linkingObjects', objectType: 'VersionModel', property:'bookModels' }
    }
};