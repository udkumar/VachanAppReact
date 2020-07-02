import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
  Dimensions,
  ScrollView
} from 'react-native';
import packageJson from '../../../package.json'
import { aboutPage } from './styles.js'
import {connect} from 'react-redux'
const screenHeight = Dimensions.get('window').height
class About extends Component {
  static navigationOptions = {
    headerTitle: 'About',
  };
  constructor(props){
    super(props);
    this.styles = aboutPage(this.props.colorFile, this.props.sizeFile);   
  }
  render() {
    const bulletIcon = '\u2022'
    return (
      <View style={[this.styles.container,{height:screenHeight}]}> 
      <ScrollView >
      <View style={this.styles.textContainer}>
      <Text style={this.styles.textStyle}>
      <Text style={this.styles.linkText} onPress={() =>{Linking.openURL('https://VachanOnline.com')}}>VachanOnline.com </Text> 
      is the premier Bible study website in Indian languages. It is part of The Vachan Project to provide free access to digital scripture engagement resources. It is an initiative of Friends of Agape (FOA), USA. The content herein is not for reuse or redistribution in any other format or platform without explicit permission as multiple licensing strategies are involved.
      The content herein is not for reuse or redistribution in any other format or platform without explicit permission as multiple licensing strategies are involved. {'\n'}
      <Text style={this.styles.TitleText}>{'\n'}Translation Partners:{'\n'}</Text>
      Bridge Connectivity Solutions Pvt. Ltd. (BCS) and its translation/localization partners; unfoldingWord, Wycliffe Associates, Crossway, Bridgeway Publications, BibleProject, and Visual Unit are involved in localisation of content and providing licenses to use on this site.{'\n'}
      <Text style={this.styles.TitleText}>{'\n'}Technology Provider:{'\n'} </Text>
      Bridge Connectivity Solutions Pvt. Ltd. (BCS) developed this platform from scratch with the in-house team of developers inspired from similar websites in other countries. VachanEngine is the back-end of this. Vachan APIs for permissions for digital content delivery can be made available for many products please contact us at <Text style={this.styles.linkText} onPress={() =>{Linking.openURL('thevachanproject@gmail.com')}}>thevachanproject@gmail.com</Text> Also visit our company website <Text style={this.styles.linkText} onPress={() =>{Linking.openURL('www.bridgeconn.com')}}>www.bridgeconn.com </Text>{'\n'}
      <Text style={this.styles.TitleText}>{'\n'}Source Code{'\n'}</Text>
      Current Code On GitHub: {'\n'}
      <Text style={this.styles.linkText} onPress={() =>{Linking.openURL('https://github.com/Bridgeconn/VachanOnline-v2')}}>https://github.com/Bridgeconn/VachanOnline-v2{'\n'}</Text> 
      Previous versions Forked from Digital Bible Society’s Browser Bible-3 (InScript) by John Dyer on GitHub.
      <Text style={{fontWeight:'bold'}}>{'\n'}Release Notes (1/06/2020) v1.0 {'\n'}</Text>
    <Text style={this.styles.TitleText}>{'\n'}Platform Update:{'\n'}</Text>We are making a major technology change in this release. Code from Browser Bible-3 (InScript) is now replaced with a brand new web application in ReactJS powered by Postgres APIs (VachanEngine) in the back-end. A companion mobile app written in ReactNative is also being released. The older legacy site will still be available for sometime on <Text  style={this.styles.linkText} onPress={() =>{Linking.openURL('www.vachanonline.net')}}>www.vachanonline.net {'\n'} </Text>
    <Text  style={this.styles.TitleText}>{'\n'}Content Additions (using Vachan API’s):{'\n'}</Text> 
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Bibles: Updated versions of IRV Bibles in available Indian Gateway Languages.{'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Commentary: Hindi IRV Notes + Bridgeway Bible Commentary (English) + ESV Global Study Bible Notes (English).{'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Dictionary: Hindi IRV Dictionary.{'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Infographics: VisualUnit - Hindi. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Audio: Hindi IRV NT Bible. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Video: BibleProject - English + Hindi + Telugu. {'\n'}
    <Text style={this.styles.TitleText}>{'\n'}Feature Additions:{'\n'}</Text> 
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text> Cleaner Bible reading pane with section-headings. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Parallel 2-pane feature to display Bibles and other content. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Added Commentary, Dictionary, & Infographics. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Added Audio Player. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Embedded YouTube Video Player. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Personalisation and sync using simple login. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Bookmarks, Highlights & Notes. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Simple Bible search. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Changed website colors. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Dynamic Data powered by VachanEngine. {'\n'}
    <Text style={this.styles.TitleText}>{'\n'}Operations Update:{'\n'}</Text>
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Added DigitalOcean Spaces with CDN to serve Audio & Video. {'\n'}
    <Text style={this.styles.bulletIcon}>{'\u2022' + " "}</Text>  Added Firebase for personalisation and synchronisation. {'\n'}
    </Text>
    </View>
    </ScrollView>
    </View>
    );
  }
}
const mapStateToProps = state =>{
  return{
    sizeFile:state.updateStyling.sizeFile,
    colorFile:state.updateStyling.colorFile,
  }
}

export  default connect(mapStateToProps,null)(About)
