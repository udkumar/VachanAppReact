const Realm = require('realm');

export default class LanguageSchema extends Realm.Object {}


LanguageSchema.schema = {
    name: 'LanguageSchema',
    properties: {
        languageName:'int',
        languageCode: 'string',
        version:'VersionSchema[]'
    }
}