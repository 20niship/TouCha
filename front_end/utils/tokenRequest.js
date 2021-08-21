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

var client = new Client()

export default class TokenRequest extends React.Component {
    constructor(props) {
        super(props);
        this.email = null
    }

    async requestToken(navigation) {
        if (this.email == null) {
            console.log('email is null')
            Alert.alert('email を入力してください')
        } else {
            var res = await client.post('/requestToken', { email: this.email, anyway: false })
            var res = await res.json()
            console.log(res)
            if (res.status == 'emailRegistered') {
                Alert.alert('そのEmailはすでに登録されています。',
                    '既存のアカウントを削除して新しくアカウントを作成しますか？',
                    [{
                        text: "はい",
                        onPress: () => {
                            client.post('/requestToken', { email: this.email, anyway: true })
                            navigation.navigate('EmailAuthentication')
                        },
                    },
                    {
                        text: "いいえ",
                        onPress: () => {
                            navigation.navigate('Login')
                        },
                        style: "cancel"
                    }
                    ], { cancelable: true })
            } else {
                SecureStore.setItemAsync('email', this.email)
                navigation.navigate('EmailAuthentication')
            }
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
                    onChangeText={(txt) => { this.email = txt }}
                    placeholder={"@utac.u-tokyo.ac.jp"}
                />
                <Button
                    title="送る"
                    color="#f00"
                    onPress={() => this.requestToken(navigation)}
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
