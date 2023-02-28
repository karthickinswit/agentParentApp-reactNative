/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
// rimport { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import Variables from 'chatagentsdk/src/utils/variables';

import {ChatScreen} from 'chatagentsdk/src/utils/globalupdate';
import {ChatMessageScreen} from 'chatagentsdk/src/providers/individualChatProvider';
import ChatListPage from 'chatagentsdk/src/screens/ChatScreen';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {FAB} from 'react-native-elements';

export default function ChatParent() {
  const Stack = createStackNavigator();
  return (
    // <ChatApp />

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="BlankPage" component={BlankPage} />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen name="ChatMessageScreen" component={ChatMessageScreen} options={{headerShown: false}}/> */}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailerror, setemailerror] = useState('');
  const [passowrderror, setpassworderror] = useState('');
  const navigation = useNavigation();
  // onClickListener = viewId => {
  //   // Alert.alert('Alert', 'Button pressed ' + viewId);
  // };

  const handleForgotPassword = () => {
    // forgot password function here
  };
  const validateEmail = username => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(username.toLowerCase());
  };

  const handleLogin = async () => {
    if ((!validateEmail(username) && password.length < 8) || username == '') {
      setemailerror('Please Provide a Valid Email Address');
      setpassworderror('Password Should not be Empty');
    } else if (password.length < 8) {
      setpassworderror('Password Should not be Empty');
    } else {
      let res = await loginApi();
      console.log('res', res);
      if (res.status) {
        Alert.alert('Attempt Successful');
        console.log(res.response.token);
        navigation.navigate('BlankPage', {
          username: username,
          token: res.response.token,
          uId: res.response.uId,
        });
      } else {
        Alert.alert(res.message.message);
        // navigation.navigate('BlankPage', {
        //   username: username,
        //   token:
        //     'xr1wg9dAst8FByFeyO2yQSnMy414C0QGed6u/3rXdU0fXZJCEMLuKFgxM9RtZPcl',
        // });
      }
    }
  };
  async function loginApi() {
    let payload = {};
    payload.email = username;
    payload.password = password;
    payload.removeExistingSession = true;
    payload.routePath = '';
    payload.appId = 'MOC';

    const loginUri = await fetch(
      `https://qa.twixor.digital/moc/account/enterprise/login/twoFactorAuth?email=${encodeURIComponent(
        payload.email,
      )}&&password=${encodeURIComponent(
        payload.password,
      )}&removeExistingSession=${encodeURIComponent(
        payload.removeExistingSession,
      )}&routePath=&appId=${encodeURIComponent(payload.appId)}`,
      {
        crossDomain: true,
        method: 'POST',
        // headers: myHeaders,
        // body:formdata,//'email=mailkarthi001%40gmail.com&password=karthi5596&removeExistingSession=false&routePath=&appId=MOC'
      },
    );
    const loginResponse = await loginUri.json();

    return loginResponse;
  }
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="User Id"
        onChangeText={setUsername}
        value={username}
      />
      {/* {emailerror && <p>{emailerror}</p>} */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      {/* {passowrderror && <p>{passowrderror}</p>} */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}> Login </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}> Forgot Password? </Text>
      </TouchableOpacity>
    </View>
  );
};
const BlankPage = ({route}) => {
  const navigation = useNavigation();

  const propDetails = {
    name: route.params.username,
    token: route.params.token,
    userId: route.params.uId,
    baseUrl: 'https://qa.twixor.digital/moc',
  };



  const handleClick = async () => {
    Variables.API_URL = propDetails.baseUrl;
    Variables.TOKEN = propDetails.token;
    console.log('Button Clicked');

    navigation.navigate('ChatScreen', {
      userDetails: propDetails,
    });
    // <ChatListPage test={'data received from parent'} />;
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={{marginBottom: 20}}> Hello {route.params.username} </Text>
        {/* <Button title="Click Here" onPress={handleclick}></Button> */}
        <FAB
          title="start Messaging"
          style={styles.floatinBtn}
          onPress={handleClick}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 100,
  },
  input: {
    width: '75%',
    height: 60,
    padding: 10,
    marginBottom: 30,
    borderColor: '#ccc',
    borderRadius: 0,
    // borderBottomWidth: "2px",
    borderBottomColor: 'gray',
    fontSize: 22,
  },
  button: {
    width: '75%',
    height: 60,
    backgroundColor: '#217eac',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  forgotPassword: {
    marginTop: 10,
    marginBottom: '20%',
  },
  forgotPasswordText: {
    color: '#00bcd4',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  floatinBtn: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
