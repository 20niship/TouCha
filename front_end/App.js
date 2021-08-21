import 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { View, Text } from 'react-native'
// import Loading from './utils/loading'
import Archive from './utils/archive';
import CreateRoom from './utils/createRoom';
import Profile from './utils/profile';
import Room from './utils/room';
import Setting from './utils/setting';
import EditProfile from "./utils/editProfile";
import Login from "./utils/login"
import CreateAccount from "./utils/createAccount"
import TokenRequest from "./utils/tokenRequest.js"
import EmailAuthentication from "./utils/emailAuthentication.js"
import {
    NavigationContainer
} from '@react-navigation/native';
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack';
import { useFonts } from 'expo-font'

const Stack = createStackNavigator();

// 通知の許可をとる関数
const requestPermissionsAsync = async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    if (granted) { return }
    await Notifications.requestPermissionsAsync();
}

// Main Function
export default function App() {
    const [isLoaded] = useFonts({
        "CustomFont": require("./assets/fonts/3270-NF.otf"),
        "Mplus": require("./assets/fonts/Mplus.ttf")
    })

    React.useEffect(() => { // Push通知の許可
        requestPermissionsAsync();
    })


    if (!isLoaded) {
        return (<View>
            <Text>
                Loading
            </Text>
        </View>
        );
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Login">
                    <Stack.Screen name="Login"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}
                        component={Login} />
                    <Stack.Screen name="TokenRequest"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}
                        component={TokenRequest} />
                    <Stack.Screen name="EmailAuthentication"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}
                        component={EmailAuthentication} />
                    <Stack.Screen name="CreateAccount"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, headerShown: false }}
                        component={CreateAccount} />
                    <Stack.Screen name="Archive"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false }}
                        component={Archive} />
                    <Stack.Screen name="Room"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false }}
                        component={Room} />
                    <Stack.Screen name="Profile"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false }}
                        component={Profile} />
                    <Stack.Screen name="Setting"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false }}
                        component={Setting} />
                    <Stack.Screen name="createNewRoom"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false }}
                        component={CreateRoom} />
                    <Stack.Screen name="editProfile"
                        options={{ cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, headerShown: false }}
                        component={EditProfile} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
