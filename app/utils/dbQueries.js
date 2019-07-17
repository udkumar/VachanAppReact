import DbHelper from './dbHelper';

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
        return DbHelper.queryBooksWithCode(verCode, langName, null, text);        
    }

    querySearchVerse(verCode: string, langName: string, text: string) {
        return DbHelper.queryInVerseText(verCode, langName, text);
    }
    //for api data 
    queryHighlights(langName, verCode, bookId, chapterNumber) {
            return DbHelper.queryHighlights(langName, verCode, bookId,chapterNumber);
    }

  

    insert(model, value) {
        DbHelper.insert(model, value);
    }

    // addNewBook(bookModel, versionModel, languageModel) {
    //     DbHelper.insertNewBook(bookModel, versionModel, languageModel);
    // }
    addNewVersion(langName,versCode,bookModels){
        DbHelper.addNewVersion(langName,versCode,bookModels)
    }

    // queryVersion(langName,versCode){
    //     return DbHelper.queryVersion(langName,versCode)
    // }

    updateHighlightsInVerse(LangName, verCode, bookId, chapterNumber, verseNumber, isHighlight) {
        DbHelper.updateHighlightsInVerse(LangName, verCode, bookId, chapterNumber, verseNumber, isHighlight);
    }

   
    updateBookmarkInBook(langName,verCode,bId,chapterNumber, isBookmark) {
        DbHelper.updateBookmarkInBook(langName,verCode,bId,chapterNumber, isBookmark);
    }
    queryBookmark(langName,verCode,bId){
        return DbHelper.queryBookmark(langName,verCode,bId);
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

    addHistory(langName, verCode, bookId, chapterNumber, time) {
        DbHelper.addHistory(langName, verCode, bookId, chapterNumber, time)
    }

    queryHistory(){
        return DbHelper.queryHistory();
    }

    clearHistory(){
        DbHelper.clearHistory()
    }

    deleteLanguage(lanCode, verCode){
        DbHelper.deleteLanguage(lanCode, verCode)
    }

    queryVersions() {
        return DbHelper.query('VersionModel');
    }

    // add list of languages to db
    addLangaugeList(lang,ver){
        DbHelper.addLangaugeList(lang,ver)
    }
    getLangaugeList(){
       return DbHelper.getLangaugeList()
    }
    // updateLangaugeList(langName,versCode,downloaded){
    //     DbHelper.updateLangaugeList(langName,versCode,downloaded)
    // }
}

export default new DbQueries();