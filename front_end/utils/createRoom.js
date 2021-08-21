import 'react-native-gesture-handler';
import * as React from 'react';
import { RadioButton } from 'react-native-paper';
import { Text, View, StyleSheet, TextInput, TouchableHighlight, } from 'react-native';

export default class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.init();
    }

    init() {
        console.log("starting socket.io .....,");
        this.isSocketVerified = false;
        this.isSocketConnected = false;

        // ------------------------------  ソケット通信をユーザーでログインしてVerifyする  --------------------------------
        const myparams = this.props.route.params;
        this.state.roomName = myparams.roomid; // 現在のルーム
        this.state.roomID = myparams.roomid;
        this.state.hSock = myparams.hSock;

        this.state.newRoomName = "none";
        this.state.newRoomIcon = "null";
        this.state.newRoomType = "open";
    }

    createNewRoom() {
        console.log("New Room Create!!");
        console.log(this.state);

        this.setState({ ModalVisivle: false }) // close modal

        fetch('http://localhost:3000/api/createNewRoom', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: "id1", hashed_pass: "password01", name: this.state.newRoomName, type: this.state.newRoomType })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status = "ok") {
                    console.log("Roomが正しく作成された！")
                } else {
                    console.log("Error!!!");
                }

                this.forceUpdate(); //画面再レンダリング
            }).catch((error) => {
                console.log("[ ERROR ]サーバーと正常に通信できませんでした (createNewRoom)")
            });
    }

    render() {
        const { navigation } = this.props;
        const __createNewRoom = () => { this.createNewRoom() };
        return (
            <View>
                <Text>Create Room </Text>
                <TextInput
                    style={{
                        width: 300,
                        borderBottomWidth: 1,
                        borderBottomColor: "#ccc",
                        margin: 15
                    }}
                    onChangeText={(text) => this.setState({ newRoomName: text })}
                    placeholder={this.state.newRoomName}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>

                    <RadioButton
                        value="Open"
                        status={this.state.newRoomType === 'Open' ? 'checked' : 'unchecked'}
                        onPress={() => this.setState({ newRoomType: "Open" })}
                    /><Text>Open Room</Text>
                    <RadioButton
                        value="ByInvitation"
                        status={this.state.newRoomType === 'ByInvitation' ? 'checked' : 'unchecked'}
                        onPress={() => this.setState({ newRoomType: "ByInvitation" })}
                    /><Text>制限ルーム</Text>
                </View>


                <Text style={{ margin: 10 }}>「{this.state.newRoomName}」を作成します、、、</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableHighlight onPress={__createNewRoom} activeOpacity={0.2}>
                        <View style={styles.acceptButton}><Text>Create Room</Text></View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => navigation.navigate("Archive")} activeOpacity={0.2}>
                        <View style={styles.cancelButton}><Text>  Cancel  </Text></View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    cancelButton: {
        margin: 10,
        width: 140,
        height: 30,
        backgroundColor: '#bbbbbb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2
    },

    acceptButton: {
        margin: 10,
        width: 140,
        height: 30,
        backgroundColor: '#5555ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2
    }
})
