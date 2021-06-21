import * as React from 'react';
import 'react-native-gesture-handler';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, TouchableHighlight,  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'modal-react-native-web';
import { Overlay } from 'react-native-elements';
import { RadioButton } from 'react-native-paper';
import io from "socket.io-client";

// import MediaQuery from "react-responsive";

import socketHandler    from '../proc/socket'

  
class CreateRoom extends React.Component{
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
    const myparams  = this.props.route.params;
    this.state.roomName = myparams.roomid; // 現在のルーム
    this.state.roomID = myparams.roomid;
    this.state.hSock = myparams.hSock;  

    this.state.newRoomName = "none"; 
    this.state.newRoomIcon = "null";
    this.state.newRoomType = "open";
  }


  // ルーム一覧画面に戻る
  backtoArchive(){
    console.log("leaving room....")

    const { navigation } = this.props;
    navigation.navigate("OpenRoom");
  }


  createNewRoom(){
    console.log("New Room Create!!");
    console.log(this.state);

    this.setState({ ModalVisivle: false}) // close modal

    fetch('http://localhost:3000/api/createNewRoom', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_id: "id1", hashed_pass:"password01", name: this.state.newRoomName, type:this.state.newRoomType })
    }).then((response) => response.json())
    .then(  (responseJson) => {
      if(responseJson.status = "ok"){
        console.log("Roomが正しく作成された！")
      }else{
        console.log("Error!!!");
      }
      
      this.forceUpdate(); //画面再レンダリング
    }).catch((error) => {
      console.log("[ ERROR ]サーバーと正常に通信できませんでした (createNewRoom)")
    });
  }

  render(){
    const { navigation } = this.props;
    const __createNewRoom = () => { this.createNewRoom() };
    const __backtoArchive = () => { this.backtoArchive() };
    return( 
    <View>
        <Text>Create Room </Text>
        <TextInput
          style={{
            width:300,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            margin:15
          }}
          onChangeText={(text) => this.setState({newRoomName : text})}
          placeholder ={this.state.newRoomName}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
          
          <RadioButton
            value="Open"
            status={ this.state.newRoomType === 'Open' ? 'checked' : 'unchecked' }
            onPress={() => this.setState({newRoomType : "Open"})}
          /><Text>Open Room</Text>
          <RadioButton
            value="ByInvitation"
            status={  this.state.newRoomType === 'ByInvitation' ? 'checked' : 'unchecked' }
            onPress={() => this.setState({newRoomType : "ByInvitation"})}
          /><Text>制限ルーム</Text>
        </View>

        
        <Text style={{margin:10}}>「{this.state.newRoomName}」を作成します、、、</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableHighlight onPress={ __createNewRoom } activeOpacity={0.2}>
              <View  style={{margin:10, width:140, height:30, backgroundColor: '#5555ff', justifyContent: 'center',alignItems: 'center',borderRadius: 10,shadowColor: '#000',shadowOffset: { width: 2, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}><Text>Create Room</Text></View>
            </TouchableHighlight>
            <TouchableHighlight onPress={ __backtoArchive } activeOpacity={0.2}>
              <View style={{margin:10, width:140, height:30, backgroundColor: '#bbbbbb',justifyContent: 'center',alignItems: 'center',borderRadius: 10,shadowColor: '#000',shadowOffset: { width: 2, height: 2 },shadowOpacity: 0.8,shadowRadius: 2}}><Text>  Cancel  </Text></View>
            </TouchableHighlight>
        </View>
    </View>
    );
  }
}


export default CreateRoom;


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

  // Modal example
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})
