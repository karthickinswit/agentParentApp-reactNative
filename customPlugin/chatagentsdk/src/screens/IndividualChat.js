import React, {useContext,useState} from '../../../../node_modules/react';
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
  Animated,
  Dimensions,
} from '../../../../node_modules/react-native';
import {useNavigation} from '@react-navigation/native';
import Variables from '../utils/variables';
import {messageService} from '../services/websocket';
const {height} = Dimensions.get('screen');
import { GlobalContext } from '../utils/globalupdate';
import { timeConversion } from '../utils/utilities';
let flatList = React.useRef(null);
let val=0;
// MemoContext=React.createContext();
const IndividualChat = (route) => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

 // console.log("IndivdualChat--> ",JSON.stringify(route.params.chat.messages));
//console.log("Loading Count--> ",val)
  // route.initialParams.setLoadCount(route.initialParams.loadCount+1);
  val=val+1;
  //console.log("after Loading Count--> ",val)

  

  // console.log('Chat using context', JSON.stringify(route));
 // create a new animated node with identifier 'fadeAnim'
  // let oriRoute = route.route;
  // console.log('In individual chatparams-->', oriRoute.params.chatId);

  // let chatId = oriRoute.params.chatId;
  // let chatIndex = route.extraData.find((response) => {
  //   return response.chatId == oriRoute.params.chatId
  // });

  
   // let flatList = React.useRef(null);
  
    console.log('Chat using context', JSON.stringify(route));
    let oriRoute = route.route;
    console.log('In individual chatparams-->', oriRoute.params.chat);
    const[chat,setChat]=useState(oriRoute.params.chat);
    
  
  
    React.useEffect(() => {
    
    },);
  
    let ChatHeader = () => {
      const navigation = useNavigation();
  
      return (
        <SafeAreaView style={{backgroundColor: 'white'}}>
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.replace('ChatListPage');
              }}>
              <Image
                source={require('../../assets/chevron-left-solid.png')}
                style={{   width: 30,
      height: 30,
    borderRadius:30}}
              />
            </TouchableOpacity>
            <View style={styles.leftContainer}>
              <Image
                source={{uri: chat.customerIconUrl}}
                style={styles.avatar}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{chat.customerName}</Text>
                <Text style={styles.subtitle}>
                  {
                    chat.messages[
                      chat.messages.length - 1
                    ].message
                  }
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              {/* <Text>Back</Text> */}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    };
  
    let ChatBody = () => {
      let renderMessage = ({item, index}) => {
        if(item.actionType==0||item.actionType ==1){
          return (
            <ScrollView>
              <View style={
                styles.messageSent
              }>
              <Text style={styles.messageText} key={index}>
                {item.message}
              </Text>
              <Text style={styles.timestampText}>{timeConversion(item.actedOn)}</Text>
              </View>
            </ScrollView>
          );
        }
        else if(item.actionType ==2){
          return (
            <ScrollView>
              <View style={
                styles.messageHeader
              }>
              <Text style={styles.messageText} key={index}>
                {item.message}
              </Text>
              
              </View>
            </ScrollView>
          );
        }
        else if(item.actionType ==3){
          return (
            <ScrollView>
              <View style={
                styles.messageReceived
              }>
              <Text style={styles.messageText} key={index}>
                {item.message}
              </Text>
              <Text style={styles.timestampText}>{timeConversion(item.actedOn)}</Text>
              </View>
            </ScrollView>
          );
            }
        
      };
      if (chat.messages) {
      return (
        <SafeAreaView style={{marginBottom:60}}>
        <FlatList
          data={chat.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.actionId.toString()}
          contentContainerStyle={styles.contentContainer}
          legacyImplementation={true}
          extraData={true}
          ref={flatList}
    onContentSizeChange={()=> flatList.current.scrollToEnd()}
        
        />
        </SafeAreaView>
        
      );
    } else {
      return <Text> Loading.....</Text>;
    }
    };
  
    let ChatFooter = () => {
      let [message, setMessage] = React.useState('');
  
      let handleSendMessage = () => {
        console.log(message);
        const sendObject = {'action':'agentReplyChat','eId':chat.eId,'message':message,'contentType':'TEXT','chatId':chat.chatId,'attachment':{},'pickup':false};
        console.log('send Object',sendObject);
        messageService.sendMessage(sendObject);
        setMessage('');
      };
  
      return (
        <SafeAreaView style={{backgroundColor: 'white'}}>
          <View style={styles.footerContainer}>
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
  };
  
  let styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 50,
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
      flex:1
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
      paddingBottom: 40,
      
    },
    messageSent: {
      backgroundColor: '#ecf6fd',
      alignSelf: 'flex-end',
      maxWidth: '80%',
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
    },
    messageHeader: {
      backgroundColor: '#ecf6fd',
      alignSelf: 'center',
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
    footerContainer: {
      position: 'absolute',
      bottom: 40,
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