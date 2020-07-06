import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Color from '../../utils/colorConstants'

export const styles =(colorFile, sizeFile) =>{
    // console.log("color file ",colorFile,sizeFile)
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
    sectionHeading:{
        fontSize:sizeFile.contentText + 1,
        color:colorFile.sectionHeading,
        fontWeight:'normal',
        lineHeight:sizeFile.lineHeight,
        paddingVertical:4
    },
    textString:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor,
        fontWeight:'normal',
        lineHeight:sizeFile.lineHeight
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
        backgroundColor:Color.Blue_Color,
        flexDirection:'row',
        justifyContent:'center'

    },
    bottomOption:{
        flexDirection:'row',
        width:width/3,
        justifyContent:'center',
        alignItems:'center',
       
    },
    playButton: {
        height: 72,
        width: 72,
        borderWidth: 1,
        borderColor: Color.Gray,
        borderRadius: 72 / 2,
        alignItems: 'center',
        justifyContent: 'center',
      },
     
    bottomOptionText:{
        textAlign:'center',
        color:Color.White,   
        fontSize:sizeFile.bottomBarText 

    },
    bottomOptionIcon:{
        alignSelf:'center',
        fontSize:16 
    },
    bottomOptionSeparator:{
        width: 1,
        backgroundColor:Color.White,
        marginVertical:8,
        
    },
    VerseText:{
        // fontFamily:fontfamily, 
        fontWeight:'100'
    },
    bottomBarParallelPrevView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius: 28,
        bottom:36,
        left:8
    },
    bottomBarPrevView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:56,
        width:56,
        borderRadius:32,
        margin:8,
        bottom:20,
        left:0
        
    },
    bottomBarNextParallelView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius: 28,
        bottom:36,
        right:8
    },

    bottomBarNextView:{
        height:56,
        width:56,
        borderRadius:32,
        margin:8,
        bottom:20,
        right:0,
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center'
    },
    audiocontainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'#3F51B5'
        // paddingTop: 8,
      },
      controlerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'#3F51B5'
        // paddingTop: 8,
      },
      iconStyle:{
        color:colorFile.chevronIconColor,
        fontSize: sizeFile.chevronIconSize
    },
    playButton: {
        height:56,
        width: 56,
        // borderWidth: 1,
        // borderColor: '#fff',
        // borderRadius: 32,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      },
    bottomBarAudioCenter:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        // left:0,
        // width: 56, 
        // height: 56, 
        // backgroundColor: colorFile.backgroundColor,
        backgroundColor:colorFile.semiTransparentBackground,
        // backgroundColor:'rgba(63, 81, 181,0.5)',
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
        color:colorFile.textColor,
        fontWeight:'normal',
    },
    verseChapterNumber:{
        fontSize:sizeFile.titleText,
        color:colorFile.textColor,
        fontWeight:'bold'
    },
    verseTextSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        textDecorationLine: 'underline',
        lineHeight:sizeFile.lineHeight
    },
    verseTextNotSelectedNotHighlighted:{
        lineHeight: sizeFile.lineHeight
    },
    verseTextNotSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        lineHeight: sizeFile.lineHeight
    },
    verseTextSelectedNotHighlighted:{
        textDecorationLine: 'underline',
        lineHeight: sizeFile.lineHeight
    },
    textStyle:{
        color:colorFile.textColor,
        fontSize:sizeFile.contentText,  
    },
    textListFooter:{
        color:colorFile.textColor,
        fontSize:sizeFile.contentText-2,
        textAlign:'center',
        paddingVertical:2
    },
    addToSharefooterComponent:{
        // height: 60, 
        // position:'absolute',
        // bottom:0,
        // padding:12,
        margin:16,
        marginBottom:60,
        justifyContent:'center',
        alignItems:'center',
    },
    
    footerText:{
        fontWeight:'bold'
    },
    IconFloatingStyle:{
        position: 'absolute',
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        padding:8,
        top: 10,
      },
    singleView:{flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    parallelView:{flex:1,
        width:'50%',
        borderLeftWidth: 1,  
        borderLeftColor: Color.Gray
    },
    reloadButton:{
        height:40,
        width:120,
        borderRadius:4,
        backgroundColor:Color.Blue_Color,
        justifyContent:'center',
        alignSelf:'center'
    },
    reloadText:{
        textAlign:'center',
        fontSize:18,
        color:Color.White
    }
    })
}
