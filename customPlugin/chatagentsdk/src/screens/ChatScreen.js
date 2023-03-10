import React, {useEffect, useState} from '../../../../node_modules/react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Tab, TabView} from '@rneui/themed';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ChatMessageScreen} from '../providers/individualChatProvider';
import IndividualChat from './IndividualChat';
import Conversation from './Conversation';

import {userActionListener} from '../providers/listenerProvider';
import useStates from '../providers/stateProvider';
import {messageService} from '../services/websocket';

import { timeConversion } from '../utils/utilities';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from 'react-native-popup-menu';

let ActiveChats = props => {
  const navigation = useNavigation();
  // setTimeout(() => {
    // console.log('Active chat tab-->', JSON.stringify(props.value));
     let chats=props.value.chats;
  // }, 3000);
  const [chatList, setChatList] = useState([]);
 // const [chatUserMessages, setChatUserMEssages] = useState([]);
  // const [dataItem, setDataItem] = useState(chats.value);
  React.useEffect(() => {
    // setDataItem(chats.value);
    // navigation.setParams({'chats':chats.value});
    // console.log("before--Values--> ",JSON.stringify(chats.value))
    setChatList(chats);
    // console.log("after--Values--> ",JSON.stringify(chats.value))
  //  setChatUserMEssages(chats.messages);
  });
  // useEffect(() => {
  //   // setDataItem(chats.value);
  //   // navigation.setParams({'chats':chats.value});
  //  // setChatUserMEssages(chatUser.messages);
  // }, []);

  // let renderItem = ({item, index}) => (
  //   <TouchableOpacity
  //     onPress={() => {
  //       navigation.navigate('IndividualChat', {chatId: item.chatId});
  //       // <ChatMessageScreen value={item} />
  //     }}>
  //     <View style={styles.item}>
  //       <Image source={{uri: item.customerIconUrl}} style={styles.avatar} />
  //       <View style={styles.details}>
  //         <Text style={styles.name}>{item.customerName}</Text>
  //         <Text style={styles.lastMessage} key={index}>
  //           {item.messages[item.messages.length - 1].message}
  //         </Text>
  //       </View>
  //       <View style={styles.info}>
  //         <Text style={styles.time}>{item.time}</Text>
  //         {item.unreadCount > 0 && (
  //           <View style={styles.unreadBadge}>
  //             <Text style={styles.unreadCount}>{item.unreadCount}</Text>
  //           </View>
  //         )}
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );


  if (chatList.length > 0) {
    return (
      <ScrollView style={styles.container}>
        {chatList.map((chat, index) => (
          <TouchableOpacity
            key={chat.chatId}
            onPress={() =>{
              // handleChatPress(chat, index)
              props.value.setChatUser(chat);
                navigation.replace('IndividualChat',{chat})
              
              //  navigation.replace('Conversation',{chat})
            }
            }>
            <View style={styles.item}>
              <Image
                source={{uri: chat.customerIconUrl}}
                style={styles.avatar}
              />
              <View style={styles.details}>
                <Text style={styles.name}>{chat.customerName}</Text>
                <Text style={styles.lastMessage}>
                  {chat.messages[chat.messages.length - 1].message}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.time}>{timeConversion(chat.lastModifiedOn['$date'])}</Text>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      // <FlatList
      //   legacyImplementation={true}
      //   data={chats.value}
      //   renderItem={renderItem}
      //   extraData={chatUserMessages}
      // />
    );
  } else {
    return <Text> Loading.....</Text>;
  }
};

let ClosedChats = () => {
  let data = {};
  let renderItem = ({item}) => (
    <TouchableOpacity>
      <View style={styles.item}>
        <Image source={{uri: item.avatar}} style={styles.avatar} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.time}>{item.time}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
    />
  );
};

let ChatHeader = props => {
  // let tempData = globalData.value;
  const clickNotify = () => {
    // agentPickupChat
    const sendObject = {'action':'agentPickupChat',chatId:''};
      console.log('send Object',sendObject);
      messageService.sendMessage(sendObject);
  };
  // console.log('ChatHeader', JSON.stringify(props));

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Image
          source={require('../../assets/twixor_hd_icon.png')}
          style={styles.logo}
        />
        <View style={styles.status}>
          <Text style={styles.logotext}>Chats </Text>
          <View
            style={[styles.statusIndicator, {backgroundColor: '#5ED430'}]}
          />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Image
          source={require('../../assets/search_64.png')}
          style={styles.icon}
        />
        <TouchableOpacity onPress={clickNotify}>
          <View style={styles.badgeSetup}>
            <Image
              source={require('../../assets/notification_64.png')}
              style={styles.icon}
            />
            {props.value.newChatCount>0 ?
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                width: 16,
                height: 16,
                borderRadius: 15 / 2,
                right: 10,
                top: +5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: 8,
                }}>
                {props.value.newChatCount}
              </Text>
            </View> :
            <View />}
            {/* <Badge count={props.value.newChatCount} /> */}
          </View>
        </TouchableOpacity>
        
        <View style={{marginLeft:10,bottom:10}}>
        <Menu style={{position:'absolute',top:0,right:0}}>
     <MenuTrigger  >
           <Image
             source={require('../../assets/inside_menu_64.png')}
             style={{ height: 30, width:8 }}

           />
           </MenuTrigger>
     <MenuOptions optionsContainerStyle=
   {{paddingLeft:4,height:10,width:20}}>

       <MenuOption onSelect={() => alert('No New chats')} text="New Chats - {0}" /><MenuOption onSelect={() => alert('No Transferred Chats')} disabled={true}>
       <Text style={{ color: 'red' }}>Transferred Chat</Text>
     </MenuOption>
     <MenuOption onSelect={() => alert('Invited Chat')} disabled={true} text="Invited Chat" />
     </MenuOptions>
     </Menu>

        
        </View>
        
      </View>
    </View>
  );
};


let Tabs = props => {
  const [index, setIndex] = React.useState(0);
let chats=props.value;
    //console.log('chats in tab ',JSON.stringify (props));


  return (
    <>
      <Tab
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
          borderBottomWidth: 2,
          borderBottomColor: '#2f81ad',
        }}
        variant="transparent">
        <Tab.Item
          title="Active Chats"
          titleStyle={{fontSize: 15, color: '#2f81ad'}}
        />
        <Tab.Item
          title="Closed Chats"
          titleStyle={{fontSize: 15, color: 'gray'}}
        />
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          <ActiveChats value={chats} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          <ClosedChats />
        </TabView.Item>
      </TabView>
    </>
  );
};

let ChatListPage = chats => {
  // console.log('ChatScreen', JSON.stringify(chats));
  // console.log('ChatScreen-->globaldata', chats.extraData);
  // console.log('ChatList page-->');

  const [mounted, setMounted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isLoaded) {
    return (
      
        <><ChatHeader value={chats.initialParams} /><Tabs value={chats.initialParams} /></>
        
      
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
        <Text style={styles.logotext}>Loading..</Text>
        {/* <ActivityIndicator
          animating={true}
          size="large"
          style={{opacity: 1}}
          color="#999999"
        /> */}
      </View>
    );
  }
};

let styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    marginTop: 10,
    marginLeft: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
  },
  logotext: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555555',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSetup: {
    // flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777777',
  },
  info: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 4,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
};

export default ChatListPage;
