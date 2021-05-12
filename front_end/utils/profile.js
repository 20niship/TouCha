import * as React from 'react';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';
// import MediaQuery from "react-responsive";


export default class Profile extends React.Component{
    render(){
   return(
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is Profile Component</Text>
    </View>
    );
  }
}
