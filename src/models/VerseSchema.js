const Realm = require('realm');

export default class VerseSchema extends Realm.Object {}


VerseSchema.schema = {
    name: 'VerseSchema',
    properties: {
        verseNumber:'string',
        verseText: 'string'
    }
}