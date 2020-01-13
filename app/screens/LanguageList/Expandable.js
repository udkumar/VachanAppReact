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
            {/*Content under the header of the Expandable List Item*/}
            {item.versionModels.map((item, index, key) => (
                <List>
                  <ListItem button={true} onPress={()=>{navigateTo(item.languageName,item.languageCode,item.versionCode,item.sourceId, item.downloaded  )}}>
                  <Left>
                  <View style={{alignSelf:'center',marginLeft:12}}>
                    <Text style={[styles.text,{fontWeight:'bold'}]} >{item.versionCode} </Text>
                    <Text style={[styles.text,{marginLeft:8}]} > {item.versionName}</Text>
                  </View>
                  </Left>
                  <Right>
                  {
                    contentType  == 'bible' && 
                    item.downloaded == true ? 
                    <Icon style={[styles.iconStyle,{marginRight:8}]} name="check" size={24}  onPress={()=>{navigateTo(item.languageName,item.versionCode,item.sourceId,item.downloaded)}}
                    />
                  :
                  <Icon  style={[styles.iconStyle,{marginRight:12}]} name="file-download" size={24} onPress={()=>{DownloadBible(item.languageName,item.versionCode,index,item.sourceId)}}/>
                  }
                </Right>
                </ListItem>
                </List>
            ))}
          </View>
  
        </View>
)
export default ExpandableItemComponent