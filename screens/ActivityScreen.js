import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, Platform, SafeAreaView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

  // Handle selecting or taking an image
  const pickImage = async (activityId) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('ImagePicker Result URI:', imageUri);
        handleCompleteActivity(activityId, imageUri);
      } else {
        console.log('No assets found');
      }
    } else {
      console.log('ImagePicker was canceled');
    }
  };



  // const handleCompleteActivity = async (activityId, imageUri) => {
  //   console.log('Image URI:', imageUri);
  
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", {
  //       uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
  //       name: 'activity_image.jpg',
  //       type: 'image/jpeg',
  //     });
  
  //     // Send the image to the server for verification
  //     const verificationResponse = await axiosInstance.post('/image', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  
  //     const isRecyclable = verificationResponse.data.description;
  //     console.log(verificationResponse.data.description);
  //     // Show a result message based on the verification
  //     if (isRecyclable === 1) {
  //       Alert.alert('Success', 'The item in the image is recyclable!');
  //     } else {
  //       Alert.alert('Notice', 'The item in the image is not recyclable or unsure.');
  //     }
  
  //     // Update the activity status locally
  //     setActivities((prevActivities) =>
  //       prevActivities.map((activity) =>
  //         activity.activity_id === activityId ? { ...activity, status: 'Completed', imageUri } : activity
  //       )
  //     );
  //   } catch (error) {
  //     console.error('Error verifying image:', error);
  //     Alert.alert('Error', 'Failed to verify the image');
  //   }
  // };

  const handleCompleteActivity = async (activityId, imageUri) => {
    console.log('Image URI:', imageUri);
  
    // Find the activity by its ID to get the description
    const activity = activities.find((activity) => activity.activity_id === activityId);
    const description = activity ? activity.description : '';
  
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
        name: 'activity_image.jpg',
        type: 'image/jpeg',
      });
      formData.append("description", description); // Include the activity description
  
      // Send the image and description to the server for verification
      const verificationResponse = await axiosInstance.post('/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const isRecyclable = verificationResponse.data.description;
      console.log(verificationResponse.data.description);
      // Show a result message based on the verification
      if (isRecyclable === 1) {
        Alert.alert('Success', 'The item in the image is recyclable!');
      } else {
        Alert.alert('Notice', 'The item in the image is not recyclable or unsure.');
      }

      // Update the activity status locally
      setActivities((prevActivities) =>
        prevActivities.map((activity) =>
          activity.activity_id === activityId ? { ...activity, status: 'Completed', imageUri } : activity
        )
      );
    } catch (error) {
      console.error('Error verifying image:', error);
      Alert.alert('Error', 'Failed to verify the image');
    }
  };
  
  
  
  const renderItem = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={styles.cardHeader}>
        <Ionicons name="checkmark-circle" size={24} color={item.status === 'Completed' ? '#27ae60' : '#f39c12'} />
        <Text style={styles.activityTitle}>{item.activity_name}</Text>
      </View>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.activityPoints}>Points: {item.points}</Text>
        {item.status !== 'Completed' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => pickImage(item.activity_id)}
          >
            <Text style={styles.completeButtonText}>Complete with Image</Text>
          </TouchableOpacity>
        )}
      </View>
      {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.activityImage} />}
    </View>
  );

  return (
    
    <View style={styles.container}>
    <SafeAreaView>
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
      </SafeAreaView>
    </View>
    
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
  completeButtonText: {
    color: '#ffffff'
  }
});

export default ActivityScreen;