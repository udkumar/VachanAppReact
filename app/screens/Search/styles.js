import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;

export const searchStyle =(colorFile, sizeFile) =>{
    return StyleSheet.create({
        container:{
            backgroundColor:colorFile.backgroundColor,
            // margin:8,
            flex:1
        },
        ListEmptyContainer:{
            alignSelf:'center'
        },
        searchedDataContainer:{
            margin:8,
            backgroundColor:colorFile.backgroundColor
        },
        headerStyle:{
            paddingLeft:16,
            fontSize:sizeFile.titleText,
            color:colorFile.textColor
        },
        toggleBible:{
            fontSize:sizeFile.titleText,
            paddingRight:16,
            color:'#3740FE'
        },
        toggleBibleTouchable:{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            paddingVertical:12,
            margin:8,
            backgroundColor:colorFile.fedBackgroundColor
        },
        searchedData:{
            padding:4,
            borderBottomColor: 'silver',
            borderBottomWidth: 0.5,
            margin:4,
            fontSize:sizeFile.titleText,
            color:colorFile.textColor
          },
        textStyle:{
            margin:8,
            fontSize:sizeFile.contentText,
            color : colorFile.textColor
        },
        textLength:{
            alignSelf:"center",
            color:colorFile.textColor,
            fontSize:sizeFile.contentText,
            // justifyContent:'center',
            // alignItems:'center'
        },
        headerText:{
            width:width,
            color:colorFile.textColor
        },
        placeholderColor:{
            color:colorFile.textColor
        }
    })
}