import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../api/axiosInstance'; // Ensure the correct path to your axios instance

const ActivityScreen = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities from the backend
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get('/activities/all'); // Update with your actual endpoint
        setActivities(response.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="checkmark-circle" size={24} color={item.status === 'Completed' ? '#27ae60' : '#f39c12'} />
        <Text style={styles.activityTitle}>{item.activity_name}</Text>
      </View>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.activityPoints}>Points: {item.points}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity Log</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.activity_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  activityPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
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
