import * as React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MediaQuery from "react-responsive";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// // import * from 'ui-utils.js'  // 最終的にはこういう感じで別ファイルに分けるべき
// // npm install --save @fortawesome/fontawesome-free でアイコンフォントをインストールする必要がある
// // https://qiita.com/yasu_yyy/items/8ab627716314bdfdcb59 を参考に

// // --------------------------------------------------------------------
// // 各クラスのRender関数中で呼び出すとFooter、Headerをつけてくれる
// // --------------------------------------------------------------------

// function createFooter(navigation){
//   var footer_text_size = 10;
//   return (
//     <View style={{ position : 'absolute', left:0, right : 0, bottom:0, backgroundColor: "#FFFFFF" }}>
//     <View style={{ 
//         backgroundColor: "#FFFFFF",
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center'}}
//     >
//     <TouchableOpacity onPress={navigation.navigate("RoomArchive")} >
//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>RoomArchive</Text>
//     </TouchableOpacity>

//     {/* <TouchableOpacity onPress={navigation.navigate("Room")} > */}
//     <TouchableOpacity onPress={console.log("RoomArchive")} >

//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>Room</Text>
//     </TouchableOpacity>

//     {/* <TouchableOpacity onPress={navigation.navigate("Settings")} > */}
//     <TouchableOpacity onPress={console.log("RoomArchive")} >
//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>Settings</Text>
//     </TouchableOpacity>


//     {/* <TouchableOpacity onPress={navigation.navigate("Profile")} > */}
//     <TouchableOpacity onPress={console.log("RoomArchive")} >
//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>Profile</Text>
//     </TouchableOpacity>
//     </View>
//     </View>
//   );
// };


// --------------------------------------------------------------------
// 各画面配置（
// --------------------------------------------------------------------

class RoomArchive extends React.Component{
    render(){
      const { navigation } = this.props;
    const room_temp = [
       {name:"room1", icon:"kb.png", lastmsg:"Hello room 1", status:"ok"},
       {name:"room2", icon:"kb.png", lastmsg:"Hello room 2", status:"ok"},
       {name:"room3", icon:"kb.png", lastmsg:"Hello room 3", status:"ok"},
       {name:"room4", icon:"kb.png", lastmsg:"Hello room 4", status:"ok"},
       {name:"room5", icon:"kb.png", lastmsg:"Hello room 5", status:"ok"},
    ];
    var room_list_ui = [];

   var room_inner_text_2 = {
      margin:0,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexDirection:'row',
      flex: 1,
  };

    room_temp.forEach(function(room, index){
        room_list_ui.push(
        //特定のルームに移動する頃はできていないので調整必要
          <TouchableOpacity onPress={() => { navigation.navigate("Room"); }} style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Image source={room.icon} style={{ width: 50, height: 50 }} />
            <View style={styles.room_inner_text_1_TD} >
              <Text style={{ fontSize: 16 }}>{room.name}</Text>
              <Text style={{ fontSize: 10 }}>{room.lastmsg}</Text>
            </View>
          </TouchableOpacity >
        )
    })

    return( 
        <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
          {room_list_ui}
        </ScrollView>);
    }
}

class Room extends React.Component{
    render(){
    return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text> Chat rooooo〜〜〜m!!</Text>
    </View>
    );
}
}

class Settings extends React.Component{
    render(){
    return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text> Setteing !!!!</Text>
    </View>
    );
    }
}

class Profile extends React.Component{
    render(){
   return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is Profile Component</Text>
    </View>
    );
  }
}

 const Stack = createStackNavigator();

/* class App extends React.Component{
   render(){
   var myFooter = createFooter(this.props.navigation);

   return (
     <View style={{flex:1}}>
     <NavigationContainer>
       <Stack.Navigator initialRouteName="RoomArchive">
         <Stack.Screen name="RoomArchive" component={RoomArchive} />
         <Stack.Screen name="Room" component={MyRoom} />
         <Stack.Screen name="Settings" component={MySettings} />
         <Stack.Screen name="Profile" component={MyProfile} />
       </Stack.Navigator>
     </NavigationContainer>
     {myFooter}
     </View>
   );
 }
 }

 export default App;
*/

const styles = StyleSheet.create({
  room_inner_text_1_TD: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection:'column',
    flex: 1
  },
})


// https://reactnavigation.org/docs/material-bottom-tab-navigator

const Tab = createMaterialBottomTabNavigator();
  
  
  // <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>


export default function App() {

  var bar_options = {
    // tabBarLabel: 'Archive',
    tabBarIcon: ({ color }) => (<Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>),
    
    forceTitlesDisplay: false
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Archive" component={RoomArchive} activeColor="#e91e63" options={bar_options} />
        <Tab.Screen name="Room" component={Room} activeColor="#e91e63" options={bar_options} />
        <Tab.Screen name="Settings" component={Settings} activeColor="#e91e63" options={bar_options} />
        <Tab.Screen name="Profile" component={Profile} activeColor="#e91e63" options={bar_options} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}