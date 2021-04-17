import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, TouchableHighlight, Keyboard } from 'react-native';
import AutogrowInput from 'react-native-autogrow-input';


// 一時的に画像を読み込む（テスト用のみ）
import photo_nerv from './images/nerv.jpg'
import photo_qb   from './images/qb.jpg'
import photo_shunji from './images/shinji.jpg'


//used to make random-sized messages
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    this.state = {
      messages: messages,
      inputBarText: ''
    }
  }

  static navigationOptions = {
    title: 'Chat',
  };

  RoomScrolltoEndWrapper (e) {this.scrollView.scrollToEnd();}
  componentWillMount () {
    // ンポーネントがマウント(配置)される直前に呼び出される
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.RoomScrolltoEndWrapper.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.RoomScrolltoEndWrapper.bind(this));
  }

  componentWillUnmount() { this.keyboardDidShowListener.remove(); this.keyboardDidHideListener.remove();}
   
  componentDidMount()   {setTimeout(function() {this.RoomScrolltoEndWrapper(this);}.bind(this)) } // アプリ起動時に最下部までスクロール
  componentDidUpdate() { setTimeout(function() {this.RoomScrolltoEndWrapper(this);}.bind(this))  } //メッセージが追加されたときに最下部までスクロール
  

  _sendMessage() {
    this.state.messages.push({ direction:'right', usrIconURL:photo_qb,  text: this.state.inputBarText, reactions:"" })

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

  render() {
    var messages = [];

    this.state.messages.forEach(function(message, index) {
      messages.push(
          <MessageBubble key={index} direction={message.direction} text={message.text} userIconUrl={message.usrIconURL} reactions={message.reactions}/>
        );
    });

    return (
              <View style={styles.outer}>
                  <ScrollView ref={(ref) => { this.scrollView = ref }} style={styles.messages}>
                    {messages}
                  </ScrollView>
                  <InputBar onSendPressed={() => this._sendMessage()} 
                            onSizeChange={() => this._onInputSizeChange()}
                            onChangeText={(text) => this._onChangeInputBarText(text)}
                            text={this.state.inputBarText}/>
                  {/* <KeyboardSpacer/>              */}
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

  //AutogrowInput doesn't change its size when the text is changed from the outside.
  //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
  //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
  //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
  //of the InputBar's text to be set from the outside.
  componentWillReceiveProps(nextProps) {
    if(nextProps.text === '') {
      this.autogrowInput.resetInputText();
    }
  }

  render() {
    return (
          <View style={styles.inputBar}>
            <AutogrowInput style={styles.textBox}
                        ref={(ref) => { this.autogrowInput = ref }} 
                        multiline={true}
                        defaultHeight={30}
                        onChangeText={(text) => this.props.onChangeText(text)}
                        onContentSizeChange={this.props.onSizeChange}
                        value={this.props.text}/>
            <TouchableHighlight style={styles.sendButton} onPress={() => this.props.onSendPressed()}>
                <Text style={{color: 'white'}}>Send</Text>
            </TouchableHighlight>
          </View> 
          );
  }
}

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({

  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  messages: {
    flex: 1
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
  },

  textBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    marginLeft: 5,
    paddingRight: 15,
    borderRadius: 5,
    backgroundColor: '#66db30'
  },

  //MessageBubble

  messageBubble: {
      margin:0,
      paddingHorizontal: 10,
      paddingVertical: 5,
      flexDirection:'row',
      flex: 1
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
    color: 'black'
  },

  messageBubbleRight: {
    backgroundColor: '#66db30'
  },

  messageBubbleTextRight: {
    color: 'white'
  },
})
