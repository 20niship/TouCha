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

export default class EmailAuthentication extends React.Component {
    constructor(props) {
        super(props);
        this.token = null
    }
    async sendAgain() {
        var email = await SecureStore.getItemAsync('email')
        Alert.alert(`${email}に送信しました`)
        await client.post('/requestToken', { email: email }) // TODO ここをthis.emailに
    }

    async userAuthentication(navigation) {
        var isValid = await client.post('/emailAuthentication', { email: await SecureStore.getItemAsync('email'), token: this.token })
        var data = await isValid.json()
        if (data.status) {
            await SecureStore.setItemAsync('token', this.token)
            navigation.navigate('CreateAccount')
            console.log('Token is Valid')
        } else {
            Alert.alert('Is Not Valid Token')
        }
    }

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <Text
                    style={styles.text}>
                    Tokenを入力
                </Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => { this.token = text }}
                    keyboardType='number-pad'
                />
                <Button
                    title="アカウント作成"
                    color="#f00"
                    onPress={() => this.userAuthentication(navigation)}
                />
                <Button
                    title="再度送る"
                    color="#0f0"
                    onPress={() => this.sendAgain()}
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
        fontSize: 100,
        alignContent: 'center'
    },
    button: {
        color: "#fff",
        alignContent: 'center'
    },
    textInput: {
        width: 300,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        margin: 15
    }

});
