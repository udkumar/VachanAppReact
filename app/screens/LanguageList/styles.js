import {StyleSheet,Dimensions} from 'react-native'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
import Color from '../../utils/colorConstants'

export const styles =(colorFile, sizeFile) =>{
  // console.log("font in style page....."+ JSON.stringify(fontfamily))
    return StyleSheet.create({
    MainContainer :{
    flex:1,
    backgroundColor:colorFile.backgroundColor
    },
    container:{
        // margin:8,
        backgroundColor:colorFile.backgroundColor
    },
    rowViewContainer: {
      fontSize: 17,
      padding: 4
     },
    
     TextInputStyleClass:{
      position:'absolute',
      top:0,
      textAlign: 'center',
      height: 40,

      borderWidth: 1,
      borderColor: '#009688',
      borderRadius: 7 ,
      backgroundColor :Color.White
           
      },
      overlay:{
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.5,
        backgroundColor:Color.Black,
        width: width , 
        height: 360
      },
      header: {
        flexDirection:"row",
        padding: 6,
        paddingHorizontal:10,
        justifyContent:'space-between',
        backgroundColor:colorFile.backgroundColor
      },
      iconStyleSelection:{
        color:colorFile.iconColor
      },
      headerText: {
        fontSize: 16,
        color:colorFile.textColor
        // fontWeight: '500',
        // alignItems:'flex-start'
      },
      iconStyle:{
        fontSize:sizeFile.iconSize,
        color:colorFile.iconColor
        // alignItems:'flex-end'
      },
      separator: {
        height: 0.5,
        backgroundColor: Color.Gray,
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
      },
      text: {
        fontSize: 16,
        color: colorFile.textColor,
        
        // paddingLeft:10
       // fontFamily:fontfamily
      },
      content: {
        paddingHorizontal:20,
        paddingVertical:10,
        // paddingLeft: 20,
        // paddingRight: 20,
        flexDirection:"row",
        justifyContent:'space-between',
        backgroundColor:colorFile.backgroundColor
      },

      //selectioncontent 
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
        headerInner:{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center" ,
          backgroundColor:colorFile.backgroundColor
           },
        selectionHeaderModal:{
          color:colorFile.textColor,
          fontWeight:'600'
        },
        selectionInnerContent:{
          padding: 10,
          backgroundColor:colorFile.backgroundColor,
          // color:colorFile.textColor,
        }
   })

}