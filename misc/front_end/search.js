/*import { SearchBar } from 'react-native-elements';
import * as React from 'react';
import 'react-native-gesture-handler';
export default class App extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
      />
    );
  }
}
*/
import * as React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchBar } from 'react-native-elements';
import { Animated,Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MediaQuery from "react-responsive";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

// // import * from 'ui-utils.js'  // 最終的にはこういう感じで別ファイルに分けるべき
// // npm install --save @fortawesome/fontawesome-free でアイコンフォントをインストールする必要があ
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
//     <TouchableOpacity onPress={navigation.navigate("Open_room")} >
//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>Open room</Text>
//     </TouchableOpacity>

//     {/* <TouchableOpacity onPress={navigation.navigate("Room")} > */}
//     <TouchableOpacity onPress={console.log("Open_room")} >

//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>Room</Text>
//     </TouchableOpacity>

//     {/* <TouchableOpacity onPress={navigation.navigate("Settings")} > */}
//     <TouchableOpacity onPress={console.log("Open_room")} >
//         <Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>
//         <Text style={{textSize:footer_text_size}}>Settings</Text>
//     </TouchableOpacity>


//     {/* <TouchableOpacity onPress={navigation.navigate("Profile")} > */}
//     <TouchableOpacity onPress={console.log("Open_room")} >
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

class IconTest extends React.Component {
  render() {
      return (
          <View>
              <Icon
                  name={this.props.icon}
                  size={this.props.fontSize ? this.props.fontSize : 50}
              />
          </View>
      );
  }
}

class Open_room extends React.Component{
    render(){
      const { navigation } = this.props;
    const room_temp = [
       {name:"room1", icon_name:"user-circle", lastmsg:"Hello room 1", status:"ok"},
       {name:"room2", icon_name:"user-circle", lastmsg:"Hello room 2", status:"ok"},
       {name:"room3", icon_name:"user-circle", lastmsg:"Hello room 3", status:"ok"},
       {name:"room4", icon_name:"user-circle", lastmsg:"Hello room 4", status:"ok"},
       {name:"room5", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
       {name:"room6", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
       {name:"room7", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
       {name:"room8", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
       {name:"room9", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
       {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
       
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
        <TouchableOpacity onPress={() => { navigation.navigate("Room"); }} 
          style={{ justifyContent: 'space-between', flexDirection: 'row', height:80}}>
            <View style={{width:50, height:50, marginLeft:20,marginTop:20}}>
            <IconTest icon={room.icon_name} fontSize={45}/>
            </View>
            <View style={styles.room_inner_text_1_TD} >
              <Text style={{ fontSize: 18 }}>{room.name}</Text>
              <Text style={{ fontSize: 14, color:"darkgray" }}>{room.lastmsg}</Text>
            </View>
          </TouchableOpacity >
        )
      })
      
      return( 
        <View>
          <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:50, marginBottom:10}}>
          <View style={{width:40}}></View>
            <Text style={{fontSize:25,marginLeft:10}}>オープンルーム</Text>
            <TouchableHighlight style={{marginRight:20}}>
              <IconTest icon="search" fontSize={25} />
              
            </TouchableHighlight>
          </View>
          <ScrollView ref={(ref) => { this.scrollView = ref }} style={{height:630 //heightは機械によって変なことにならないよう変数で調整する
          }}>
            {room_list_ui}
          </ScrollView>
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    room_inner_text_1_TD: {
      borderRadius: 5,
      marginTop: 8,
      marginRight: 10,
      marginLeft: 10,
      paddingHorizontal: 0,
      paddingVertical: 8,
      flexDirection:'column',
      flex: 1
    },

    messages:{
      backgroundColor:"white"
    },
  })

/*class Chat_Room extends React.Component{
    render(){
    return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text> Chat rooooo〜〜〜m!!</Text>
    </View>
    );
}
}
*/
/*state={
  search:"検索"
};
updateSearch = (search) => {
  this.setState({ search });
};
*/
class Room extends React.Component{
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render(){
    const { search } = this.state;
      const { navigation } = this.props;
      const room_temp = [
         {name:"room1", icon_name:"user-circle", lastmsg:"Hello room 1", status:"ok"},
         {name:"room2", icon_name:"user-circle", lastmsg:"Hello room 2", status:"ok"},
         {name:"room3", icon_name:"user-circle", lastmsg:"Hello room 3", status:"ok"},
         {name:"room4", icon_name:"user-circle", lastmsg:"Hello room 4", status:"ok"},
         {name:"room5", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room6", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room7", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room8", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room9", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
         {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok"},
        
      ];
      var room_list_ui = [];
  
/*      var room_inner_text_2 = {
        margin:0,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection:'row',
        flex: 1,
      };
*/      
      room_temp.forEach(function(room, index){
        room_list_ui.push(
          //特定のルームに移動する頃はできていないので調整必要
          
          <TouchableOpacity onPress={() => { navigation.navigate("Room"); }} style={{ justifyContent: 'space-between', flexDirection: 'row', height:80 }}>
              <View style={{width:50, height:50, marginLeft:20,marginTop:20}}>
              <IconTest icon={room.icon_name} fontSize={45}/>
              </View>
              <View style={styles.room_inner_text_1_TD} >
                <Text style={{ fontSize: 18 }}>{room.name}</Text>
                <Text style={{ fontSize: 14, color:"darkgray" }}>{room.lastmsg}</Text>
              </View>
            </TouchableOpacity >
          )
        })
        
        return( 
          <View style={{backgroundColor:"white",}}>
            <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:50,}}>
              <View style={{width:40}}></View>
              <Text style={{fontSize:25,marginLeft:10}}>ルーム</Text>
              <TouchableHighlight style={{marginRight:20, paddingTop:0 //＠西宮　このアイコンを押すとルームの種類を選ぶバーが出てくるようにして～
              }}>
                <IconTest icon="plus-circle" fontSize={25} /> 
              </TouchableHighlight>
            </View>
            <Animated.View
              style={[
                styles.box,
                {
                  transform: [{
                    translateY: Animated.diffClamp( Animated.multiply(scrollY, -1), -60, 0)
                  }],
                },
              ]}
            >
            <SearchBar
              placeholder="検索"
              onChangeText={this.updateSearch}
              value={search}
              platform="ios" //iosとアンドロイドで変える
              style={{
                margin:0
              }}
            />
            </Animated.View>
            <ScrollView ref={(ref) => { this.scrollView = ref }} style={{height:570 //heightは機械によって変なことにならないよう変数で調整する
            }}> 
              {room_list_ui}  
            </ScrollView>
          </View>
        );
      }
    
  
};
/*borderRadius: 5,
borderWidth: 0,
borderColor: 'gray',
color:"white",

fontSize: 20,
paddingHorizontal: 10,
paddingVertical:0,
}}/>
*/
/*class Settings extends React.Component{
    render(){
    return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text> Setteing !!!!</Text>
    </View>
    );
    }
}
*/
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
       <Stack.Navigator initialRouteName="Open_oom">
         <Stack.Screen name="Open_room" component={Open_room} />
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
      <Tab.Navigator
        screenOptions={({route}) => ({tabBarIcon:({color,size}) => {
          size=25
          if (route.name === 'Open_room') {
            var iconName="university"
          } else if (route.name === 'Room') {
            iconName = "comment"
          } else if (route.name === 'Settings') {
            iconName = "cog"
          } else if (route.name === 'Profile') {
            iconName = "user"
          } 
          return <IconTest icon={iconName} fontSize={size}/>;
        },
      })}
      >
        <Tab.Screen name="Open_room" component={Open_room} activeColor="#e91e63"/>
        <Tab.Screen name="Room" component={Room} activeColor="#e91e63" options={{ tabBarBadge: 3 }}/>
        <Tab.Screen name="Profile" component={Profile} activeColor="#e91e63" />
      </Tab.Navigator>
    </NavigationContainer>
  );
}