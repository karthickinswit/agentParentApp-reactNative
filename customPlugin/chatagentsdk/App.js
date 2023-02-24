import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen'
import ChatScreen from './src/screens/ChatScreen';
import IndividualChat from './src/screens/IndividualChat'

const Stack = createStackNavigator();

let App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator >
          {/* <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} /> */}
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
          <Stack.Screen name="IndividualChat" component={IndividualChat} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


export default App;
