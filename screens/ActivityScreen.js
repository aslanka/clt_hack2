import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons, make sure to install Expo vector icons

const ActivityScreen = () => {
  const activities = [
    { id: '1', title: 'Morning Jog', description: 'Jogged 3 miles in the park', date: 'Oct 20, 2024', status: 'Completed' },
    { id: '2', title: 'React Native Coding', description: 'Worked on Activity Screen design', date: 'Oct 21, 2024', status: 'In Progress' },
    { id: '3', title: 'Data Visualization', description: 'Exploring data insights in Tableau', date: 'Oct 22, 2024', status: 'Pending' },
    // Add more activities as needed
  ];

  const renderItem = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="checkmark-circle" size={24} color={item.status === 'Completed' ? '#27ae60' : '#f39c12'} />
        <Text style={styles.activityTitle}>{item.title}</Text>
      </View>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.activityDate}>{item.date}</Text>
        <Text style={[styles.activityStatus, item.status === 'Completed' ? styles.completed : styles.inProgress]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity Log</Text>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={50} color="#1E90FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#1E90FF',
    color: '#fff',
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#1f8ef1',
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#888',
  },
  activityStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  completed: {
    color: '#27ae60',
  },
  inProgress: {
    color: '#f39c12',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    elevation: 5,
  },
});

export default ActivityScreen;
