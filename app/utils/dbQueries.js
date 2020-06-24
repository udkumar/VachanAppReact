import DbHelper from './dbHelper';
import dbHelper from './dbHelper';

class DbQueries {

    queryLanguages() {
        return DbHelper.query('LanguageModel', null, 'languageName', false);
    }

    queryLanguageWithCode(code: string) {
        return DbHelper.query('LanguageModel', 'languageCode ==[c] "' + code + '"');
    }

    queryVersionWithCode(verCode: string, langName: string) {
        return DbHelper.queryVersionWithCode(verCode, langName);
    }

    queryBooks(verCode: string, langName: string) {
        return DbHelper.queryBooksWithCode(verCode, langName);
    }

    queryBookWithId(verCode: string, langName: string,bookId: string) {
        return DbHelper.queryBooksWithCode(verCode, langName, bookId);
    }

    querySearchBookWithName(verCode: string, langName: string, text: string) {
        return DbHelper.queryBooksWithCode(verCode, langName, text);        
    }

    querySearchVerse(verCode: string, langName: string, text: string) {
        return DbHelper.queryInVerseText(verCode, langName, text);
    }
    //for api data 
    queryHighlights(sourceId, bookId,cNum) {
            return DbHelper.queryHighlights(sourceId, bookId,cNum);
    }

  

    insert(model, value) {
        DbHelper.insert(model, value);
    }

    // addNewBook(bookModel, versionModel, languageModel) {
    //     DbHelper.insertNewBook(bookModel, versionModel, languageModel);
    // }
    // angName,verCode,result,sourceId,bookListData
    addNewVersion(langName,versCode,bookModels,sourceId){
        DbHelper.addNewVersion(langName,versCode,bookModels,sourceId)
    }

    // queryVersion(langName,versCode){
    //     return DbHelper.queryVersion(langName,versCode)
    // }

    updateHighlightsInVerse(sourceId, bookId, chapterNumber, verseNumber, isHighlight) {
        DbHelper.updateHighlightsInVerse(sourceId, bookId, chapterNumber, verseNumber, isHighlight);
    }
    // addHighlightsInVerse(sourceId,arr){
    //     DbHelper.addHighlightsInVerse(sourceId,arr)
    // }

    updateBookmarkInBook(sourceId,bId,chapterNumber, isBookmark) {
        DbHelper.updateBookmarkInBook(sourceId,bId,chapterNumber, isBookmark);
    }
    queryBookmark(sourceId,bId){
        return DbHelper.queryBookmark(sourceId,bId);
    }
    deleteBookmark(){
        return DbHelper.deleteBookmark();

    }
  

    queryBookIdModels(verCode: string, langName: string) {
        return DbHelper.queryBookIdModels(verCode, langName);
    }

    queryNotes() {
       return DbHelper.queryNotes();
    }

    addOrUpdateNote(index, body, createdTime, modifiedTime, refList){
        return DbHelper.addOrUpdateNote(index, body, createdTime, modifiedTime, refList);
    }
    notesCharStyle(charIndex){
         DbHelper.notesCharStyle(charIndex)
    }
    
    deleteNote(time){
        DbHelper.deleteNote(time);
    }

    addHistory(sourceId,langName,languageCode, verCode, bookId, chapterNumber,downloaded, time) {
        DbHelper.addHistory(sourceId,langName,languageCode, verCode, bookId, chapterNumber,downloaded, time)
    }

    queryHistory(){
        return DbHelper.queryHistory();
    }

    clearHistory(){
        DbHelper.clearHistory()
    }

    deleteBibleVersion(lanCode, verCode,sourceId,downloaded){
        DbHelper.deleteBibleVersion(lanCode, verCode,sourceId,downloaded)
    }

    // add list of languages to db
    addLangaugeList(lang){
        DbHelper.addLangaugeList(lang)
    }
    getLangaugeList(){
       return DbHelper.getLangaugeList()
    }
    // deleteBible(){

    // }
    // updateLanguageList(lang,verCode,booklist){
    //     return DbHelper.updateLanguageList(lang,verCode,booklist)
    // }
    queryVersions(lang,ver,bookId){
       return DbHelper.queryVersions(lang,ver,bookId)
    }
    queryTextForNote(lang,ver,bookId,chapterNumber,verseNumber){
        return DbHelper.queryTextForNote(lang,ver,bookId,chapterNumber,verseNumber)
    }
    queryBook(lang,ver,bookId){
        return DbHelper.queryBook(lang,ver,bookId)
    }
    getDownloadedBook(lang,ver){
        return DbHelper.getDownloadedBook(lang,ver)
    }
    // updateLangaugeList(langName,versCode,downloaded){
    //     DbHelper.updateLangaugeList(langName,versCode,downloaded)
    // }
}

export default new DbQueries();