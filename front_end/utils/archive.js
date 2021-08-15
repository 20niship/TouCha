import 'react-native-gesture-handler';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import socketHandler from '../proc/socket'
import { NavigationFooter } from './utils'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight, } from 'react-native';

class Open_room extends React.Component {
    constructor(props) {
        super(props);
        this.hSock = new socketHandler();
        this.hSock.createNew();
        this.state = {};
        this.room_data = [
            { name: "room1", icon_name: "user-circle", lastmsg: "Hello room 1", status: "ok", id: "rid1" },
            { name: "room2", icon_name: "user-circle", lastmsg: "Hello room 2", status: "ok", id: "rid2" },
            { name: "room3", icon_name: "user-circle", lastmsg: "Hello room 3", status: "ok", id: "rid3" },
            { name: "room4", icon_name: "user-circle", lastmsg: "Hello room 4", status: "ok", id: "rid4" },
            { name: "room5", icon_name: "user-circle", lastmsg: "Hello room 5", status: "ok", id: "rid5" },
            { name: "room6", icon_name: "user-circle", lastmsg: "Hello room 5", status: "ok", id: "rid6" },
            { name: "room7", icon_name: "user-circle", lastmsg: "Hello room 5", status: "ok", id: "rid7" },
            { name: "room8", icon_name: "user-circle", lastmsg: "Hello room 5", status: "ok", id: "rid8" },
            { name: "room9", icon_name: "user-circle", lastmsg: "Hello room 5", status: "ok", id: "rid9" },
            { name: "room10", icon_name: "user-circle", lastmsg: "Hello room 5", status: "ok", id: "rid10" },
        ];
        this.getRoomData();
    }
    getRoomData() {
        fetch('http://localhost:3000/api/getRoomList', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: "id1" })
        }).then((response) => response.json())
            .then((responseJson) => {
                var rooms = responseJson.room_list;
                console.log(rooms);
            }).catch((error) => {
                console.log(error);
                console.log("[ ERROR ] ERROR server connection noe valid? ネットにつながってないかも")
            });
    }
    render() {
        const { navigation } = this.props;
        var room_list_ui = [];
        this.room_data.forEach((room, index) => {
            room_list_ui.push(
                //特定のルームに移動する頃はできていないので調整必要
                <TouchableOpacity onPress={() => {
                    navigation.navigate("Room", { roomid: room.id, hSock: this.hSock });
                }}
                    style={{ justifyContent: 'space-between', flexDirection: 'row', height: 80 }}>
                    <View style={{ width: 50, height: 50, marginLeft: 20, marginTop: 20 }}>
                        <Icon name={room.icon_name} size={45} />
                    </View>
                    <View style={styles.room_inner_text_1_TD} >
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'Mplus'
                        }}>{room.name}</Text>
                        <Text style={{ fontSize: 14, color: "darkgray" }}>{room.lastmsg}</Text>
                    </View>
                </TouchableOpacity >
            )
        })

        const __createNewRoom = () => { navigation.navigate("createNewRoom", { hSock: this.hSock }); };
        const nav = (str, params) => { this.props.navigation.navigate(str, params); }
        return (
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 50, marginBottom: 10 }}>
                    <View style={{ width: 40 }}></View>
                    <Text style={{
                        fontSize: 20,
                        marginLeft: 10,
                        fontFamily: 'Mplus'
                    }}>Toucha</Text>
                    <TouchableOpacity style={styles.button} onPress={__createNewRoom}>
                        <Text style={styles.nerdFont}>
                            
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={__createNewRoom}>
                        <Text style={styles.nerdFont}>
                            
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView ref={(ref) => { this.scrollView = ref }} style={{
                    height: 630 //heightは機械によって変なことにならないよう変数で調整する
                }}>
                    {room_list_ui}
                </ScrollView>
                <View style={{ height: 40 }}>
                    <NavigationFooter nav={nav} />
                </View>
            </View>
        );
    }
}

export default Open_room;

const styles = StyleSheet.create({
    room_inner_text_1_TD: {
        borderRadius: 5,
        marginTop: 8,
        marginRight: 10,
        marginLeft: 10,
        paddingHorizontal: 0,
        paddingVertical: 8,
        flexDirection: 'column',
        flex: 1,
        fontFamily: '3270'
    },
    messages: {
        backgroundColor: "white"
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
    },
    nerdFont: {
        fontSize: 20,
        fontFamily: "Mplus"
    }
})
