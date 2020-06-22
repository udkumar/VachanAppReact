import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
    modalContainer:{
        backgroundColor:colorFile.backgroundColor,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
            
    },
    accordionHeader:{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor:colorFile.backgroundColor,
        },
        accordionHeaderText:{
            color:colorFile.textColor,
            fontWeight: "600" 
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
        // backgroundColor:'#3E4095',
        flexDirection:'row',
        justifyContent:'center'

    },
    bottomOption:{
        flexDirection:'row',
        width:width/3,
        justifyContent:'center',
        alignItems:'center',
       
    },
 
     
    bottomOptionText:{
        textAlign:'center',
        color:'white',   
        fontSize:16

    },
    bottomOptionIcon:{
        alignSelf:'center',
        fontSize:16 
    },
    bottomOptionSeparator:{
        width: 1,
        backgroundColor:'white',
        marginVertical:8,
        
    },
    VerseText:{
        // fontFamily:fontfamily, 
        fontWeight:'100'
    },

    textString:{
        fontSize:sizeFile.contentText,
        color:colorFile.textColor,
        fontWeight:'normal',
        lineHeight:sizeFile.lineHeight,
        paddingVertical:4
    },
    sectionHeading:{
        fontSize:sizeFile.titleText,
        color:'#3E4095',
        fontWeight:'normal',
        lineHeight:sizeFile.lineHeight
    },
    bottomBarParallelPrevView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius: 28,
        bottom:48,
        left:8
    },
    bottomBarNextParallelView:{
        position:'absolute', 
        backgroundColor:colorFile.semiTransparentBackground,
        justifyContent:'center',
        height:40,
        width:40,
        borderRadius: 28,
        bottom:48,
        right:8
    },

    bottomBarAudioCenter:{
        borderRadius: 32, 
        margin:8, 
        position:'absolute', 
        bottom:20, 
        left:0,
        // width: 56, 
        // height: 56, 
       
        // backgroundColor: colorFile.backgroundColor,
        // backgroundColor:colorFile.semiTransparentBackground,
        backgroundColor:'rgba(63, 81, 181,0.5)',

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
        // color:colorFile.textColor
    },
    verseChapterNumber:{
        fontSize:sizeFile.titleText,
        color:colorFile.textColor,
        fontWeight:'bold'
    },
  
    verseTextSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor,
        textDecorationLine: 'underline',
    },
    verseTextNotSelectedNotHighlighted:{

    },
    verseTextNotSelectedHighlighted:{
        backgroundColor:colorFile.highlightColor
    },
    verseTextSelectedNotHighlighted:{
        textDecorationLine: 'underline',
    },
    
    addToSharefooterComponent:{

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
    })
}
