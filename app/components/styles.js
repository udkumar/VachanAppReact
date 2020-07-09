import {StyleSheet,Dimensions} from 'react-native'
import Color from '../utils/colorConstants'

export const buttonstyle =(colorFile, sizeFile) =>{
    return StyleSheet.create({
        reloadButton:{
            // height:40,
            // width:120,
            // borderRadius:4,
            backgroundColor:Color.Blue_Color,
            // margin:0
        },
        reloadText:{
            textAlign:'center',
            fontSize:18,
            color:Color.White
        },
        buttonContainer:{
            flex:1,
            justifyContent:'center',
            alignItems:'center'
        },
        

    })
}