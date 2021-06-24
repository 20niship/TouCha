import * as React from 'react';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';
// import MediaQuery from "react-responsive";

export default class Profile extends React.Component{
    render(){
      //サーバーからユーザーの情報持ってくるユーザーときの変数が分からないので、勝手に置いた。
      var user_name="TouCha";
      var user_grade=1;
      var user_class=1;
      var user_lan="中国語";
      var user_fac="理科一類";
      var user_dep=null;
      var fac_dep
      if (user_dep==null){
        fac_dep=user_fac;
      }else{
        fac_dep=user_fac + user_dep;
      }
      var user_message="こんにちは";
      var user_hobby="プログラミング";
      var user_birthday_year=2021;
      var user_birthday_month=3;
      var user_birthday_day=10;
      var user_birthday=user_birthday_year + "年" + user_birthday_month + "月" + user_birthday_day +"日";
      var user_id="e2b63e";

      var room_temp = [
        //{name:"アイコン", user:user_icon, navigation:"icon"},
        //navigation:クリックしたらそのページに行くようにするから。その名前を格納してる。21行目のnaigation.navigateで使う。
        //user:ユーザーが設定している、その項目のプロフィール
        {name:"名前", user:user_name, navigation:"user_name"},
        {name:"学部学科・科類",user:fac_dep, navigation:"fac_dep"},
        {name:"学年", user:user_grade ,navigation:"grade"},
        {name:"一言メッセージ", user:user_message,navigation:"message"},
        {name:"趣味", user:user_hobby,navigation:"hobby"},
        {name:"誕生日", user:user_birthday,navigation:"birthday"},
        {name:"ID", user:user_id,navigation:"user_id"},
     ];
     var room_list_ui = [];
 
     room_temp.forEach(function(room){
       room_list_ui.push(
         //特定のルームに移動する頃はできていないので調整必要
         <TouchableOpacity onPress={() => { navigation.navigate(room.navigation //各画面に進む。画面遷移は西宮お願い！
         ); }}
           style={styles.select_botton}>
           <View style={styles.room_inner_text_1_TD} >

             <Text style={{ fontSize: 15, color:"silver"}}>{room.name}</Text>
             <Text style={{fontSize:18}}>{room.user}</Text>
           </View>
           <Image source={require("./images/go.png")} style={{width:20, height:20, marginRight:20, marginTop:10}}/>
         </TouchableOpacity >
         )
        })
        return(
          <View style={{fontSize: 18, flex: 1, justifyContent: 'center',backgroundColor:"#eaeaea"}}>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems: 'center', marginTop:50, marginBottom:10, }}>
              <View style={{width:40}}></View>
              <Text style={{fontSize:25, alignItems:"center", justifyContent:"center"}}>マイプロフィール</Text>
              <TouchableHighlight onPress={() => { navigation.navigate("setting" //設定画面に進む
              ); }} style={{justifyContent:"center"}}>
                <Image source={require("./images/setting.png")} style={{width:30, height:30, marginRight:20,}}/> 
              </TouchableHighlight>
            </View>
            <ScrollView ref={(ref) => { this.scrollView = ref }} style={{height:630 //heightは機械によって変なことにならないよう変数で調整する
              }}>
              <TouchableOpacity onPress={() => { navigation.navigate(room.navigation //各画面に進む。画面遷移は西宮お願い！
              ); }}
                style={styles.icon_select_botton}>
                <View style={styles.room_inner_text_1_TD} >
                  <Text style={{ fontSize: 15, color:"silver"}}>アイコン</Text>
                  <Image source={require("./images/shinji.jpg")} style={{width:50, height:50}}></Image>
                </View>
                <Image source={require("./images/go.png")} style={{width:20, height:20, marginRight:20, marginTop:10}}/>
              </TouchableOpacity >
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
  icon_select_botton:{
    marginTop:10,
    paddingLeft:10,
    paddingTop:0,
    paddingBottom:10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height:80,
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

/*
    <View style={{flexDirection:"row"}}>
      <Image source={require("./images/shinji.jpg")} style={{width:60, height:60, marginLeft:10, marginTop:3}}/>
      <View>
        <Text>TouCha</Text>
        <Text>1年1組 中国語</Text>
        <Text>理科一類</Text>
      </View>
    </View>
    <View style={{flexDirection:"row", justifyContent:"space-between"}}>
      <Text>一言メッセージ</Text>
      <Text style={{textAlign:"right"}}>未設定</Text>
      <Image source={require("./images/go.png")} style={{width:20, height:20, marginRight:20, marginTop:10}}/>
    </View>
    <View>
      <Text>趣味</Text>
    </View>
    <View>
      <Text>誕生日</Text>
    </View>
    <View>
      <Text>ID</Text>
    </View>
*/