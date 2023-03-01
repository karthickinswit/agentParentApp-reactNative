import React, {createContext, useContext, useEffect, useState} from 'react';

import ChatListPage from '../screens/ChatScreen';
import {messageService} from '../services/websocket';
import Variables from '../utils/variables';
import {activeChats} from '../services/api';
import websocket from '../../src/services/websocket';
import subUser from '../../src/services/websocket'
import IndividualChat from '../screens/IndividualChat';
import {ChatMessageScreen} from '../providers/individualChatProvider';
import {SafeAreaView, ActivityIndicator, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MyContext from '../components/globalcontext';
import {userActionListener} from '../providers/listenerProvider'
export const GlobalContext = createContext();
const Stack = createStackNavigator();
import useStates  from '../providers/stateProvider';
const states = useStates();


// export const someActionListener = (e, states) => {
//   // This should be done
//   states.setMyState(!states.myState);
// }

export const ChatScreen = ({route}) => {
  const [globalData, setGlobalData] = useState("Hi testing");
  const [agents, setAgents] = useState([]);
  const [chats, setChats] = useState();
  const[chatId,setChatId]=useState('');
  const[users,SetUsers]=useState();
  const[newMessages,setNewMessages]=useState();
  let  socketListener=null;
  console.log(route.params.userDetails);

  Variables.API_URL = route.params.userDetails.baseUrl;
  Variables.ACTIVE_CHATS = '/e/enterprise/chat/summary';
  Variables.CLOSED_CHATS = '/e/enterprise/chat/history?state=3';
  Variables.TOKEN = route.params.userDetails.token;
  Variables.AgentId = route.params.userDetails.userId;

  useEffect(()=>{
    console.log("socket Instance",websocket.checkInstance());
    if(!websocket.checkInstance()){
    websocket.connect();
    websocket.waitForSocketConnection(() => {
      // console.log(websocket);
    });
    }

  });
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
        setGlobalData("Hi user");
      })
      .catch(error => console.error('Error:', error));

    console.log('Chats in Global update', chats);

  
  }, [chats]);
  useEffect(()=>{
    if(!socketListener){
      socketListener=new messageService.getMessage();
      socketListener.subscribe(data => {
      var obj = JSON.parse(data);
      console.log("socket Instance2",websocket.checkConnection());
       console.log('globListen', obj.action);
      //  setGlobalData(obj.action);
       if(obj.action==="customerReplyChat"){
        // console.log("customerReplyChat-->",JSON.stringify(obj.content[0].response));
        var eId=obj.content[0].eId;
        var res=obj.content[0].response;
        var chatId=res.chat.chatId;
        var messages=res.chat.messages;
        // console.log(`CustomerReplyChat--> ${chatId} `);
        var oldChats=chats;
        chats.map((response,index)=>{
          // console.log(`CustomerReplyChat inMap--> ${response.chatId} == ${chatId}`);
          if(response.chatId==chatId){
            var newChat=response;
            var oldMessages=response.messages;
            var newMessages=messages;
            // console.log("Set global data-->",JSON.stringify(newMessages[0].message))
            setGlobalData(JSON.stringify(newMessages[0].message));
            console.log("Global data--->",globalData);
            newChat.messages=[...oldMessages,...newMessages];
            oldChats[index]=newChat;
            // console.log("appendMessage-->",JSON.stringify(response.chatId));
            console.log("existing messages-->",JSON.stringify(newChat.messages));
            console.log("new messages-->",JSON.stringify(newMessages));
            console.log("finalarray",[...oldMessages,...messages] );
           setChats(oldChats);
          //  states.setUsers(oldChats);
          // userActionListener(oldChats);
          //  console.log("from state -->",states.users);
          //  setNewMessages()
          //  console.log("after appending messages",JSON.stringify(chats));
          }});



        

       }
       else if(obj.action==="agentReplyChat"){
        // console.log("customerReplyChat-->",JSON.stringify(obj.content[0].response));
        var eId=obj.content[0].eId;
        var res=obj.content[0].response;
        var chatId=res.chat.chatId;
        var messages=res.chat.messages;
        // console.log(`CustomerReplyChat--> ${chatId} `);
        var oldChats=chats;
        chats.map((response,index)=>{
          // console.log(`CustomerReplyChat inMap--> ${response.chatId} == ${chatId}`);
          if(response.chatId==chatId){
            var newChat=response;
            var oldMessages=response.messages;
            var newMessages=messages;
            // console.log("Set global data-->",JSON.stringify(newMessages[0].message))
            setGlobalData(JSON.stringify(newMessages[0].message));
            console.log("Global data--->",globalData);
            newChat.messages=[...oldMessages,...newMessages];
            oldChats[index]=newChat;
            // console.log("appendMessage-->",JSON.stringify(response.chatId));
            console.log("existing messages-->",JSON.stringify(newChat.messages));
            console.log("new messages-->",JSON.stringify(newMessages));
            console.log("finalarray",[...oldMessages,...messages] );
           setChats(oldChats);
          //  states.setUsers(oldChats);
          // userActionListener(oldChats);
          //  console.log("from state -->",states.users);
          //  setNewMessages()
          //  console.log("after appending messages",JSON.stringify(chats));
          }});



        

       }
       else{
        console.log(`${obj.action} == ${obj.action=="customerReplyChat"}`);
       }
      // setGlobalData(JSON.stringify(obj.action));
    });
  }
  },[chats]);

  useEffect(()=>{
  return()=>{
    console.log('This is unmounted.');
    if(socketListener){
    // socketListener.unsubscribe();
    }
  }
  },[])

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
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
        <GlobalContext.Provider value={users}>
        {/* <ChatListPage value={{chats, setChats,globalData}} />  */}
        
        <NavigationContainer independent={true} >
        <Stack.Navigator >
          {/* <ChatListPage value={chats} />  */}
          <Stack.Screen
              name="ChatListPage" options={{headerShown:false}}
            >
              {(props) => <ChatListPage {...props} extraData={chats} initialParams={chats} />}
            </Stack.Screen>
            
          <Stack.Screen
              name="IndividualChat" options={{headerShown:false}}
              >
              {(props) => <IndividualChat {...props} extraData={chats} initialParams={chatId} />}
              </Stack.Screen>
              
            
            
           {/* <IndividualChat value={chats} /> */}
           </Stack.Navigator>
           </NavigationContainer>
        </GlobalContext.Provider>

      </SafeAreaView>
    );
  }
  // } else {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#FFFFFF',
  //       }}>
  //       <Text style={{fontSize: 22, fontWeight: '600', color: '#555555'}}>
  //         Loading..
  //       </Text>
  //       {/* <ActivityIndicator
  //               animating={true}
  //               size="large"
  //               style={{opacity: 1}}
  //               color="#999999"
  //             /> */}
  //     </View>
  //   );
  // }
  // if (mounted) {
  //   return (
  //     <SafeAreaView
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#FFFFFF',
  //       }}>
  //       <ActivityIndicator />
  //     </SafeAreaView>
  //   );
  // } else {
  //   return (
  //     <SafeAreaView
  //       style={{
  //         flex: 1,
  //         backgroundColor: '#FFFFFF',
  //       }}>
  //       <GlobalContext.Provider value={globalData}>
  //         <ChatListPage value={globalData} />
  //         {/* <IndividualChat value={users} /> */}
  //       </GlobalContext.Provider>
  //     </SafeAreaView>
  //   );
  // }
};

export const useGlobalData = () => useContext(GlobalContext);
