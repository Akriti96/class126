import *as React from "react"
import {View,Button,Text,Platform} from "react-native"
import Picker from "./screens/camera"
export default class App extends  React.Component{
    render(){
        return(
            <View>
           <Picker/>
            </View>
        )
    }
}