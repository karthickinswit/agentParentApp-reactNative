import React, {createContext, useContext, useEffect, useState} from '../../../../node_modules/react';

import ChatListPage from '../screens/ChatScreen';
import {messageService} from '../services/websocket';
import Variables from '../utils/variables';
import {activeChats} from '../services/api';
import websocket from '../../src/services/websocket';

import IndividualChat from '../screens/IndividualChat';
import Conversation from '../screens/Conversation';

import {SafeAreaView, ActivityIndicator, Text, View} from '../../../../node_modules/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export const GlobalContext = createContext();
const Stack = createStackNavigator();
import useStates from '../providers/stateProvider';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from 'react-native-popup-menu';
const states = useStates();

export const ChatScreen = ({route}) => {
  const [globalData, setGlobalData] = useState('Hi testing');
  const [agents, setAgents] = useState([]);
  const [chats, setChats] = useState();
  const [chatId, setChatId] = useState('');
  const [users, SetUsers] = useState();
  const [newMessages, setNewMessages] = useState();
  const[newChatCount,setNewChatCount]=useState(0);
  const[invitedChatCount,setInvitedChatCount]=useState(0);
  const[chatUser,setChatUser]=useState([]);
  const[loadCount,setLoadCount]=useState(0);
  const socketListener = React.useRef();

  const[listenerCount,setListenerCount]=useState(0);

  
  invitedChatCount:number = 0;
  transferredChatCount:number = 0;
  
  console.log(JSON.stringify(route.params.userDetails));

   

  Variables.API_URL = route.params.userDetails.baseUrl;
  Variables.ACTIVE_CHATS = '/e/enterprise/chat/summary';
  Variables.CLOSED_CHATS = '/e/enterprise/chat/history?state=3';
  Variables.TOKEN = route.params.userDetails.token;
  Variables.AgentId = route.params.userDetails.userId;

  useEffect(() => {
    console.log('socket Instance', websocket.checkInstance());
    if (!websocket.checkInstance()) {
      websocket.connect();
      //
      // websocket.waitForSocketConnection(() => {
      //   // console.log(websocket);
      //   //socketListener = new messageService.getMessage();
      // });
    }
  },[]);
  useEffect(() => {
    
    
    socketListener.current= messageService.getMessage().subscribe(data => {
      var obj = JSON.parse(data);
      console.log('socket Instance2', websocket.checkConnection());
      console.log('globListen', obj.action);
      //  setGlobalData(obj.action);
      if (obj.action === 'customerStartChat') {
        console.log("New ChatArrived");
            let count=newChatCount;
        setNewChatCount(count+1);
        console.log("New Chat Count increased");
      }
     else if (obj.action === 'agentPickupChat') {
        console.log("New ChatArrived");
        if(obj.content){
          var newChat=obj.content[0].response.chat;
          setChats([...chats,newChat]);
          let count=newChatCount;
        setNewChatCount(count-1);
         // setNewChatCount(--newChatCount);
          console.log("New Chat Pushed");
        }
        // setNewChatCount(newChatCount+1);
        // console.log("New Chat Pushed");
      }

     else if (obj.action === 'customerReplyChat') {
        // console.log("customerReplyChat-->",JSON.stringify(obj.content[0].response));
        var eId = obj.content[0].eId;
        var res = obj.content[0].response;
        var chatId = res.chat.chatId;
        var messages = res.chat.messages;
        // console.log(`CustomerReplyChat--> ${chatId} `);s
       
        // console.log('before Updating', JSON.stringify(chats));
        var currentChat = chats.find(response => {
          return response.chatId == chatId;
        });
       // console.log('before Updating current', JSON.stringify(currentChat.messages[currentChat.messages.length-1]));
        var concatMesssgaes = [...currentChat.messages, ...messages];
       var newChatMessages=[...new Map(concatMesssgaes.map(item => [item.actionId, item])).values()];
      // console.log('before Updating messages', JSON.stringify(newChatMessages));
        
         //console.log('before Updating messages', JSON.stringify(concatMesssgaes));
        currentChat['messages'] = newChatMessages;
       
       
        var newChats = chats.map(chat =>
          chat.chatId !== chatId ? chat : currentChat,
        );

        // console.log('A--->', currentChat);
        
        setChats(newChats);
        //console.log('after Updating', JSON.stringify(currentChat));
      } else if (obj.action === 'agentReplyChat') {
        // console.log("customerReplyChat-->",JSON.stringify(obj.content[0].response));
        var eId = obj.content[0].eId;
        var res = obj.content[0].response;
        var chatId = res.chat.chatId;
        var messages = res.chat.messages;
        // console.log(`CustomerReplyChat--> ${chatId} `);
        var oldChats = chats;
        var currentChat = chats.find(response => {
          return response.chatId == chatId;
        });
        // console.log('before Updating current', JSON.stringify(currentChat));
        var concatMesssgaes = [...currentChat.messages, ...messages];
        concatMesssgaes=[...new Map(concatMesssgaes.map(item => [item.actionId, item])).values()]
         console.log('before Updating messages', JSON.stringify(concatMesssgaes));
        currentChat['messages'] = concatMesssgaes;
        var newChats = chats.map(chat =>
          chat.chatId !== chatId ? chat : currentChat,
        );

        setChats(newChats);
      } else {
        console.log(`${obj.action} == ${obj.action == 'customerReplyChat'}`);
      }
      // setGlobalData(JSON.stringify(obj.action));
    });
    return () => {
     
      socketListener.current.unsubscribe();
      
    }
    
  },[chats]);
  useEffect(() => {
    // get1();

    activeChats()
      .then(data => {
        console.log('data-->', data);
        // const res = data.response.chats;
        //setData(data)
        setChats(data.chats);
        SetUsers(data.users);
        console.log('Chats in Global update2', chats);
        setGlobalData('Hi user');
      })
      .catch(error => console.error('Error:', error));

   // console.log('Chats in Global update', chats);
  }, []);



  
    
  
    
      
    
    // var a=listenerCount+1;;
    // console.log("ListenerCount ",listenerCount);
    // setListenerCount(a);
    // console.log("ListenerCount ",listenerCount);
  
      
    
    
    // return () => {
    //   console.log('This is unmounted.');
    //   if (socketListener) {
    //     // socketListener.unsubscribe();
    //   }
    // };




  if (!chats) {
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
      
      
        
        <GlobalContext.Provider value={chats}>
          <MenuProvider>

          <NavigationContainer independent={true}>
            <Stack.Navigator>
              {/* <ChatListPage value={chats} />  */}
              <Stack.Screen name="ChatListPage" options={{headerShown: false}}>
                {props => (
                  <ChatListPage
                    {...props}
                    extraData={chats}
                    initialParams={{chats,newChatCount,setChatUser}}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen
                name="IndividualChat"
                options={{headerShown: false}}>
                {props => (
                  <IndividualChat
                    {...props}
                    
                    initialParams={{chatUser,setChatUser,loadCount,setLoadCount}}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Conversation"
                options={{headerShown: false}}>
                {props => (
                  <Conversation
                    {...props}
                    
                    initialParams={chatUser}
                  />
                )}
              </Stack.Screen>

              {/* <IndividualChat value={chats} /> */}
            </Stack.Navigator>
          </NavigationContainer>
          </MenuProvider>
          </GlobalContext.Provider>
          
          
    
        
    
    );
  }
};

export const useGlobalData = () => useContext(GlobalContext);
