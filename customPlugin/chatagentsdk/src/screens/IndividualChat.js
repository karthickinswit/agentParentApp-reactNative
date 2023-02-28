import React, {useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Variables from '../utils/variables';



function IndividualChat(route) {
  //  const {chats, setChats} = useContext(GlobalContext);

  console.log('Chat using context', JSON.stringify(chats));
  console.log('In individual chatparams-->',route.value.chatId);
   const [chats, setMyChats] = React.useState(route.value);
  // let chats = route.value;
  let chatId = route.value.chatId;
  let chatIndex = chats.messages.map((response,index) => {
    console.log('REponse', response.chatId, ' ', chatId);
    if(response.chatId == chatId) return  index ;
  });
  console.log('Item variable index', chatIndex);
  // let messagehistory = chats[index].messages.map(res => res);

  // console.log('messagehistory', messagehistory);

  // React.useEffect(() => {
  //   ChatBody();
  // }, [chats]);

  let ChatHeader = () => {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.navigate('ChatListPage');
            }}>
            <Image
              source={require('../../assets/twixor_hd_icon.png')}
              style={styles.logo}
            />
          </TouchableOpacity>
          <View style={styles.leftContainer}>
            <Image
              source={{uri: chats.customerIconUrl}}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{chats.customerName}</Text>
              <Text style={styles.subtitle}>
                {
                  chats.messages[
                    chats.messages.length - 1
                  ].message
                }
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  let ChatBody = () => {
    let renderMessage = ({item}) => {
      return (
        <ScrollView
          style={
            item.actionBy === Variables.AgentId
              ? styles.messageSent
              : styles.messageReceived
          }>
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.timestampText}>{item.timestamp}</Text>
        </ScrollView>
      );
    };

    return (
      <FlatList
        data={chats.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.actionId.toString()}
        contentContainerStyle={styles.contentContainer}
        legacyImplementation={true}
        extraData={chats.messages}
      />
    );
  };

  let ChatFooter = () => {
    let [message, setMessage] = React.useState('');

    let handleSendMessage = () => {
      console.log(message);
      setMessage('');
    };

    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.footercontainer}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Image
              source={require('../../assets/add_128.png')}
              style={styles.attachmentIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}>
            <Image
              source={require('../../assets/send_128.png')}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <>
      <ChatHeader />
      <ChatBody />
      <ChatFooter />
    </>
  );
}

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  menuButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageSent: {
    backgroundColor: '#ecf6fd',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageReceived: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  footercontainer: {
    position: 'absolute',
    bottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  attachmentButton: {
    marginRight: 16,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 150,
  },
  sendButton: {
    marginLeft: 16,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
});

export default IndividualChat;
