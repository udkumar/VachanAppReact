import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Container, Header, Content, Card,CardItem, ListItem, Left, Body, Right, Switch } from 'native-base';
import { TouchableOpacity,View,Text } from 'react-native';


const ListItems = [
    {
        iconName:"bookmark",
        screenName:"BookMarks",
        title:"BookMark",
    },
    {
        iconName:"highlight",
        screenName:"Highlights",
        title:"HighLights",
    },
    {
        iconName:"note",
        screenName:"Notes",
        title:"Notes",
    },
    {
        iconName:"history",
        screenName:"History",
        title:"History",
    },
    {
        iconName:"info",
        screenName:"About",
        title:"About",
    },
    {
        iconName:"more",
        screenName:"StudyHelp",
        title:"Study Help",
    },
    {
        iconName:"video-library",
        screenName:"Video",
        title:"Video",
    },
    {
        iconName:"library-music",
        screenName:"Audio",
        title:"Audio",
    },
    {
        iconName:"settings",
        screenName:"Settings",
        title:"Settings",
    },
]
export default class More extends Component {
  render() {
    const params = this.props.navigation.state.params
    return (
        <Container>
        <Content>
        {
            ListItems.map((item,index)=>(
                <ListItem button={true} icon onPress={()=>{this.props.navigation.navigate(item.screenName,{languageName:params.languageName,versionCode:params.versionCode,bookId:params.bookId})}}>
                <Left>
                    <Icon  size={24} name={item.iconName} />
                </Left>
                <Body>
                  <Text>{item.title} </Text>
                </Body>
                <Right>
                    <Icon size={24}  name="chevron-right" />
                </Right>
              </ListItem>
            ))
        }
        </Content>
        </Container>
    );
  }
}