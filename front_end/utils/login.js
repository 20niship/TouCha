import * as React from 'react';
import * as SecureStore from 'expo-secure-store'
import Client from '../client'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    Alert,
} from 'react-native';

const client = new Client()

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.email = null
        this.password = null
    }

    async login(navigation) {
        var res = await client.post('/login', { email: this.email, password: this.password })
        var res = await res.json()
        console.log(res)
        if (res.status == 'success') {
            SecureStore.setItemAsync('accessCode', res.accessCode)
            navigation.navigate('Archive')
        } else if (res.status == 'noUser') {
            Alert.alert('No Such User was Found')
        } else if (res.status == 'invalidPassword') {
            Alert.alert('Password was Invalid')
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text
                    style={styles.text}>
                    Email
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => { this.email = text }}
                />
                <Text
                    style={styles.text}>
                    Password
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => { this.password = text }}
                    placeholder={"@utac.u-tokyo.ac.jp"}
                />
                <Button
                    title="ログイン"
                    color="#f00"
                    onPress={() => this.login(navigation)}
                />
                <Button
                    title="アカウント作成"
                    color="#00f"
                    onPress={() => navigation.navigate("TokenRequest")}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 60
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
