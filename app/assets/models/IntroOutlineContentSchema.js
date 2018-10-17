const Realm = require('realm');

export default class IntroOutlineContentSchema extends Realm.Object {}

IntroOutlineContentSchema.schema = {
    name: 'IntroOutlineContentSchema',
    properties: {
        IOLNumber:'string',
        content:'string'
    }
}