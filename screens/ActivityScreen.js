import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView} from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}> ♻️Activity Log</Text>
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
      <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
        <Ionicons name="add-circle" size={50} color="#27ae60" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff', // Light text color
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#121212', // Header background
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 70,
  },
  activityCard: {
    backgroundColor: '#1E1E1E', // Dark card background
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
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
    color: '#ffffff', // Light text color
  },
  activityDescription: {
    fontSize: 14,
    color: '#ccc', // Lighter text color for description
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
    color: '#27ae60', // Points color
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E1E1E', // Dark background for the button
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
});

export default ActivityScreen;