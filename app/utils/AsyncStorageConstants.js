import {getBookNameFromMapping,getBookNumberFromMapping} from './UtilFunctions';


module.exports = {
    Keys: {
        ColorMode : 'color_mode',
        SizeMode: 'size_mode',
        VerseViewMode:'verse_view_mode',
        LastReadReference:'last_read_reference',
        LanguageCode:'language_code',
        VersionCode:'version_code',
        LanguageName:'language_name',
        VersionName:'version_name',
        BookId:'book_id',
        BookName:'book_name',
        BackupRestoreEmail:'backup_restore_email',
        ChapterNumber:"chapter_number",
        BookNumber:"book_number",
        versionId:'version_id'

    },
    Values: {
        DayMode: 1,
        NightMode: 0,

        SizeModeXSmall: 0,
        SizeModeSmall: 1,
        SizeModeNormal: 2,
        SizeModeLarge: 3,
        SizeModeXLarge: 4,

        VerseInLine:false,

        LastReadReference: {
            languageCode:'Hindi',
            versionCode:'IRV',
            bookId:'1JN',
            chapterNumber:1,
        },

        DefLanguageCode:'Hin',
        DefLanguageName:'Hindi',
        DefVersionCode:'IRV',
        DefVersionName:'Indian Revised Version',
        DefBookId:"1jn",
        DefBookName:getBookNameFromMapping("1jn","Hindi"),
        DefBookChapter:1,
        DefBookNumber:getBookNumberFromMapping("1jn"),
        DefSourceId:22
       
    }
}



