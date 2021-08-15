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
import * as Notifications from 'expo-notifications';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

// // import * from 'ui-utils.js'  // 最終的にはこういう感じで別ファイルに分けるべき
// // npm install --save @fortawesome/fontawesome-free でアイコンフォントをインストールする必要があ
// // https://qiita.com/yasu_yyy/items/8ab627716314bdfdcb59 を参考に

//  const Stack = createStackNavigator();

// https://reactnavigation.org/docs/material-bottom-tab-navigator
const Tab = createMaterialBottomTabNavigator();
  
import Profile from './utils/profile'
import Setting from './utils/setting'
import Archive from './utils/archive'
import Room    from './utils/room'
import socketHandler    from './proc/socket'
import CreateRoom from './utils/createRoom'

const requestPermissionsAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync();
  if (granted) { return }

  await Notifications.requestPermissionsAsync();
}

export default function App() {

  React.useEffect(() => {
    requestPermissionsAsync();
  })

  var bar_options = {
    // tabBarLabel: 'Archive',
    tabBarIcon: ({ color }) => (<Image source={{uri:'https://emoji.slack-edge.com/T03MDNTCW/%25E3%2581%2584%25E3%2581%2584%25E8%25A9%25B1/0fe642881d40d176.gif'}} style={{width:30, height:30 }}/>),
    
    forceTitlesDisplay: false
  };

  return (
    <NavigationContainer>
      {/* <Tab.Navigator
        screenOptions={({route}) => ({tabBarIcon:({color,size}) => {
          size=25
          if (route.name === 'OpenRoom') {
            var iconName="university"
          } else if (route.name === 'Room') {
            iconName = "comment"
          } else if (route.name === 'Setting') {
            iconName = "cog"
          } else if (route.name === 'Profile') {
            iconName = "user"
          } else if (route.name === 'Setting') {
             iconName = "user"
          } 
         
          return  <Icon name={iconName} size={size} />;
        },
      })}
      > */}

    <Stack.Navigator>
        <Stack.Screen name="OpenRoom" component={Archive} />
        <Stack.Screen name="Room" component={Room}/>
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Setting" component={Setting} />
        <Stack.Screen name="createNewRoom" component={CreateRoom} />
    </Stack.Navigator>
        {/* <Tab.Screen name="OpenRoom" component={Archive} activeColor="#e91e63"/>
        <Tab.Screen name="Room" component={Room} activeColor="#e91e63" options={{ tabBarBadge: 3 }}/>
        <Tab.Screen name="Profile" component={Profile} activeColor="#e91e63" />
        <Tab.Screen name="Setting" component={Setting} activeColor="#e91e63" />
        {/* <Tab.Screen name="createNewRoom" component={CreateRoom} activeColor="#e91e63" /> */}
      {/* </Tab.Navigator> */}

    </NavigationContainer>
  );
}
