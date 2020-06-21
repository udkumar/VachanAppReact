import {StyleSheet,Dimensions} from 'react-native'
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export const styles = (colorFile, sizeFile) =>{
    return StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:colorFile.backgroundColor
        },
        containerMargin:{
            margin:8,
        },
        textStyle:{
            color: colorFile.textColor,   
            fontSize:sizeFile.titleText,
            marginLeft:4,
        },
        cardItemStyle:{
            backgroundColor:colorFile.backgroundColor
        },
        cardStyle:{
             margin:16,
             padding:8
        },
        loaderStyle:{
            flex:1, 
            alignItems:'center', 
            justifyContent:'center', 
            flexDirection:'row',
            color:"#0000ff"
        },
        buttonStyle:{
            color:"#841584" 
        },
        iconStyle:{
            margin:8, 
            padding:8,
            fontSize:sizeFile.iconSize,
            color:colorFile.iconColor
        },
        textInputStyle:{
            height: 40, 
            borderColor: 'gray', 
            borderWidth: 1,
            marginVertical:8
        },
        placeholderColor:{
            color: colorFile.textColor, 
        },
        cardItemIconCustom:{
            marginHorizontal:4,
            marginVertical:4,
            color:colorFile.settingsIconColor,
            fontSize:32   
        }, 
        //login
        passwordView:{
            flexDirection:'row',
            alignItems:"center",
            justifyContent:'center',
            marginBottom: 15,
            paddingBottom: 15,
            marginHorizontal:10
          },
          loginText: {
            color: '#3740FE',
            marginTop: 25,
            textAlign: 'center'
          },
          preloader: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff'
          },
          //profile
          header:{
            backgroundColor: "#00BFFF",
            height:200,
          },
          avatar: {
            width: 130,
            height: 130,
            borderRadius: 63,
            borderWidth: 4,
            borderColor: "white",
            marginBottom:10,
            alignSelf:'center',
            // position: 'absolute',
            // marginTop:130
          },
          name:{
            fontSize:22,
            color:"#FFFFFF",
            fontWeight:'600',
          },
          body:{
            marginTop:40,
          },
          bodyContent: {
            flex: 1,
            alignItems: 'center',
            padding:30,
          },
          name:{
            fontSize:28,
            color: "#696969",
            fontWeight: "600"
          },
          info:{
            fontSize:16,
            color: "#00BFFF",
            marginTop:10
          },
          description:{
            fontSize:16,
            color: "#696969",
            marginTop:10,
            textAlign: 'center'
          },
          buttonContainer: {
            marginTop:10,
            height:45,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom:20,
            width:250,
            borderRadius:30,
            backgroundColor: "#00BFFF",
          },
          cardItemIconCustom:{
            marginHorizontal:4,
            marginVertical:4,
            color:colorFile.settingsIconColor,
            fontSize:32   
        },

        //register
          inputStyle: {
            width: '100%',
            marginBottom: 15,
            paddingBottom: 15,
            alignSelf: "center",
            borderColor: "#ccc",
            borderBottomWidth: 1
          },
          loginText: {
            color: '#3740FE',
            marginTop: 25,
            textAlign: 'center'
          },
        //reset 
              inputStyle: {
                width: '100%',
                marginBottom: 15,
                paddingBottom: 15,
                alignSelf: "center",
                borderColor: "#ccc",
                borderBottomWidth: 1
              },
            loginText: {
              color: '#3740FE',
              marginTop: 25,
              textAlign: 'center'
            }
            
})
}

