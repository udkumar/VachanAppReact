import React from 'react';
import About from '../app/screens/About/About'

import { shallow ,configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

const findElement = function (tree,value){
  for(var key in tree.children.props.children){
    if(tree.children.props.children[key].props.testID == value){
      return value
    }
  }

}

describe('Testing navigation', () => {
const props = {
  screenProps:{
    colorFile:'#fff',
    sizeFile:18
  }
}
  it('should test navigation',  () => {
    const wrapper = shallow(<About {...props}/>).props();
    expect(findElement(wrapper,"check")).toBe("check");
    // console.log(JSON.stringify(wrapper.children.props.children.props))
    expect(wrapper).toMatchSnapshot()
  })
})
