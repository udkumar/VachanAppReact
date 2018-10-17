// all of our routes
import React, { Component } from 'react'
import {StackNavigator, TabNavigator} from 'react-navigation'

const AsyncStorageConstants = require('./AsyncStorageConstants')
import AsyncStorageUtil from './AsyncStorageUtil';
import {nightColors, dayColors, constColors} from './colors.js'
import {extraSmallFont,smallFont,mediumFont,largeFont,extraLargeFont} from './dimens.js'
import { styleFile } from './styles.js'
import DbQueries from '../utils/dbQueries'
import Realm from 'realm'


import StudyBible from '../screens/tabsNav/StudyBible'
import Audio from '../screens/tabsNav/Audio'
import Map from '../screens/tabsNav/Map'
import Bible from '../screens/tabsNav/Bible'

const  Tabs = TabNavigator({
  Bible:Bible,
  StudyBible: StudyBible,
  Audio: Audio,
  Map: Map,
},
{
    navigationOptions: {
      headerTintColor: '#fff',
      headerStyle:{
        backgroundColor:"#3F51B5"
      }
    }
}

)

export default class Tab extends Component {
render(){
  return(
    <Tabs/>
  )
}
}