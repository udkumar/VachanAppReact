const Realm = require('realm');

export default class BooksSchema extends Realm.Object {}

BooksSchema.schema = {
    name: 'BookSchema',
    properties: {
        bookId:'string',
        bookName:'string',
        chapters:'ChapterSchema[]'
    }
}