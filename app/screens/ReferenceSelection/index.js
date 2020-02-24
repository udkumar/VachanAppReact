import React, { Component } from 'react';
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';
import {SelectionTab} from './routes/';

export default class ReferenceSelection extends Component {
    constructor(props){
        super(props)
    }
    navigateBack = ()=>{
        this.props.navigation.goBack()
    }
    getCurrentRouteName = (currentState)=>{
        console.log("current route name ",currentState)
    }
  
    componentWillUnmount(){
        this.props.navigation.state.params.getReference()
    }
    render(){
        return(
            <SelectionTab
                screenProps={{
                    navigateBack:this.navigateBack,
                    parallelBible:this.props.navigation.state.params ? (this.props.navigation.state.params.parallelBible ? true : false) : null,
                }}
            />
        )
    }
}

