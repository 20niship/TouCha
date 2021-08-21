import * as React from 'react';
import Client from '../client'
import * as SecureStore from 'expo-secure-store'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    Alert,
} from 'react-native';

const client = new Client()

export default class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.username = null
        this.password = null
    }

    async createAccount(navigation) {
        if (this.username == null) {
            Alert.alert('ユーザー名を入力してください')
        } else if (this.password == null) {
            Alert.alert('パスワードを入力してください')
        } else {
            var res = await client.post('/createAccount',
                {
                    email: await SecureStore.getItemAsync('email'),
                    username: this.username,
                    password: this.password,
                    token: Number(await SecureStore.getItemAsync('token'))
                })
            var res = await res.json()
            console.log(res.status)
            var res = await client.post('/login', { email: await SecureStore.getItemAsync('email'), password: this.password })
            var res = await res.json()
            console.log(res)
            if (res.status == 'success') {
                SecureStore.setItemAsync('accessCode', res.accessCode)
                Alert.alert(`Welcome To TouCha! ${this.username}`)
                navigation.navigate('Archive')
            } else if (res.status == 'noUser') {
                Alert.alert('No Such User was Found')
            } else if (res.status == 'invalidPassword') {
                Alert.alert('Password was Invalid')
            }
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text
                    style={styles.text}>
                    UserName
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => { this.username = text }}
                />
                <Text
                    style={styles.text}>
                    password
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => { this.password = text }}
                    placeholder={"@utac.u-tokyo.ac.jp"}
                />
                <Button
                    title="アカウント作成"
                    color="#f00"
                    onPress={() => this.createAccount(navigation)}
                />
                <Button
                    title="戻る"
                    color="#00f"
                    onPress={() => navigation.navigate("Login")}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 70
    },
    button: {
        color: "#fff"
    },
    textInput: {
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        margin: 15
    }

});
