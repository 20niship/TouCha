import 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import AppLoading from 'expo-app-loading';
import Archive from './utils/archive'
import CreateRoom from './utils/createRoom'
import Profile from './utils/profile'
import Room from './utils/room'
import Setting from './utils/setting'
import {
    NavigationContainer
} from '@react-navigation/native';
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack';
import { useFonts } from 'expo-font'

const Stack = createStackNavigator();

const requestPermissionsAsync = async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) { return }
    await Notifications.requestPermissionsAsync();
}

export default function App() {
    const [isLoaded] = useFonts({
        "CustomFont": require("./assets/fonts/3270-NF.otf"),
        "Mplus": require("./assets/fonts/Mplus.ttf")
    })

    React.useEffect(() => {
        requestPermissionsAsync();
    })

    if (!isLoaded) {
        return <AppLoading />;
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="OpenRoom"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
                        component={Archive} />
                    <Stack.Screen name="Room"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
                        component={Room} />
                    <Stack.Screen name="Profile"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
                        component={Profile} />
                    <Stack.Screen name="Setting"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
                        component={Setting} />
                    <Stack.Screen name="createNewRoom"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS }}
                        component={CreateRoom} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
