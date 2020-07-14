import {createMaterialTopTabNavigator,createSwitchNavigator,createAppContainer} from "react-navigation";
import SelectBook from '../SelectBook/'
import SelectChapter from '../SelectChapter'
import Color from '../../../utils/colorConstants'


const SelectionTabStack = createMaterialTopTabNavigator(
	{
        Books: {
            screen: SelectBook,
            navigationOptions: {
                tabBarLabel: 'Select Book',
              },
        },
        Chapters:{
            screen:SelectChapter,
            navigationOptions: {
                tabBarLabel: 'Select Chapter',
              },
        },
      
    },
    {   
        inactiveTintColor:Color.Black,
        swipeEnabled:false,
        tabBarOptions: {
            labelStyle: { fontSize: 16,margin:0,padding:0,color:Color.Blue_Color },
            
            upperCaseLabel: false,
            style: {
                borderBottomWidth:1,
                borderColor:Color.Blue_Color,
                backgroundColor:Color.White,
                height:36
            },
            indicatorStyle: {
                backgroundColor: Color.Blue_Color,
            },
        },
      
    }
	
)


const SwitchNavigator = createSwitchNavigator({
    SelectionTabStack: { screen: SelectionTabStack },
  });
  
export const SelectionTab = createAppContainer(SwitchNavigator)