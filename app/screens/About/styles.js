import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;
import Color from '../../utils/colorConstants'

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
                // flexShrink: 1 ,
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
                color: Color.Red,
                textDecorationLine:'underline',
                fontSize:sizeFile.contentText
        },
        featureView:{
            flexDirection:'row'
        },
        TitleText:{
            paddingVertical:12,
            fontSize:sizeFile.titleText,
            // color:Color.Blue_Color,
            color:colorFile.sectionHeading,
            letterSpacing: 1.2,
            lineHeight:sizeFile.lineHeight
            // flexShrink: 1 
            // color:colorFile.textColor,
        },
        bulletIcon:{
            fontSize:26,
            color:colorFile.iconColor,
            lineHeight:sizeFile.lineHeight,

            // flexShrink: 1,
        }
    })

}