import * as React from 'react';
import { View, Text } from 'react-native';

export default class Empty extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.visible) {
            return (
                <View>
                    <Text>
                        Hello
                    </Text>
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
