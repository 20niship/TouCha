import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";

export default class Empty extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true }
    }

    render() {
        const { visible } = this.state;
        return (
            <AnimatedLoader
                visible={visible}
                overlayColor="rgba(255,255,255,0.75)"
                source={require("../assets/four_dot_yellow.json")}
                animationStyle={styles.lottie}
                speed={0.8}
            >
                <Text>Toucha Loading ...</Text>
            </AnimatedLoader>
        );
    }
}

const styles = StyleSheet.create({
    lottie: {
        width: 200,
        height: 200
    }
});
