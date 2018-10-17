const Realm = require('realm');

export default class BookIntroSchema extends Realm.Object {}


BookIntroSchema.schema = {
    name: 'BookIntroSchema',
    properties: {
       introSecHeader:'string',
       introParagraph:'string',
    }
}