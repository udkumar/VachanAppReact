import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;

export const aboutPage =(colorFile, sizeFile) =>{
    return StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:colorFile.backgroundColor,
        },
        textStyle:{
                fontSize:sizeFile.contentText,
                color:colorFile.textColor,
                lineHeight:sizeFile.lineHeight,
                flexShrink: 1 
        },
        textContainer:{
            margin:16,
            padding:8
        },
        featureList:{
            fontSize:sizeFile.contentText,
            color:colorFile.textColor,
            fontWeight:"bold"
        },
        italicText:{
            fontWeight:'bold',fontStyle:'italic'
        },
        boldText:{
            fontWeight:"bold"
        },
        linkText:{
                color: 'red',
                textDecorationLine:'underline',
                fontSize:sizeFile.contentText
        },
        featureView:{
            flexDirection:'row'
        },
        TitleText:{
            paddingVertical:12,
            fontSize:sizeFile.titleText,
            color:'#3E4095',
            letterSpacing: 1.2,
            flexShrink: 1 
            // color:colorFile.textColor,
        },
        bulletIcon:{
            fontSize:26,
            color:colorFile.iconColor,
            flexShrink: 1 

        }
    })

}