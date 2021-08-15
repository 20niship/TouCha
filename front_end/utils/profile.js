import * as React from 'react';
import { Text, View, Button, Image, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView,AppRegistry, TextInput, TouchableHighlight, Keyboard } from 'react-native';
// import MediaQuery from "react-responsive";

export default class Profile extends React.Component{
  constructor(props){
    super(props);
    this.state={userData:{}, loaded:false};
    this.getUserData();
  }

  static profileKey={
    "icon":"アイコン",
    "name":"名前",
    "fac":"学部学科・科類",
    "grade":"学年",
    "message":"一言メッセージ",
    "hobby":"趣味",
    "birthday":"誕生日",
    "id":"ID"
  };

  getUserData(){
    //サーバーからユーザーの情報持ってくるユーザーときの変数が分からないので、勝手に置いた。
    /*
      {name:Str,grade:Num,・・・}て感じだと助かる
    */
    const userData={
      icon:"https://pbs.twimg.com/profile_images/1264490158121869313/maQmeRbN_400x400.jpg", // TODO あとで設定;
      name:"TouCha",
      grade:"1",
      class:"1",
      lan:"中国語",
      fac:"理科一類",
      dep:null,
      message:"こんにちは",
      hobby:"プログラミング",
      birthday_year:"2021年3月12日",
      id:"e2b63e"
    };
    //----ここまでサーバーからくる想定
    setTimeout(()=>this.setState({userData,loaded:true}), 1000);
  }

  render(){
    const {navigation}=this.props;
    if(!this.state.loaded){//TODO なんかいい感じに
      return (
        <Text>LOADING</Text>
      );
    }
    const userData=this.state.userData;
    const user_id=userData.id;
    const profile_list_ui=(Object.entries(userData)).map((profile, i)=>{
      const type=profile[0];
      const name=Profile.profileKey[profile[0]];
      let val=profile[1];
      if(name===undefined)return null;
      if(type==="fac")val+=userData.dep||"";
      if(type==="id"){//変更不可のやつがIDだけならprofile_tempから消してreturnの中に直書きもあり 複数なら、["ID", "", ""・・・].includes(profile.name)で
        return (
          <TouchableOpacity style={styles.select_botton} key={i}>
            <View style={styles.room_inner_text_1_TD} >
              <Text style={{fontSize: 15, color:"silver"}}>{type}</Text>
              <Text style={{fontSize:18}}>{val}</Text>
            </View>
          </TouchableOpacity>
        );
      }else{
        return (
          <TouchableOpacity onPress={()=>navigation.navigate("editProfile", {type, temp:val, name, user_id})} style={styles[type==="icon"?"icon_select_botton":"select_botton"]} key={i}>
            <View style={styles.room_inner_text_1_TD} >
              <Text style={{fontSize:15, color:"silver"}}>{name}</Text>
              {type==="icon"?
                  <Image source={{uri:val}} style={{width:50, height:50}}></Image>
                : <Text style={{fontSize:18}}>{val}</Text>
              }
            </View>
            <Image source={require("./images/go.png")} style={{width:20, height:20, marginRight:20, marginTop:10}}/>
          </TouchableOpacity>
        );
      }
    });

    return (
      <View style={{fontSize: 18, flex: 1, justifyContent: 'center',backgroundColor:"#eaeaea"}}>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems: 'center', marginTop:50, marginBottom:10 }}>
          <View style={{width:40}}></View>
          <Text style={{fontSize:25, alignItems:"center", justifyContent:"center"}}>マイプロフィール</Text>
          <TouchableHighlight onPress={()=>navigation.navigate("setting")} style={{justifyContent:"center"}}>{/*設定画面に進む*/}
            <Image source={require("./images/setting.png")} style={{width:30, height:30, marginRight:20,}}/>
          </TouchableHighlight>
        </View>
        <ScrollView style={{height:630}}>{/*heightは機械によって変なことにならないよう変数で調整する*/}
          {profile_list_ui}
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
    backgroundColor:"white"
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
    backgroundColor:"white"
  },
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
  header: {
    //position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#03A9F4',
    overflow: 'hidden'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover'
  },
  messages:{
    backgroundColor:"white"
  }
});

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
