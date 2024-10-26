import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const DashboardScreen = () => {
  const friendsActivities = [
    {
      id: '1',
      name: 'Alice Johnson',
      activity: 'Completed a 10-mile run',
      date: '2024-10-24',
      profilePic: 'https://example.com/alice-pic.png', // Replace with Alice's profile picture URL
    },
    {
      id: '2',
      name: 'Bob Smith',
      activity: 'Finished a coding project',
      date: '2024-10-23',
      profilePic: 'https://example.com/bob-pic.png', // Replace with Bob's profile picture URL
    },
    {
      id: '3',
      name: 'Charlie Brown',
      activity: 'Attended a yoga class',
      date: '2024-10-22',
      profilePic: 'https://example.com/charlie-pic.png', // Replace with Charlie's profile picture URL
    },
    // Add more friends' activities as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.activityCard}>
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      <View style={styles.activityInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.activityText}>{item.activity}</Text>
        <Text style={styles.activityDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Friends' Activities</Text>
      <FlatList
        data={friendsActivities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f8ef1',
  },
  activityText: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default DashboardScreen;