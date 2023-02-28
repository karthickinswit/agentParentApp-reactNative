import React, {createContext, useContext, useEffect, useState} from 'react';

import ChatListPage from '../screens/ChatScreen';
import {messageService} from '../services/websocket';
import Variables from '../utils/variables';
import {activeChats} from '../services/api';
import websocket from '../../src/services/websocket';
import subUser from '../../src/services/websocket'
import IndividualChat from '../screens/IndividualChat';
import {SafeAreaView, ActivityIndicator, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
// import GlobalContext from '../utils/globalupdate'
import MyContext from '../components/globalcontext';
//   const GlobaltempContext = useContext(GlobalContext);
import {GlobalContext} from '../utils/globalupdate';
const Stack = createStackNavigator();
// const GlobaltempContext = useContext(GlobalContext);
export const ChatMessageScreen = (route) => {
 
  const [globalData, setGlobalData] = useState("Hi testing");
  const [agents, setAgents] = useState([]);
  //  const {chats, setChats} = useContext(MyContext);

  const route1=useRoute();
  console.log("Route1",JSON.stringify(route1));
  // let[chat,setChat]=useState(route1.params.item);
  console.log(chat);
//   const [chat, setChat] = useState(chat);
  const[users,SetUsers]=useState();
  const[newMessages,setNewMessages]=useState();
  

 

  if (!chat) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        }}>
        <Text>Loading data...</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
        <MyContext.Provider value={chat}>
        <IndividualChat value={route1.params.item} /> 
        </MyContext.Provider>

      </SafeAreaView>
    );
  }
  
};


