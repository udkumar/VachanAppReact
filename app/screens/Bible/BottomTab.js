

import React, { Component } from 'react';


import BottomTabNav from './Navigate/BottomTabStack'

export default class BottomTab extends Component {
    constructor(props){
        super(props)
    }
    render() {
        console.log("props value in bottom tabs"+this.props)
        return (
            <BottomTabNav 
            screenProps={{
                colorFile:this.props.colorFile,
                sizeFile:this.props.sizeFile,
                currentVisibleChapter:this.props.currentVisibleChapter,
                bookId:this.props.currentVisibleChapter
            }}
            />
        )
      }
      
}
