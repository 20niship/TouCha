import * as React from 'react';
import { View, Button, Image, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native';

export default class SimpleModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        if (props.visible) {
            return (
                <View style={[{ position: "absolute", left: 0, bottom: 0, width: "100%", height: "100%", backgroundColor: "black" }, props.style]}>
                    <TouchableWithoutFeedback onPress={props.cancel}>
                        <Image source={require("./images/close.png")} style={{ width: 30, height: 30, margin: 10 }} />
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1 }}>
                        {props.children}
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flex: 1 }} />
                        <Button onPress={props.done} title="OK" style={[style.button, { marginRight: 15, marginBottom: 15 }]} />
                    </View>
                </View>
            );
        } else return null;
    }
}

const style = StyleSheet.create({
    button: {
        color: "#fff"
    }
});
