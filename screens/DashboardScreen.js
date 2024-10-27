import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView} from 'react-native';
import axiosInstance from '../api/axiosInstance'; // Adjust the import based on your file structure

const DashboardScreen = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]); // State to manage recent activities
  const [loading, setLoading] = useState(true); // State to manage loading

  // Fetch recent activities and leaderboard data from the API when the component mounts
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await axiosInstance.get('/recent-activities');
        // Map the response to the format required for rendering
        const formattedActivities = response.data.map((item) => ({
          id: item.activityId.toString(), // Ensure id is a string for keyExtractor
          name: item.username,
          activity: item.actvityName, // Make sure this corresponds to the API response
          date: item.completedAt, // Format the date if necessary
          profilePic: item.profileImage,
        }));
        setRecentActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        Alert.alert('Error', 'Could not fetch recent activities.');
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await axiosInstance.get('/leaderboard');
        // Map the response to the format required for rendering
        const formattedData = response.data.map((item) => ({
          id: item.user_id.toString(), // Ensure id is a string for keyExtractor
          name: item.full_name, // Use full name from response
          points: item.total_points, // Use total points from response
        }));
        setLeaderboardData(formattedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        Alert.alert('Error', 'Could not fetch leaderboard data.');
      } finally {
        setLoading(false); // Set loading to false regardless of success or error
      }
    };

    fetchRecentActivities();
    fetchLeaderboard();
  }, []);

  const renderFeedItem = ({ item }) => (
    <View style={styles.activityCard}>
      <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
      <View style={styles.activityInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.activityText}>{item.activity} ✔️</Text>
        <Text style={styles.activityDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderLeaderboardItem = ({ item }) => (
    <View style={styles.leaderboardCard}>
      <Text style={styles.leaderboardName}>{item.name}</Text>
      <Text style={styles.leaderboardPoints}>{item.points} points</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.header}>🎯 Dashboard</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('feed')} style={[styles.tab, activeTab === 'feed' && styles.activeTab]}>
          <Text style={styles.tabText}>Feed ✅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('leaderboard')} style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}>
          <Text style={styles.tabText}>Leaderboard 🔥</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'feed' ? (
        <FlatList
          data={recentActivities}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={leaderboardData}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#32CD32', // Green accent for active tab
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EAEAEA', // Light text for tabs
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E2E', // Darker card background
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
    color: '#32CD32', // Green for friend names
  },
  activityText: {
    fontSize: 14,
    color: '#EAEAEA', // Light text for activity
    marginVertical: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#888', // Dimmed date color for contrast
  },
  leaderboardCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#2E2E2E', // Darker card background for leaderboard
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  leaderboardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32CD32', // Green for leaderboard names
  },
  leaderboardPoints: {
    fontSize: 14,
    color: '#EAEAEA', // Light text for leaderboard points
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#EAEAEA', // Light text for loading
  },
});

export default DashboardScreen;