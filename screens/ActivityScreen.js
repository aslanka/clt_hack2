import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ActivityScreen = () => {
  const activities = [
    { id: 1, name: 'Throw trash away', points: 10 },
    { id: 2, name: 'Carpool', points: 15 },
    { id: 3, name: 'Use Public Transportation', points: 15 },
    { id: 4, name: 'Recycle Paper, Plastic, glass', points: 15 },
    { id: 5, name: 'Walk or Bike to class', points: 15 },
    { id: 6, name: 'Add to Compost station', points: 15 },
    // Add more activities as needed
  ];

  useEffect(() => {
    // Request camera permission
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permission is required to take a photo.');
      }
    })();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.activityCard} onPress={() => handleActivityClick(item)}>
      <View style={styles.cardHeader}>
        <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
        <Text style={styles.activityTitle}>{item.name}</Text>
      </View>
      <Text style={styles.activityPoints}>{item.points} Points</Text>
    </TouchableOpacity>
  );

  const handleActivityClick = async (activity) => {
    // Launch the camera to capture the image
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the user did not cancel the camera
    if (!result.cancelled) {
      const imageUri = result.uri;

      // Use the image URI for AI validation
      await validateImage(imageUri, activity.name);
    } else {
      Alert.alert('Camera cancelled', 'You did not take a photo.');
    }
  };

  const validateImage = async (imageUri, activityName) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // Adjust this based on your image type
      name: 'photo.jpg',   // You can customize the file name
    });
    formData.append('prompt', `Identify if the action is "${activityName}".`);

    try {
      const response = await axios.post('http://localhost:3000/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Validation Result', response.data.message);
    } catch (error) {
      console.error('Error during validation:', error);
      Alert.alert('Error', 'An error occurred during validation.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity Log</Text>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Ensure ID is a string
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
  activityPoints: {
    fontSize: 14,
    color: '#333',
    marginVertical: 8,
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
