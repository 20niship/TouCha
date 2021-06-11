import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
export default class App extends React.Component {
  registerForPushNotificationsAsync = async () => {
    // 実機端末か否かを判定
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      // ユーザーによる通知の許可or許可しないが決定していないときのみ
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      // ユーザーが通知許可しなかった場合は処理を抜ける
      if (finalStatus !== 'granted') return;
      // デバイストークンを取得する
      let token = await Notifications.getExpoPushTokenAsync();
      alert(token);
    } else {
      alert('プッシュ通知は、実機端末を使用してください。');
    }
  };
  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }
  render () {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});