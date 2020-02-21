import React, { Component } from 'react';
import { getBookChaptersFromMapping, getBookNameFromMapping } from '../../utils/UtilFunctions';
import {SelectionTab} from './routes/';

export default class ReferenceSelection extends Component {
    constructor(props){
        super(props)
    }
    navigateBack = ()=>{
        this.props.navigation.state.params.getReference()
        this.props.navigation.goBack()
    }
    getCurrentRouteName = (currentState)=>{
        console.log("current route name ",currentState)
    }
    render(){
        return(
            <SelectionTab
                screenProps={{
                    navigateBack:this.navigateBack,
                }}
            />
        )
    }
}

