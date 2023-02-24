import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {Tab, TabView} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

let ActiveChats = chats => {
  const navigation = useNavigation();
  setTimeout(() => {
    console.log('Active chat tab-->', JSON.stringify(chats.value));
  }, 3000);

  const [dataItem, setDataItem] = useState(chats.value);
  useEffect(() => {}, [dataItem]);

  let renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('IndividualChat', {item});
      }}>
      <View style={styles.item}>
        <Image source={{uri: item.customerIconUrl}} style={styles.avatar} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.customerName}</Text>
          <Text style={styles.lastMessage}>
            {item.messages[item.messages.length - 1].message}
          </Text>
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

  if (chats.value) {
    return (
      <FlatList
        legacyImplementation={true}
        data={dataItem}
        keyExtractor={item => item.chatId.toString()}
        renderItem={renderItem}
        extraData={chats.value.messages}
      />
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

let ChatHeader = globalData => {
  let tempData = globalData.value.globalData;
  const clickNotify = () => {};
  console.log('ChatHeader', JSON.stringify(globalData));

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Image
          source={require('../../assets/twixor_hd_icon.png')}
          style={styles.logo}
        />
        <View style={styles.status}>
          <Text style={styles.logotext}>Chats {tempData}</Text>
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
          <Image
            source={require('../../assets/notification_64.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

let Tabs = chats => {
  const [index, setIndex] = React.useState(0);
  setTimeout(() => {
    console.log('chats in tab ', chats.value.chats);
  }, 2000);

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
          <ActiveChats value={chats.value.chats} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          <ClosedChats />
        </TabView.Item>
      </TabView>
    </>
  );
};

let ChatListPage = (chats, setChats, globalData) => {
  console.log('ChatScreen', chats);
  console.log('ChatScreen-->globaldata', globalData);
  console.log('ChatList page-->');
  const [mounted, setMounted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (isLoaded) {
    return (
      <>
        <ChatHeader value={chats.value} />
        <Tabs value={chats.value} />
      </>
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
