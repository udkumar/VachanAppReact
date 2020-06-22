import {StyleSheet,Dimensions} from 'react-native'
import { Icon } from 'native-base';
const width = Dimensions.get('window').width;

export const styles =(colorFile, sizeFile) =>{
    console.log("color file styling page",colorFile)
    return StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorFile.backgroundColor 
    },
    headerContainer: {
        height: 150,
    },
    drawerItem:{
        flex:1,
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:8,
        paddingVertical:12,
        borderWidth: 0.3,
        borderColor: '#d6d7da',
        backgroundColor:colorFile.backgroundColor 
    },
    headerText: {
    // padding:8,
    color: '#fff8f8',
    // textDecorationLine: 'underline',
    // lineHeight:6
    },
    customText:{
    fontSize: 18,
    textAlign: 'center',
    color:'#040404'

    },
    textStyle: {
        color: colorFile.textColor,   
        fontSize:16,
        marginLeft:4,
        alignSelf:'center'
    },
    goToLogin:{
        flexDirection:'row',alignItems:'center',justifyContent:'space-between'
    },
    loginView:{
        flexDirection:'row',padding:8,alignItems:'center',justifyContent:'center'
    },
    iconStyle:{
        color:colorFile.iconColor
    },
    iconStyleDrawer:{
        paddingRight:16,
        color:colorFile.iconColor
    },
    imageStyle:{width: 50,height: 50,alignSelf:'center',padding:8}
})
}



