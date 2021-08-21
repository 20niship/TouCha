import * as React from 'react';
import * as SecureStore from 'expo-secure-store'
import Client from '../client'
import AppLoading from 'expo-app-loading';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    Alert,
} from 'react-native';

const client = new Client()

export default class startUp extends React.Component {

    state = {
        initPage: 'Login'
    };

    constructor(props) {
        super(props);
    }

    async startUp() {
        var accessCode = await SecureStore.getItemAsync('accessCode')
        var res = await client.post('/checkAccessCode', { accessCode: accessCode })
        var res = await res.json()
        if (res.status == 'ok') {
            console.log(res)
            return true
        }
        return false
    }

    render() {
        const { navigation } = this.props;
        return (
            <View>
                <AppLoading
                    startAsync={async () => {
                        var state = await this.startUp()
                        console.log(state)
                        if (state) {
                            this.setState({ initPage: 'Archive' })
                        } else {
                            this.setState({ initPage: 'Login' })
                        }
                    }}
                    onFinish={() => {
                        navigation.navigate(this.state.initPage)
                        console.log(this.state.initPage)
                    }}
                    onError={() => { }}
                />
                <Text style={styles.text}>
                    Toucha Loading
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 60
    },
});


