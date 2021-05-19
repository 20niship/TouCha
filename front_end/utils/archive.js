import * as React from 'react';
import 'react-native-gesture-handler';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, TouchableHighlight,  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'modal-react-native-web';
import { Overlay } from 'react-native-elements';

// import MediaQuery from "react-responsive";
  
class Open_room extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      ModalVisivle : false,
      newRoomText : ""
    }
  }

  render(){
    const { navigation } = this.props;
  const room_temp = [
      {name:"room1", icon_name:"user-circle", lastmsg:"Hello room 1", status:"ok", id:"rid1"},
      {name:"room2", icon_name:"user-circle", lastmsg:"Hello room 2", status:"ok", id:"rid2"},
      {name:"room3", icon_name:"user-circle", lastmsg:"Hello room 3", status:"ok", id:"rid3"},
      {name:"room4", icon_name:"user-circle", lastmsg:"Hello room 4", status:"ok", id:"rid4"},
      {name:"room5", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", id:"rid5"},
      {name:"room6", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", id:"rid6"},
      {name:"room7", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", id:"rid7"},
      {name:"room8", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", id:"rid8"},
      {name:"room9", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", id:"rid9"},
      {name:"room10", icon_name:"user-circle", lastmsg:"Hello room 5", status:"ok", id:"rid10"},
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
      <TouchableOpacity onPress={() => { 
        navigation.navigate("Room", {roomid : room.id}); 
      }} 
        style={{ justifyContent: 'space-between', flexDirection: 'row', height:80}}>
          <View style={{width:50, height:50, marginLeft:20,marginTop:20}}>
          <Icon name={room.icon_name} size={45} />
          </View>
          <View style={styles.room_inner_text_1_TD} >
            <Text style={{ fontSize: 18 }}>{room.name}</Text>
            <Text style={{ fontSize: 14, color:"darkgray" }}>{room.lastmsg}</Text>
          </View>
        </TouchableOpacity >
      )
    })

    const ModalOverlayOn  = () => { this.setState({ ModalVisivle: true}) };
    const ModalOverlayOff = () => {this.setState({ ModalVisivle: false}) };

    return( 
      <View>
        <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:50, marginBottom:10}}>
        <View style={{width:40}}></View>
          <Text style={{fontSize:20,marginLeft:10}}>オープンルーム</Text>
          <TouchableHighlight style={{width:20}} onPress={ModalOverlayOn} ><Icon name="plus" size={20} /></TouchableHighlight>
          <TouchableHighlight style={{marginRight:20}}><Icon name="search" size={20} /></TouchableHighlight>
        </View>

          <Overlay ModalComponent={Modal} isVisible={this.state.ModalVisivle} onBackdropPress={ModalOverlayOff}>
            {/* <Overlay isVisible={this.state.ModalVisivle} onBackdropPress={ModalOverlayOff}> */}
            <Text>Create Room </Text>
            <TextInput
              style={{
                width:300,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc"
              }}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
            <Text>{this.state.text}</Text>
            <Button title="Create Room!" onPress={ModalOverlayOff}></Button>
          </Overlay>
      

        <ScrollView ref={(ref) => { this.scrollView = ref }} style={{height:630 //heightは機械によって変なことにならないよう変数で調整する
        }}>
          {room_list_ui}
        </ScrollView>
      </View>
    );
  }
}


export default Open_room;


/* ver 2
export default class Room extends React.Component{
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
       
        room_temp.forEach(function(room, index){
          room_list_ui.push(
            //特定のルームに移動する頃はできていないので調整必要
            
            <TouchableOpacity onPress={() => { navigation.navigate("Room"); }} style={{ justifyContent: 'space-between', flexDirection: 'row', height:80 }}>
                <View style={{width:50, height:50, marginLeft:20,marginTop:20}}>
                <Icon name={room.icon_name} size={45}/>
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
                <TouchableHighlight style={{marginRight:20, paddingTop:0}}>
                <Icon name="plus-circle" size={25}/>
                </TouchableHighlight>
              </View>
              <View>
              <SearchBar
                placeholder="検索"
                onChangeText={this.updateSearch}
                value={search}
                platform="ios" //iosとアンドロイドで変える
                style={{
                  margin:0
                }}
              />
              </View>
              
              <ScrollView ref={(ref) => { this.scrollView = ref }} style={{height:570 //heightは機械によって変なことにならないよう変数で調整する
              }}> 
                {room_list_ui}  
              </ScrollView>
            </View>
          );
        }
  };
*/
  
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