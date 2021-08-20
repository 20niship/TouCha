import io from "socket.io-client";
import React, { Component } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, TouchableHighlight, TouchableOpacity, Keyboard } from 'react-native';
import AutogrowInput from 'react-native-autogrow-input';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class socketHandler {
    constructor() {
        this.socket = null;
        this.isSocketVerified = false;
        this.isSocketConnected = false;
    }

    async _trySocketVerification() {
        console.log("ユーザー認証実施中、、、、")
        var send_msg = {
            'event': 'login',
            'userid': 'id2',
            'hashed_pass': 'password02',
            'ts': new Date().getTime() // タイムスタンプ　https://wiki.aleen42.com/qa/timestamp.html
        }

        this.socket.on('login-verify', (msg) => {
            if (msg == "login-accepted") {
                this.isSocketVerified = true;
                console.log("User authenticated");
                return true;
            } else if (msg == "login-deny") {
                alert("ユーザー認証に失敗しました。ユーザ情報が間違っている可能性があります。")
            } else {
                alert("ユーザー認証に失敗しました。ルームに参加していない可能性があります");
                // this.backtoArchive();
            }
        });


        // for (let step = 0; step < 2; step++) {
        this.socket.emit('login', JSON.stringify(send_msg));
        // if(this.isSocketVerified){
        //   return true;
        // }
        // }
    }

    createNew() {
        console.log("starting socket.io .....,");
        this.isSocketVerified = false;
        this.isSocketConnected = false;

        try {
            this.socket = io("http://localhost:3000", { transports: ['websocket'] });
        } catch {
            console.log("ソケットの接続に失敗しました。インターネットにつながっていない可能性があります")
        }

        // ------------------------------  ソケット通信をユーザーでログインしてVerifyする  --------------------------------

        this._trySocketVerification();
        this.isSocketVerified = true;
    }

    getSocket() {
        return this.socket;
    }

    close() {
        this.socket.close();
        this.isSocketConnected = false;
        this.isSocketVerified = false;
    }
}

