const Realm = require('realm');

export default class LanguageSchema extends Realm.Object {}


LanguageSchema.schema = {
    name: 'LanguageSchema',
    primaryKey: 'languageCode',
    properties: {
        languageName:'string',
        languageCode: 'string',
        version:'VersionSchema[]'
    }
}