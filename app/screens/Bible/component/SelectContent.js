import React, { useState,useEffect} from 'react';
import {Modal, Text,TouchableOpacity,Dimensions,LayoutAnimation,FlatList, View, Alert,TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Card,CardItem,Content,Body,List,ListItem,Left,Right,} from 'native-base'
import Orientation from 'react-native-orientation';
import {styles} from '../../LanguageList/styles'
import APIFetch from '../../../utils/APIFetch'
import {connect} from 'react-redux';
import {fetchCommentaryLanguage} from '../../../store/action/'

var contentList = [
  {content:"Commentary",contentVersion:[]},
  {content:"Infographics",contentVersion:[]},
  {content:"Dictionary",contentVersion:[]}
]

const ExpandableItemComponent = ({
  visible,
  index,
  item,
  navigation,
  updateLayout,
})=>(
<View style={styles.container}>
      <List>
      <ListItem button={true} onPress={()=>updateLayout(index)} >
        <Left>
        <Text style={styles.text} >{item.content }</Text>
        </Left>
        <Right>
          <Icon style={styles.iconStyle} name={item.isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-up" }  size={24}/>
        </Right>
        </ListItem>
        </List>
        <View
          style={{
            height:item.isExpanded ? null : 0,
            overflow: 'hidden',
          }}>
            <View style={{flex:1}}>
            { item.contentVersion.map((ele, index, key) => (
              <List>
                <ListItem button={true}>
                <TouchableOpacity 
                  onPress={()=>{navigation.setParams({modalVisible:!visible});Orientation.lockToLandscape()}} 
                  >
                <Left>
                <View style={{alignSelf:'center',marginLeft:12}}>
                  <Text style={[styles.text,{marginLeft:8}]} > {ele.name}</Text>
                </View>
                </Left>
              </TouchableOpacity>
              </ListItem>
              </List>
          )) }</View>
      
        </View>
      </View>
  )
const SelectContent = ({
  visible,
  navStyles,
  navigation,
  fetchCommentaryLanguage,
  languageCode,
  availableCommentaries
})=>{

  const [list, updateList] = useState(availableCommentaries);
  const updateLayout = (index)=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let responseay = [...list]
    responseay[index]['isExpanded'] = !responseay[index]['isExpanded']
    updateList(responseay)
  }
  useEffect(()=>{
    fetchCommentaryLanguage({languageCode:languageCode})
    console.log("Available commentary ",availableCommentaries)
    },[])
  
  return(
  <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onPress={()=>{navigation.setParams({modalVisible:false})}} 
          >
          <TouchableWithoutFeedback
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              }} 
          // activeOpacity={1} 
          onPressOut={()=>{navigation.setParams({modalVisible:false})}} 
          >
          <View style={{height:'80%',width:'70%',alignSelf:'flex-end',top:40}}>
          <Card>
          <FlatList
          data={availableCommentaries}
          renderItem={({item, index, separators}) =>
          <ExpandableItemComponent 
          visible={visible}
          index={index} 
          item={item} 
          navigation={navigation} 
          updateLayout={updateLayout}
          />
        }
          />
          </Card>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
        <TouchableOpacity  style={[navStyles.touchableStyleRight,{flexDirection:'row'}]}>
                    <Icon 
                     onPress={()=>{navigation.setParams({modalVisible:!visible})}} 
                      name='add-circle'
                      color={"#fff"} 
                      size={20} 
                  /> 
            </TouchableOpacity>
      </View>
  )
}

const mapStateToProps = state =>{
  return{
    availableCommentaries:state.commentaryFetch.availableCommentaries,
    language: state.updateVersion.language,
    languageCode:state.updateVersion.languageCode,
  }
}
const mapDispatchToProps = dispatch =>{
  return {
    fetchCommentaryLanguage:(payload)=>dispatch(fetchCommentaryLanguage(payload))
  }
}
export  default connect(mapStateToProps,mapDispatchToProps) (SelectContent) 
