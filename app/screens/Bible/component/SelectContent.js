import React, { useState,useEffect} from 'react';
import {Modal, Text,TouchableOpacity,Dimensions,LayoutAnimation,FlatList, View, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Card,CardItem,Content,Body,List,ListItem,Left,Right,} from 'native-base'
import Orientation from 'react-native-orientation';
import {styles} from '../../LanguageList/styles'
import APIFetch from '../../../utils/APIFetch'
import {updateCommentary} from '../../../store/action/'
import {connect} from 'react-redux';

var contentList = [
  {content:"Commentary",contentVersion:[1,2,3,4,5]},
  {content:"Infographics",contentVersion:[1,2,3,4,5]},
  {content:"Dictionary",contentVersion:[1,2,3,4,5]}
]

const ExpandableItemComponent = ({
  visible,
  index,
  item,
  navigation,
  updateLayout
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
                  <Text style={[styles.text,{marginLeft:8}]} > {ele}</Text>
                </View>
                </Left>
              </TouchableOpacity>
              </ListItem>
              </List>
          )) }</View>
      
        </View>
      </View>
)
const SelectContent = ({visible,navStyles,navigation,updateCommentary})=>{

  const [list, updateList] = useState(contentList);

  const updateLayout = (index)=>{
      console.log("index ",list[index]["content"])
      console.log("index value ",list["content"])

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let responseay = [...list];
    responseay[index]['isExpanded'] = !responseay[index]['isExpanded'];
    console.log("response array  ",responseay )
    updateList(responseay)
  }

    useEffect(async()=>{
      updateLayout
      try{
        const value = await APIFetch.getAvailableCommentary()
        console.log("value ",value.commentaries.name)
        updateList({content:"Commentary",contentVersion:value.commentaries.name})
        updateCommentary(value.commentaries.sourceId)
      }
      catch(error ){
        console.log('erorr commentary ',error)
      }
    
    },[])
  return(
  <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View  style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          }}>
          <View style={{height:'80%',width:'70%'}}>
          <Card>
          <FlatList
          data={list}
          renderItem={({item, index, separators}) =><ExpandableItemComponent visible={visible}index={index} item={item} navigation={navigation} updateLayout={updateLayout}/>}
          />
          </Card>
          </View>
          </View>
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


const mapDispatchToProps = dispatch =>{
  return {
    updateCommentary:(id) =>dispatch(updateCommentary(content)),
  }
}

export  default connect(null,mapDispatchToProps) (SelectContent) 

// export default SelectContent