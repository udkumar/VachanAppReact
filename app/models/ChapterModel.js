'use strict';

import Realm from 'realm'

export default class ChapterModel extends Realm.Object {}
ChapterModel.schema = {
    name: 'ChapterModel',
    properties: {
      chapterNumber: 'int',
      numberOfVerses: 'int',
      verseComponentsModels: 'VerseComponentsModel[]',
      // chapterSummaryModels:'ChapterSummaryModel[]',
      chapterOwner: {type: 'linkingObjects', objectType: 'BookModel', property:'chapterModels' }
    }
};