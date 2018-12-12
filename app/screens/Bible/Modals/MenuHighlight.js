// import React, { Component } from 'react'
// import {
//   StyleSheet,
//   Animated,
//   View,
//   LayoutAnimation,
//   ScrollView,
//   Text,
// } from 'react-native'
// import { createResponder } from 'react-native-gesture-responder'

// const styles = StyleSheet.create({
//   container: {
//     height: '100%',
//     width: '100%',
//   },
//   draggable: {
//     height: 50,
//     width: 50,
//   },
// })

// export default class WorldMap extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       index:50,
//       x: new Animated.Value(0),
//       y: new Animated.Value(0),
//     }
//   }
//   componentWillMount() {
//     this.Responder = createResponder({
//       onStartShouldSetResponder: () => true,
//       onStartShouldSetResponderCapture: () => true,
//       onMoveShouldSetResponder: () => true,
//       onMoveShouldSetResponderCapture: () => true,
//       onResponderMove: (evt, gestureState) => {
//         this.pan(gestureState)
//       },
//       onPanResponderTerminationRequest: () => true,
//     })
//   }
//   pan = (gestureState) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
//     // this.setState({index:})
//     // const movedY = gestureState.moveY
//     // const previoudMovedY = gestureState.previousMoveY

//     const positionDisplaced =   gestureState.moveY - gestureState.previousMoveY
//     console.log("gesture responder "+positionDisplaced)
//     console.log("gesture responder state "+JSON.stringify(gestureState))

//     this.setState({index:this.state.index + positionDisplaced})
//   }
    
//   render() {
//     const {
//       x, y,
//     } = this.state
//     const imageStyle = { left: x, top: y }

//     return (
//       <View
//         style={styles.container}
//       >
//         {/* <Animated.Image
//           source={require('../../../assets/ic_autographa_go_splash.png')}
//           {...this.Responder}
//           resizeMode={'contain'}
//           style={[styles.draggable, imageStyle]}
//         /> */}
//         <Animated.View
//          {...this.Responder}
//         style={{height:this.state.index,width:'100%',backgroundColor:'pink',bottom:0,position:'absolute'}}
//         />
//           {/* <ScrollView>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>

//             <Text>sdjhfglsjhd ;kjdhfks fgjkhfdjk</Text>
//           </ScrollView> */}
//     </View>

//     )
//   }
// }


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text} from 'react-native'
import USFMParser from './app/utils/USFMParser';
  

export default class MyMenu extends Component {
  componentDidMount(){
    const USFMFile = new USFMParser()
    USFMFile.parseFile()
  }
  render() {
    return(
    <Text>HI</Text>
    )
  }
}

