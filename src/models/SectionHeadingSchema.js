const Realm = require('realm');

export default class ChapterSchema extends Realm.Object {}

ChapterSchema.schema = {
    name: 'ChapterSchema',
    properties: {
        heading:'string'
    }
}