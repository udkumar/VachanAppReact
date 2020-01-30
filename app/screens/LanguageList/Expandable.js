import React, { Component } from 'react';
import { Text, StyleSheet,ScrollView,Dimensions, Modal,View,ActivityIndicator,TextInput,FlatList,LayoutAnimation,UIManager,Platform,TouchableOpacity} from 'react-native';
import {Card,ListItem,Left,Right,List} from 'native-base'
import Icon from 'react-native-vector-icons/MaterialIcons'

 const ExpandableItemComponent = ({
    onClickFunction,
    item,
    DownloadBible,
    navigateTo,
    contentType,
    styles,
    
})=>(
<View style={styles.container}>
        <List>
        <ListItem button={true} onPress={onClickFunction}>
          <Left>
          <Text style={styles.text} >{item.languageName }</Text>
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
              { item.versionModels.map((ele, index, key) => (
                <List>
                  <ListItem button={true} onPress={()=>{navigateTo(item.languageName,item.languageCode,ele.versionCode,ele.sourceId, ele.downloaded,null  )}}>
                  <Left>
                  <View style={{alignSelf:'center',marginLeft:12}}>
                    <Text style={[styles.text,{fontWeight:'bold'}]} >{ele.versionCode} </Text>
                    <Text style={[styles.text,{marginLeft:8}]} > {ele.versionName}</Text>
                  </View>
                  </Left>
                  <Right>
                  {
                    ele.downloaded == true ? 
                    <Icon style={[styles.iconStyle,{marginRight:8}]} name="check" size={24}  onPress={()=>{navigateTo(item.languageName,ele.versionCode,ele.sourceId,ele.downloaded,null)}}
                    />
                  :
                  <Icon  style={[styles.iconStyle,{marginRight:12}]} name="file-download" size={24} onPress={()=>{DownloadBible(item.languageName,ele.versionCode,index,ele.sourceId)}}/>
                  }
                </Right>
                </ListItem>
                </List>
            )) }</View>
        
          </View>
        </View>
)
export default ExpandableItemComponent