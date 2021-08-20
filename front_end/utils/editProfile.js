import React from 'react';
import {PanResponder, Alert, Text, View, Button, Image, StyleSheet, TouchableWithoutFeedback, TextInput} from 'react-native';
import * as expoImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {getDocumentAsync} from "expo-document-picker";
import SimpleModal from "./simpleModal.js";

export default class EditProfile extends React.Component{
  constructor(props){
    super(props);
    const params=props.route.params;
    this.state={
      newProfile:params.temp,
      progress:0,
      newIconUri:"",
      modal:false
    };
    this.zoomImg=null;
    this.pickedIconUri="";
    this.prePanData=null;
    this.newIconBase64="";

    //paramsは、{user_id:"", type:"", temp:"", name:""}
    this.user_id=params.user_id;
    this.name=params.name;
    this.type=params.type;
    this.temp=params.temp;

    this.saveData=this.saveData.bind(this);
    this.saveIcon=this.saveIcon.bind(this);
    this.documentPick=this.documentPick.bind(this);
    this.imagePick=this.imagePick.bind(this);
    this.modalDone=this.modalDone.bind(this);
    this.modalCancel=this.modalCancel.bind(this);
  }

  alertError(error, at){
    console.log("----------"+at+"----------\n"+error);
    if(at==="xhr"){
      Alert.alert("サーバーとの通信でエラーが発生しました", "オフラインの可能性があります");
    }else if(at==="readFile"){
      Alert.alert("ファイルを読み込めませんでした");
    }else if(at==="save"){
      Alert.alert("保存できませんでした");
    }else if(at==="cropping"){
      Alert.alert("切り抜きでエラーが発生しました。");
    }
  }

  saveData(){
    console.log("try to save edited profile");
    const newProfile=this.state.newProfile;
    if(!newProfile||newProfile===this.temp)return;
    fetch("http://localhost:3000/api/editProfile", {
      method: "POST",
      headers: {
        "Accept":"application/json",
        "Content-Type":"application/json",
      },
      body: JSON.stringify({user_id:this.user_id, hashed_pass:"password01", type:this.type, newVal:newProfile})
    }).then(response=>response.json()
    ).then(responseJson=>{
      //なに帰ってくるか分からないから適当 {succeed:trueかfalse, reason:失敗したならその理由} を想定
      if(responseJson.succeed){
        Alert.alert("保存しました");
      }else{
        this.alertError(response.reason, "save");
      }
    }).catch(err=>this.alertError(err, "xhr"));
  }

  saveIcon(){
    (async ()=>{
      try{
        const base64=this.newIconBase64;
        if(!base64)return;

        const xhr=new XMLHttpRequest();//進捗出すためにxhr
        xhr.open("POST", "http://localhost:3000/api/editIcon");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onprogress=progress=>{
          if(!progress.lengthComputable)return;
          const tempProgress=progress.loaded, total=progress.total;
          console.log(tempProgress, total);
          //TODO いい感じに進捗バー動かす
        };
        xhr.onload=response=>{
          console.log("load",response);
          //なに帰ってくるか分からないから適当 {succeed:trueかfalse, reason:失敗したならその理由} を想定
          if(response.succeed){
            Alert.alert("保存しました");
          }else{
            this.alertError(response.reason, "save");
          }
        };
        xhr.onerror=err=>{
          this.alertError(err, "xhr");
        };
        xhr.send({"icon":base64, user_id:this.user_id, hashed_pass:"password1"});
      }catch(e){
        this.alertError(e, "readFile");
      }
    })();
  }

  documentPick(){
    (async ()=>{
      console.log("documentPick");
      const file=await getDocumentAsync({type:"image/*", copyToCacheDirectory:false});
      if(file.type!=="cancel"){
        const uri=file.uri;
        this.pickedIconUri=uri;
        this.prePanData=null;
        this.setState({newIconUri:uri, modal:true});
      }
    })();
  }

  imagePick(){
    (async ()=>{
      console.log("ImagePick");
      const permisson=await expoImagePicker.getMediaLibraryPermissionsAsync();
      if(permisson==="none"){
        const reqestPermisson=await expoImagePicker.requestMediaLibraryPermissonsAsync();
        if(requestPermisson==="none")return;
      }
      const file=await expoImagePicker.launchImageLibraryAsync({mediaTypes:expoImagePicker.MediaTypeOptions.Images, exif:false, base64:false});
      if(!file.cancelled){
        const uri=file.uri;
        this.pickedIconUri=uri;
        this.prePanData=null;
        this.setState({newIconUri:uri, modal:true});
      }
    })();
  }

  modalCancel(){
    this.setState({modal:false});
  }

  modalDone(){
console.log("done");
    const zoomImg=this.zoomImg;
    const cropData=zoomImg.getCropData.bind(zoomImg)();
    (async ()=>{
      try{
        const {state}=this;
        const croppedImg=await ImageManipulator.manipulateAsync(this.pickedIconUri, [{crop:cropData}], {compress:1, base64:true});
        this.setState({newIconUri:croppedImg.uri, modal:false});
        this.newIconBase64=croppedImg.base64;
      }catch(e){
        this.alertError(e, "cropping");
      }
    })();
  }

  render(){
    const state=this.state;
    const {newIconUri}=state;
    if(this.type==="icon"){
      return (
        <View style={style.root}>
          <Text style={style.h1}>アイコンを変更</Text>
          <View style={style.row}>
            <TouchableWithoutFeedback onPress={this.documentPick}>
              <View>
                <Text style={style.p}>ファイル</Text>
                <Image source={require("./images/folder.png")} style={style.image}/>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.imagePick}>
              <View>
                <Text style={style.p}>カメラロール</Text>
                <Image source={require("./images/cameraroll.png")} style={style.image}/>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={style.row}>
            <View>
              <Text style={style.p}>現在のアイコン</Text>
              <Image source={{uri:this.temp}} style={[style.image, style.icon]}/>
            </View>
            <View>
              <Text style={style.p}>新しいアイコン</Text>
              {newIconUri?
                  <Image source={{uri:newIconUri}} style={[style.image, style.icon]}/>
                : <View style={[style.image, style.icon]}/>
              }
            </View>
          </View>
          {state.modal?//androidでbuttonがEditIconの上に表示されるっぽいので
              null
            : <>
                <Button onPress={()=>state.newIconUri&&this.setState({modal:true})} title="編集" style={style.button}/>
                <Button onPress={this.saveIcon} title="保存" style={style.button}/>
              </>
          }
          <SimpleModal visible={state.modal} cancel={this.modalCancel} done={this.modalDone} style={{height:"80%"}}>
            <ZoomImage ref={ref=>this.zoomImg=ref} uri={this.pickedIconUri} panData={this.prePanData} outputPanData={panData=>this.prePanData=panData}/>
          </SimpleModal>
        </View>
      );
    }else{
      return (
        <View style={style.root}>
          <Text style={style.h1}>{this.name}を変更</Text>
          <TextInput value={state.newProfile} onChangeText={text=>this.setState({newProfile:text})} style={style.input}/>
          <Button onPress={()=>this.setState({newProfile:this.temp})} title="リセット" style={style.button}/>
          <Button onPress={this.saveData} title="保存" style={style.button}/>
        </View>
      );
    }
  }
}

const style=StyleSheet.create({
  root:{
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50
  },
  h1:{
borderWidth:1,
    fontSize: 25,
    justifyContent: "center"
  },
  p:{
    textAlign: "center"
  },
  image:{
    height: 50,
    width: 50,
borderWidth: 1
  },
  icon:{
    height: 100,
    width: 100
  },
  button:{
  },
  input:{
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  row:{
    flexDirection: "row",
    alignItems: "center"
  }
});

class ZoomImage extends React.Component{
  constructor(props){
    super(props);
    this.onLayout=this.onLayout.bind(this);
    this.state={width:500, height:500, pan:{x:0,y:0}, cropSize:0, zoom:1};
    this.touchStart=new Map();
    this.prePan={x:0,y:0};
    this.zoomStart={d:0, center:{x:0,y:0}, centerRatio:{x:0,y:0}, zoom:1};
    this.min={zoom:0, top:0, left:0};
    this.preLength=0;
    this.preTime=0;
    this.cropStyle={dx:0, dy:0, leftOfRight:0, topOfBottom:0};
    this.panResponder=PanResponder.create({
      onStartShouldSetPanResponder: ()=>true,
      onMoveShouldSetPanResponder: ()=>true,
      onPanResponderStart: evt=>{
          const touches=evt.nativeEvent.touches;
          const length=touches.length;
          touches.forEach(touch=>
            this.touchStart.set(touch.identifier, {x:touch.pageX, y:touch.pageY})
          );
          if(length===2){
            this.initZoom(touches);
            if(this.preLength===1)this.prePan=this.state.pan;
          }
          this.preLength=length;
          this.preTime=touches[0].timestamp;
          console.log("---start---",this.touchStart);
        },
      onPanResponderMove: evt=>{
          const touches=evt.nativeEvent.touches;
          const length=touches.length;
          if(length===1){
            const touch=touches[0];
            if(touch.timestamp-this.preTime<50)return;
            const id=touch.identifier;
            const touchStart=this.touchStart.get(id);
            if(!touchStart)return;
            const nowX=touch.pageX, nowY=touch.pageY;
            const {prePan}=this;
            this.setState({pan: this.forceInside(nowX-touchStart.x+prePan.x, nowY-touchStart.y+prePan.y)});
            this.preTime=touch.timestamp;
console.log("single");
          }else if(length===2){
            const touch1=touches[0], touch2=touches[1];
            if(touch1.timestamp-this.preTime<50)return;
            const id1=touch1.identifier, id2=touch2.identifier;
            const touchStart1=this.touchStart.get(id1), touchStart2=this.touchStart.get(id2);
            if(!touchStart1||!touchStart2)return;
            const x1=touch1.pageX, y1=touch1.pageY, x2=touch2.pageX, y2=touch2.pageY;
            const dx=x1-x2, dy=y1-y2;
            const {zoomStart}=this;
            const {centerRatio, dCenter}=zoomStart;
            const minZoom=this.min.zoom;
            let zoomTmp=(Math.abs(dx)+Math.abs(dy))/zoomStart.d;
            let zoom=zoomTmp*zoomStart.zoom;
            if(zoom<minZoom)zoom=minZoom;
            if(zoom>2000){
              zoom=2000;
              zoomTmp=2000/zoomStart.zoom;
            }
            this.setState({pan: this.forceInside(x2+dx/2-dCenter.x-centerRatio.x*zoomTmp, y2+dy/2-dCenter.y-centerRatio.y*zoomTmp, zoom), zoom});
            this.preTime=touch1.timestamp;
console.log("d",zoom);
          }
        },
      onPanResponderEnd: evt=>{
            const nativeEvt=evt.nativeEvent;
            nativeEvt.changedTouches.forEach(touch=>this.touchStart.delete(touch.identifier));
            const touches=nativeEvt.touches;
            const length=touches.length;
            if(this.preLength===2&&length===1){
              const touch=touches[0];
              this.prePan=this.state.pan;
              this.touchStart.set(touch.identifier, {x:touch.pageX, y:touch.pageY});
            }else if(length===2){
              this.initZoom(touches);
            }
            this.preLength=length;
console.log("end");
        },
      onPanResponderRelease: ()=>{
          this.prePan=this.state.pan;
console.log("release");
        }
    });
  }

  componentWillUnmount(){
    const {outputPanData}=this.props;
    if(outputPanData)outputPanData({pan:this.state.pan, zoom:this.state.zoom});
  }

  forceInside(x,y, zoom=this.state.zoom){
    const {top, left}=this.min;
    const {state}=this;
    const {cropSize}=state
    const bottom=top-zoom*state.height+cropSize, right=left-zoom*state.width+cropSize;
    if(y>top)y=top;
    else if(bottom>y)y=bottom;
    if(x>left)x=left;
    else if(right>x)x=right;
    return {x,y};
  }

  initZoom(touches){
    const touch1=touches[0], touch2=touches[1];
    const x1=touch1.pageX, y1=touch1.pageY, x2=touch2.pageX, y2=touch2.pageY;
    const dx=x1-x2, dy=y1-y2;
    const {state, prePan}=this;
    const center={x:x2+dx/2, y:y2+dy/2};
    const centerRatio={x:(touch1.locationX+touch2.locationX)/2-prePan.x, y:(touch1.locationY+touch2.locationY)/2-prePan.y};
    this.zoomStart={dCenter:{x:center.x-centerRatio.x-prePan.x, y:center.y-centerRatio.y-prePan.y},centerRatio, d:Math.abs(dx)+Math.abs(dy), zoom:state.zoom};
console.log("i",this.state.zoom);
  }

  onLayout(evt){
    evt=evt.nativeEvent.layout;
    const {width, height}=evt;
    const {panData}=this.props;
    const cropSize=(width>height?height:width)*0.8;
    const dx=(width-cropSize)/2, dy=(height-cropSize)/2;
console.log("----------",panData);
    if(panData){
      this.prePan=panData.pan;
      this.setState({pan:panData.pan, cropSize});
    }else{
      this.prePan={x:dx, y:dy};
      this.setState({pan:{x:dx, y:dy}, cropSize});
    }
    const {min}=this;
    min.top=dy;
    min.left=dx;
    this.cropStyle={dx, dy, leftOfRight:width-dx, topOfBottom:height-dy};
    Image.getSize(this.props.uri, (imgWidth, imgHeight)=>{
      const minZoom=cropSize/(imgWidth>imgHeight?imgHeight:imgWidth);
      min.zoom=minZoom;
      const zoom=panData?panData.zoom:minZoom;
      this.zoomStart.zoom=zoom;
      this.setState({width:imgWidth, height:imgHeight, zoom});
    });
    console.log("--------------layout");
  }

  static floor(num){
    return Math.floor(num*1000)/1000;
  }

  getCropData(){
    const {pan, zoom}=this.state;
    const {cropStyle}=this;
    const size=Math.floor(this.state.cropSize/zoom);
    return {
      originX:Math.floor((cropStyle.dx-pan.x)/zoom), originY:Math.floor((cropStyle.dy-pan.y)/zoom),
      width:size, height:size
    };
  }

  render(){
    const {state}=this;
    const {pan, cropSize, zoom}=state;
    const {dx, dy, leftOfRight, topOfBottom}=this.cropStyle;
    return (
      <View style={{flex:1, overflow:"hidden"}} onLayout={this.onLayout} {...this.panResponder.panHandlers}>
        <Image style={{position:"absolute", top:pan.y, left:pan.x, width:state.width*zoom, height:state.height*zoom}} source={{uri:this.props.uri}} defaultSource={{uri:this.props.uri}}/>
        <Image source={require("./images/crop.png")} style={{position:"absolute", top:dy, left:dx, width:cropSize, height:cropSize}}/>
        <View style={{position:"absolute", top:0, left:0, width:"100%", height:dy, backgroundColor:"#000a"}}/>
        <View style={{position:"absolute", top:dy, left:0, width:dx, height:cropSize, backgroundColor:"#000a"}}/>
        <View style={{position:"absolute", top:dy, left:leftOfRight, width:dx, height:cropSize, backgroundColor:"#000a"}}/>
        <View style={{position:"absolute", top:topOfBottom, left:0, width:"100%", height:dy, backgroundColor:"#000a"}}/>
      </View>
    );
  }
}
