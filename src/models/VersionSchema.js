const Realm = require('realm');

export default class VersionSchema extends Realm.Object {}


VersionSchema.schema = {
    name: 'VersionSchema',
    properties: {
        versionName:'int',
        versionCode: 'string',
        books:'BookSchema[]'
    }
}