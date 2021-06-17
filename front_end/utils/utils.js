import * as React from 'react';
import 'react-native-gesture-handler';
// import { createStackNavigator } from '@react-navigation/stack';
import { SearchBar } from 'react-native-elements';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';
// import MediaQuery from "react-responsive";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import io from "socket.io-client";



import Profile from './profile'
import Setting from './setting'
import Archive from './archive'
import Room    from './room'
import CreateRoom from './createRoom'



export class NavigationFooter extends React.Component{
    constructor(props) {
      super(props);
      this.state = {};
      this.init();
    }
  
    init(){
      console.log("starting socket.io .....,");
      this.isSocketVerified = false;
      this.isSocketConnected = false;
  
      // ------------------------------  ソケット通信をユーザーでログインしてVerifyする  --------------------------------
  
      this.state.newRoomName = "none"; 
      this.state.newRoomIcon = "null";
      this.state.newRoomType = "open";
    }
  
    render(){
      const ButtonStyle = {
        width:60,
        height:60,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        margin:15,
        
        backgroundColor: '#5555ff', 
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2
      };

      const Tab = createMaterialBottomTabNavigator();

    // return (
    // <Tab.Navigator
    //     screenOptions={({route}) => ({tabBarIcon:({color,size}) => {
    //       size=25
    //       if (route.name === 'OpenRoom') {
    //         var iconName="university"
    //       } else if (route.name === 'Room') {
    //         iconName = "comment"
    //       } else if (route.name === 'Setting') {
    //         iconName = "cog"
    //       } else if (route.name === 'Profile') {
    //         iconName = "user"
    //       } else if (route.name === 'Setting') {
    //          iconName = "user"
    //       } 
    //       return  <Icon name={iconName} size={size} />;
    //     },
    //   })}
    //   >
    //     <Tab.Screen name="OpenRoom" component={Archive} activeColor="#e91e63"/>
    //     <Tab.Screen name="Room" component={Room} activeColor="#e91e63" options={{ tabBarBadge: 3 }}/>
    //     <Tab.Screen name="Profile" component={Profile} activeColor="#e91e63" />
    //     <Tab.Screen name="Setting" component={Setting} activeColor="#e91e63" />
    // </Tab.Navigator>
    // )

      return(
      <View style={{ backgroundColor:"#f00"}}> 
          <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity onPress={ () => {this.props.nav("OpenRoom")} } activeOpacity={0.2}>
                  <View  style={ButtonStyle}><Text>Open Room</Text></View>
              </TouchableOpacity>
  
              <TouchableOpacity onPress={() => { this.props.nav("Room", {roomid : "rid1", hSock:null})}  } activeOpacity={0.2}>
                  <View  style={ButtonStyle}><Text>Room</Text></View>
              </TouchableOpacity>
  
              <TouchableOpacity onPress={() => { this.props.nav("Profile") } } activeOpacity={0.2}>
                  <View  style={ButtonStyle}><Text>Profile</Text></View>
              </TouchableOpacity>
  
              <TouchableOpacity onPress={ () => {this.props.nav("Setting")}  } activeOpacity={0.2}>
                  <View  style={ButtonStyle}><Text>Settings</Text></View>
              </TouchableOpacity>
          </View>
      </View>
      ) 
  }
}


  