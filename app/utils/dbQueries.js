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
    queryBookWithId(verCode: string, langName: string, bookId: string) {
        return DbHelper.queryBooksWithCode(verCode, langName, bookId);
    }
    querySearchBookWithName(verCode: string, langName: string, text: string) {
        return DbHelper.queryBooksWithCode(verCode, langName, text);
    }
    querySearchVerse(verCode: string, langName: string, text: string) {
        return DbHelper.queryInVerseText(verCode, langName, text);
    }
    queryHighlights(sourceId, bookId, cNum) {
        return DbHelper.queryHighlights(sourceId, bookId, cNum);
    }
    insert(model, value) {
        DbHelper.insert(model, value);
    }
    addNewVersion(langName, versCode, bookModels, sourceId) {
        DbHelper.addNewVersion(langName, versCode, bookModels, sourceId)
    }

    updateHighlightsInVerse(sourceId, bookId, chapterNumber, verseNumber, isHighlight) {
        DbHelper.updateHighlightsInVerse(sourceId, bookId, chapterNumber, verseNumber, isHighlight);
    }
    updateBookmarkInBook(sourceId, bId, chapterNumber, isBookmark) {
        DbHelper.updateBookmarkInBook(sourceId, bId, chapterNumber, isBookmark);
    }
    queryBookmark(sourceId, bId) {
        return DbHelper.queryBookmark(sourceId, bId);
    }
    deleteBookmark() {
        return DbHelper.deleteBookmark();
    }
    queryBookIdModels(verCode: string, langName: string) {
        return DbHelper.queryBookIdModels(verCode, langName);
    }
    queryNotes() {
        return DbHelper.queryNotes();
    }
    addOrUpdateNote(index, body, createdTime, modifiedTime, refList) {
        return DbHelper.addOrUpdateNote(index, body, createdTime, modifiedTime, refList);
    }
    notesCharStyle(charIndex) {
        DbHelper.notesCharStyle(charIndex)
    }
    deleteNote(time) {
        DbHelper.deleteNote(time);
    }
    addHistory(sourceId, langName, languageCode, verCode, bookId, bookName, chapterNumber, downloaded, time) {
        DbHelper.addHistory(sourceId, langName, languageCode, verCode, bookId, bookName, chapterNumber, downloaded, time)
    }
    queryHistory() {
        return DbHelper.queryHistory();
    }
    getVersionMetaData(langName,verCode,sourceId){
      return  DbHelper.getVersionMetaData(langName,verCode,sourceId)
    }
    clearHistory() {
        DbHelper.clearHistory()
    }
    deleteBibleVersion(langName, verCode, sourceId, downloaded) {
        DbHelper.deleteBibleVersion(langName, verCode, sourceId, downloaded)
    }
    // add list of languages to db
    addLangaugeList(lang, books) {
        DbHelper.addLangaugeList(lang, books)
    }
    getLangaugeList() {
        return DbHelper.getLangaugeList()
    }
    queryVersions(lang, ver, bookId) {
        return DbHelper.queryVersions(lang, ver, bookId)
    }
    queryTextForNote(lang, ver, bookId, chapterNumber, verseNumber) {
        return DbHelper.queryTextForNote(lang, ver, bookId, chapterNumber, verseNumber)
    }
    queryBook(lang, ver, bookId) {
        return DbHelper.queryBook(lang, ver, bookId)
    }
    getDownloadedBook(lang) {
        return DbHelper.getDownloadedBook(lang)
    }

}

export default new DbQueries();