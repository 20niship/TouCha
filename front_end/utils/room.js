import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, TouchableHighlight, TouchableOpacity, Keyboard } from 'react-native';
import AutogrowInput from 'react-native-autogrow-input';
import io from "socket.io-client";
import Icon from 'react-native-vector-icons/FontAwesome';

// before : io('https://acbc591940e9.ngrok.io', {transports: ['websocket']} );
// const socket = io("http://localhost:3000", {transports: ['websocket']} );

// 一時的に画像を読み込む（テスト用のみ）
import photo_nerv from '../../misc/front_end/chat_test/images/nerv.jpg'
import photo_qb   from '../../misc/front_end/chat_test/images/qb.jpg'
import photo_shunji from '../../misc/front_end/chat_test/images/shinji.jpg'
// import photo_bell from "./images/bell.png"

export default class ChatView extends Component {
  constructor(props) {
    super(props);
    var messages = [
      { direction:'left', usrIconURL:photo_nerv, text:"いかりしんじ、エヴァに乗れ！！", reactions:"" }, 
      { direction:'left', usrIconURL:photo_nerv, text:"でなければ、、帰れ！", reactions:"" }, 
      { direction:'left', usrIconURL:photo_nerv, text:"やっはろーーーーーあああああああああああああああ", reactions:"" }, 
      { direction:'right', usrIconURL:photo_qb, text:"わけがわからないよわけがわからないよわけがわからないよわけがわからないよわけがわからないよ", reactions:"" }, 
      { direction:'left', usrIconURL:photo_nerv, text:"いかりしんじ、エヴァに乗れ！！", reactions:"" }, 
      { direction:'right', usrIconURL:photo_shunji, text:"逃げちゃだめだ、逃げちゃだめだ、逃げちゃだめだ、逃げちゃだめだ、逃げちゃだめだ！！！！", reactions:"" },
      { direction:'left', usrIconURL:photo_shunji, text:"リアクションサンプル：", reactions:"" }
    ];

    //render関数がaddEventListener(focus)で指定している関数よりも先に呼ばれたときに変数宣言がないとエラーになるので宣言だけしておく。
    // render関数の中でこの値が初期化されているかどうかでif文をかくべし
    this.state = {messages:messages};
    this.socket = null;
    this.isSocketVerified = false;
    this.isSocketConnected = false;

    this.init();

    // Room画面に遷移したときに実行される
    const unsubscribe = props.navigation.addListener('focus', () => { this.init(); });

    console.log("exit constructor() function");
  }
  

  // ↓これがなんのためにあるのかよくわかっていない。削除予定
  // static navigationOptions = {
  // title: 'Chat',
  // };

  init(){
    this.state.noti = 6;
    this.state.inputBarText = "";
    this.state.members = [];

    console.log("starting socket.io .....,");
    this.isSocketVerified = false;
    this.isSocketConnected = false;

    try{
      this.socket = io("http://localhost:3000", {transports: ['websocket']} );
    }catch{
      console.log("ソケットの接続に失敗しました。インターネットにつながっていない可能性があります")
    }
   
    // ------------------------------  ソケット通信をユーザーでログインしてVerifyする  --------------------------------
    var send_msg = {
      'event':'login',
      'userid':'000',
      'hashed_pass' : 'password',
      'ts' : new Date().getTime() // タイムスタンプ　https://wiki.aleen42.com/qa/timestamp.html
    }
    console.log(send_msg);

    this.socket.emit('message', send_msg);
    this.socket.on('login-verify', function(msg){
      console.log(msg);
      this.isSocketVerified = true;
      console.log("ユーザー認証に失敗しました。ルームに参加していない可能性があります");
    });

    // this.socket.on("seq-num", (msg) => console.info(msg));

    const myparams  = this.props.route.params;
    this.state.roomName = myparams.roomid;
    this.state.roomID = myparams.roomid;

    // TODO最終的には以下のように実装する予定
    // this.state.roomName = getRoomName(this.props.navigation.navigate.state.roomid);
    // try{
      // this.state.members = getMemberList(i); // サーバーのDBからメンバーリスト取得
      // this.state.messages = getLast50Msg(i); // サーバーからラスト50件のメッセージを取得
      // saveMsgtoCache(); // this.state.messagesをキャッシュ（ローカルファイル）に保存する
    // }catch{
      // サーバーに接続できない、すでにルームが削除されている、ほかのデバイスでルームの退会処理を行ったなどの場合はerrorとしてキャッチする。
    // }
  }


  // --------------------------------------------------------------------------
  //        UIの細かい表示の設定
  // --------------------------------------------------------------------------

  RoomScrolltoEndWrapper (e) {this.scrollView.scrollToEnd();}
/*
  UNSAFE_componentWillMount () {
    // ンポーネントがマウント(配置)される直前に呼び出される
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.RoomScrolltoEndWrapper.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.RoomScrolltoEndWrapper.bind(this));
  }
  componentWillUnmount() { this.keyboardDidShowListener.remove(); this.keyboardDidHideListener.remove();}
  componentDidMount()   {setTimeout(function() {this.RoomScrolltoEndWrapper(this);}.bind(this)); } // アプリ起動時に最下部までスクロール
  componentDidUpdate() { setTimeout(function() {this.RoomScrolltoEndWrapper(this);}.bind(this));  } //メッセージが追加されたときに最下部までスクロール
*/

  _sendMessage() {
    var send_msg = {
      'event':'send-message',
      'text' : this.state.inputBarText,
      'room' : this.roomName,
      'ts' : new Date().getTime() // タイムスタンプ　https://wiki.aleen42.com/qa/timestamp.html
    }
    console.log(send_msg);
    this.socket.emit('message', send_msg);
    
    this.state.messages.push({ direction:'right', usrIconURL:photo_qb,  text: this.state.inputBarText, reactions:"" });

//    socket.emit('message', this.state.inputBarText);

    this.setState({
      messages: this.state.messages,
      inputBarText: ''
    });
  }

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text
    });
  }

  //This event fires way too often.
  //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
  //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
  //The real solution here is probably a fork of AutogrowInput that can provide this information.
  _onInputSizeChange() {
    setTimeout(function() {
      this.scrollView.scrollToEnd({animated: false});
    }.bind(this))
  }

  // ルーム一覧画面に戻る
  backtoArchive(){
    this.socket.emit('message', {'event':'leave-room', 'user':'000'});
    this.socket.close();

    const { navigation } = this.props;
    navigation.navigate("OpenRoom");
  }

  render() {
    // ------------------------- ルームの設定 ----------------------------------------
    var messages = [];
    var that = this;
    // while(this.socket == null){
    //   this.init();
    // }

    this.socket.on('message', function(msg) {
      console.log("ahaha " + msg);
      const findresult = that.state.messages.some((u) => u.text === msg);
      if (!findresult) {
        that.state.messages.push({ direction:'left', usrIconURL:photo_qb,  text:msg, reactions:"" });
        that.setState({
        messages: that.state.messages,
        inputBarText: ''
        });
      }
      console.log("gehe");

    });

    /* if(flag === 1){
      flag = 0;
      this.state.messages.push({ direction:'left', usrIconURL:photo_qb,  text:m, reactions:"" });
      console.log("gehe");
    } */

    this.state.messages.forEach(function(message, index) {
      messages.push(
          <MessageBubble key={index} direction={message.direction} text={message.text} userIconUrl={message.usrIconURL} reactions={message.reactions}/>
        );
    });

    return (

      <View style={styles.outer}>
          <View style={styles.topBar}>
          <TouchableHighlight onPress={() => { this.backtoArchive(); }} >
                <Text style={styles.backButton}>&lt; {this.state.noti}</Text>
          </TouchableHighlight>
              <Text style={styles.textTop}>{this.state.roomName}({this.state.members.length})</Text>
            <TouchableHighlight>
              <Image source={require("../../misc/front_end/chat_test/images/bell.png")} style={styles.bell}/>
            </TouchableHighlight>
          </View>
          <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior="position"
              contentContainerStyle={{ flex: 1 }}
            >

          <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
            {messages}
          </ScrollView>
          <InputBar onSendPressed={() => this._sendMessage()} 
                    onSizeChange={() => this._onInputSizeChange()}
                    onChangeText={(text) => this._onChangeInputBarText(text)}
                    text={this.state.inputBarText}/>
           
           <TouchableOpacity
              style={{ marginLeft: 8 }}
              onPress={() => {this._sendMessage()} }
              activeOpacity={0.7}
            >
              {/* {this.renderIcon()} */}
            </TouchableOpacity>
          {/* <KeyboardSpacer/>              */}
          </KeyboardAvoidingView>
          <View style={styles.bottom}></View>
      </View>
    );
  }
}

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends Component {
  render() {
    var bubbleStyles = this.props.direction === 'left' ? [styles.messageBubble, styles.messageBubbleLeft] : [styles.messageBubble, styles.messageBubbleRight];
    var bubbleTextStyle = this.props.direction === 'left' ? styles.messageBubbleTextLeft : styles.messageBubbleTextRight;

    if (this.props.direction === 'left'){
        return (
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Image source={this.props.userIconUrl} style={{ width: 50, height: 50 }} />
              <View style={styles.messageBubbleTD}>
                <View style={bubbleStyles}><Text style={bubbleTextStyle}>{this.props.text}</Text></View>
                <Image source={{uri:"https://emoji.slack-edge.com/T01SUSMC3U7/iihanashi/21e4a4659a628f58.gif"}} style={{ width: 20, height: 20 }} />
              </View>
              <View style={{width: 70}}/> 
            </View>
        );
    }else{
      return (
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <View style={{width: 70}}/> 
              <View style={styles.messageBubbleTD}>
                <View style={bubbleStyles}><Text style={bubbleTextStyle}>{this.props.text}</Text></View>
                <Image source={{uri:"https://emoji.slack-edge.com/T01SUSMC3U7/iihanashi/21e4a4659a628f58.gif"}} style={{ width: 20, height: 20 }} />
              </View>
            <Image source={this.props.userIconUrl} style={{ width: 50, height: 50 }} />
          </View>
      );
    }
  }
}

//The bar at the bottom with a textbox and a send button.
class InputBar extends Component {

  // componentUnMount系はrenameされて使わないほうが良いとWarningが出ていたので
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   if(nextProps.text === '') {
  //     this.autogrowInput.resetInputText();
  //   }
  // }

  render() {
    return (
      <>
          <View style={styles.inputBar}>
            <TouchableHighlight>
              <Image source={require("../../misc/front_end/chat_test/images/plus.png")} style={styles.plus}/>
            </TouchableHighlight>
            <AutogrowInput style={styles.textBox}
                        ref={(ref) => { this.autogrowInput = ref }} 
                        multiline={true}
                        defaultHeight={30}
                        onChangeText={(text) => this.props.onChangeText(text)}
                        onContentSizeChange={this.props.onSizeChange}
                        value={this.props.text}/>
            <TouchableHighlight style={styles.sendButton} onPress={() =>{this.props.onSendPressed();}}>
                <Icon name="paper-plane" />
                {/* <Image source={require("../../misc/front_end/chat_test/images/submit_arrow.png")} style={styles.arrow}/> */}
            </TouchableHighlight>
          </View> 
      </>
    );
  }
}

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({

  //Top of Chat
  topBar:{
    marginTop:0,
    paddingTop:40,
    zIndex:1,
    backgroundColor:"rgba(256,256,256,0.95)",
    flexDirection: 'row',
    justifyContent:"space-between",
    alignItems:"center",
  },

  backButton:{
    marginLeft:10,
    fontSize:23,
    margin:4,
  },

  textTop:{
    fontSize:20,
  },

  bell:{
    marginRight:20,
    width:25,
    height:25,
  },

  //ChatView
  
  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1,
  },

  //InputBar of Chat

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop:5,
    paddingBottom:5,
    //backgroundColor:"blue",
  },
  plus:{
    height:20,
    width:20,
    marginLeft:10,
    marginRight:10,
    marginTop:5,
  },

  arrow:{
    height:25,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    height:20,
  },

  sendButton: {
    width:40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  },

  bottom:{
    height:40,
  },
  //MessageBubble

  messageBubble: {
      margin:0,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexDirection:'row',
      flex: 1,
  },



  messageBubbleTD: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexDirection:'column',
    flex: 1
  },


  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
  },

  messageBubbleTextLeft: {
    color: 'black',
    fontSize:16,
  },

  messageBubbleRight: {
    backgroundColor: '#66db30'
  },

  messageBubbleTextRight: {
    color: 'white',
    fontSize:16,
  },
})

