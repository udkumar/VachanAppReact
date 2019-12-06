import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const styles =(colorFile, sizeFile, fontfamily) =>{
    console.log("fonts in bible page .................................>>>>>   ",fontfamily)
    return StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorFile.backgroundColor
        
    },
    verseWrapperText:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor,
        justifyContent:'center',
        
    },
    chapterList:{
        margin:16
    },
    footerComponent:{
        height:64,
        marginBottom:4
    },
    bottomBar:{
        position:'absolute', 
        bottom:0,
        width: width, 
        height: 62, 
        backgroundColor:'#3F51B5',
        flexDirection:'row',
        justifyContent:'center'

    },
    bottomOption:{
        flexDirection:'row',
        width:width/4,
        justifyContent:'center',
        alignItems:'center',
       
    },
    playButton: {
        height: 72,
        width: 72,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 72 / 2,
        alignItems: 'center',
        justifyContent: 'center',
      },
     
    bottomOptionText:{
        textAlign:'center',
        color:'white',   
        fontSize:sizeFile.bottomBarText 

    },
    bottomOptionIcon:{
        alignSelf:'center',
        fontSize:sizeFile.iconSize 
    },
    bottomOptionSeparator:{
        width: 1,
        backgroundColor:'white',
        marginVertical:8,
        
    },
    VerseText:{
        fontFamily:fontfamily, 
        fontWeight:'100'
    },
    bottomBarPrevView:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        left:0,
        width: 56, 
        height: 56, 
       
        // backgroundColor: colorFile.backgroundColor,
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center'
    },
    bottomBarNextView:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        right:0,
        width: 56, 
        height: 56, 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center'
    },
    bottomBarChevrontIcon:{ 
        alignItems:'center',
        zIndex:2, 
        alignSelf:'center',
        color:colorFile.chevronIconColor,
        fontSize: sizeFile.chevronIconSize
    },
    verseNumber:{
        fontSize:sizeFile.contentText,
        fontFamily:fontfamily,
      
    },
    verseChapterNumber:{
        fontSize:sizeFile.titleText,
        
        //fontFamily:fontfamily,fontSize:22,
    },
    verseTextSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        textDecorationLine: 'underline',
        fontFamily:fontfamily,
        fontWeight:'500',
        fontSize:sizeFile.contentText,
        
    },
    verseTextNotSelectedNotHighlighted:{
        fontFamily:fontfamily,
        fontWeight:'500',
        fontSize:sizeFile.contentText,


    },
    verseTextNotSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        fontFamily:fontfamily,
        fontWeight:'500',
        fontSize:sizeFile.contentText,

    },
    verseTextSelectedNotHighlighted:{
        textDecorationLine: 'underline',
        fontFamily:fontfamily,
        fontWeight:'500',
        fontSize:sizeFile.contentText,

    },
    addToSharefooterComponent:{

    },

    })
}
