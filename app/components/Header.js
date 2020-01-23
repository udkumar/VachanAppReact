import React from 'react';
import {Dimensions,StyleSheet,View,Text,TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
var { width, height } = Dimensions.get('window')


const Header = ({navigation})=>{
    const { params={} } = navigation.state 
    console.log("NAVIGATION OPTIONS ",navigation)
    return{
        headerTitle:(
          <View style={navStyles.headerLeftStyle}>
            <View style={{marginRight:10}}>
              <TouchableOpacity style={navStyles.touchableStyleLeft}  
              onPress={() =>{navigation.navigate("SelectionTab", {bookId:params.bookId,chapterNumber:params.currentChapter,totalVerses:params.totalVerses,getReference:params.callBackForUpdateBook})}}>
                <Text  style={navStyles.headerTextStyle}>{params.bookName}  {params.currentChapter }</Text>
              <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
            </View>
            <View style={{marginRight:10}}>
              <TouchableOpacity onPress={() =>{navigation.navigate("LanguageList", {callBackForUpdateBook:params.callBackForUpdateBook})}} style={navStyles.headerLeftStyle}>
                <Text style={navStyles.headerTextStyle}>{params.languageName}  {params.versionCode}</Text>
                <Icon name="arrow-drop-down" color="#fff" size={24}/>
              </TouchableOpacity>
           
            </View>
          </View>
       
      ), 
        headerTintColor:"#fff",
        headerRight:(
          <View style={navStyles.headerRightStyle}>
          {params.audio && <TouchableOpacity  onPress={params.ShowHideTextComponentView}
            style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
           <Icon 
               name='volume-up'
               size={24} 
               color={params.audio ? "#fff" : "#eee"}
           /> 
           </TouchableOpacity>
          }
              <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                <Icon 
                  onPress={()=> {params.onBookmark(params.bookId,params.currentChapter,params.isBookmark)}} 
                  name='bookmark'
                  color={params.isBookmark ? "red" : "white"} 
                  size={24} 
              /> 
             </TouchableOpacity>
          </View>
        ),
      
      
    }
    
}


    const navStyles = StyleSheet.create({

        headerLeftStyle:{
          flexDirection:'row',
          flex:1,
        },
        headerRightStyle:{
          flexDirection:'row',
          flex:1,
        },
        touchableStyleRight:{
            flexDirection:"row",
            marginRight:10
        },
        touchableStyleLeft:{
          flexDirection:"row",
            marginLeft:10,
        },
        headerTextStyle:{
            fontSize:16,
            color:"#fff",
            textAlign:'center'
        },
        })
  export default Header