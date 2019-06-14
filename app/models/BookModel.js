'use strict';

import Realm from 'realm'

export default class BookModel extends Realm.Object {}
BookModel.schema = {
    name: 'BookModel',
    properties: {
      languageCode:'string',
      // languageName:'string',
      versionCode:'string',
      bookId: 'string',
      bookName: 'string',
      chapterModels: 'ChapterModel[]',
      bookmarksList: 'int?[]',
      section: {type: 'string', default: 'NT'},
      bookNumber: 'int',
      // bookOwner: {type: 'linkingObjects', objectType: 'VersionModel', property:'bookModels' }
    }
};