import * as React from 'react';
// import MediaQuery from "react-responsive";
import { Animated,Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';

export default class Setting extends React.Component{
    render(){
      const { navigation } = this.props;
    const room_temp = [
       {name:"アカウント", navigation:"account"}, //navigation:クリックしたらそのページに行くようにするから。その名前を格納してる。21行目のnaigation.navigateで使う。
       {name:"通知", navigation:"notification"},
       {name:"運営からのお知らせ", navigation:"news_from_management_team"},
       {name:"運営へのご意見", navigation:"opinion"},
       {name:"アプリの使い方", navigation:"help"},
    ];
    var room_list_ui = [];

    room_temp.forEach(function(room, index){
      room_list_ui.push(
        //特定のルームに移動する頃はできていないので調整必要
        <TouchableOpacity onPress={() => { navigation.navigate(room.navigation //各画面に進む。画面遷移は西宮お願い！
        ); }}
          style={styles.select_botton}>
          <View style={styles.room_inner_text_1_TD} >
            <Text style={{ fontSize: 18 }}>{room.name}</Text>
          </View>
          <Image source={require("./images/go.png")} style={{width:20, height:20, marginRight:20, marginTop:10}}/>
        </TouchableOpacity >
        )
      })

   return(
      <View style={{backgroundColor:"#eaeaea"}}>
        <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:50, marginBottom:10,}}>
          <TouchableHighlight onPress={() => { navigation.navigate("profile" //プロフィール画面に戻る
          ); }} style={{marginRight:20, justifyContent:"center"}}>
            <Image source={require("./images/back.png")} style={{width:20, height:20, marginLeft:10, marginTop:3}}/>
          </TouchableHighlight>
          <Text style={{fontSize:25, alignItems:"center", justifyContent:"center"}}>設定</Text>
          <View style={{width:40}}></View>
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
  select_botton:{
    marginTop:10,
    paddingLeft:10,
    paddingTop:0,
    paddingBottom:10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height:65,
    backgroundColor:"white",
  },
  room_inner_text_1_TD: {
    borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 0,
    paddingVertical: 8,
    flexDirection:'column',
    flex: 1,
  },
  header: {
    //position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden',
  },    
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  messages:{
    backgroundColor:"white"
  },
})

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


/*     <View style={{flex:1}}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>設定</Text>
      </View>
      <View　style={{ flex: 1, justifyContent: 'center' }}>
        <Text>アカウント</Text>
      </View>
      <View　style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>通知</Text>
      </View>
      <View　style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>運営からのお知らせ</Text>
      </View>
      <View　style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>運営へのご意見</Text>
      </View>
      <View　style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>アプリの使い方</Text>
      </View>
    </View>
*/