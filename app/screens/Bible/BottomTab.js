

import React, { Component } from 'react';


import BottomTabNav from './Navigate/BottomTabStack'

export default class BottomTab extends Component {
    constructor(props){
        super(props)
        this.state = {
            close: this.props.close
        }
    }
    
    render() {
        return (
            <BottomTabNav 
                screenProps={{
                    colorFile:this.props.colorFile,
                    sizeFile:this.props.sizeFile,
                    currentVisibleChapter:this.props.currentVisibleChapter,
                    languageCode:this.props.languageCode,
                    versionCode:this.props.versionCode,
                    currentVisibleChapter:this.props.currentVisibleChapter,
                    bookId:this.props.bookId,
                    close:this.props.close,
                    closeSplitScreen:this.props.closeSplitScreen,
                    HightlightedVerseArray:this.props.HightlightedVerseArray,
                    removeHighlight:this.props.removeHighlight,
                    bookmarksList:this.props.bookmarksList,
                    onBookmarkRemove:this.props.onBookmarkRemove
                }}
            />
        )
      }
      
}
