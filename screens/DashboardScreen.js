import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
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
          activity: item.activityName, // Make sure this corresponds to the API response
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
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('feed')} style={[styles.tab, activeTab === 'feed' && styles.activeTab]}>
          <Text style={styles.tabText}>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('leaderboard')} style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}>
          <Text style={styles.tabText}>Leaderboard</Text>
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
        // Show a loading indicator while fetching leaderboard data
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
    borderBottomColor: '#1E90FF',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f8ef1',
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
  leaderboardCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  leaderboardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f8ef1',
  },
  leaderboardPoints: {
    fontSize: 14,
    color: '#555',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DashboardScreen;


// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// import axiosInstance from '../api/axiosInstance'; // Adjust the import based on your file structure

// const DashboardScreen = () => {
//   const [activeTab, setActiveTab] = useState('feed');
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true); // State to manage loading

//   const friendsActivities = [
//     {
//       id: '1',
//       name: 'Alice Johnson',
//       activity: 'Completed a 10-mile run',
//       date: '2024-10-24',
//       profilePic: 'https://example.com/alice-pic.png',
//     },
//     {
//       id: '2',
//       name: 'Bob Smith',
//       activity: 'Finished a coding project',
//       date: '2024-10-23',
//       profilePic: 'https://example.com/bob-pic.png',
//     },
//     {
//       id: '3',
//       name: 'Charlie Brown',
//       activity: 'Attended a yoga class',
//       date: '2024-10-22',
//       profilePic: 'https://example.com/charlie-pic.png',
//     },
//   ];

//   // Fetch leaderboard data from the API when the component mounts
//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         const response = await axiosInstance.get('/leaderboard');
//         // Map the response to the format required for rendering
//         const formattedData = response.data.map((item) => ({
//           id: item.user_id.toString(), // Ensure id is a string for keyExtractor
//           name: item.full_name, // Use full name from response
//           points: item.total_points, // Use total points from response
//         }));
//         setLeaderboardData(formattedData);
//       } catch (error) {
//         console.error('Error fetching leaderboard:', error);
//         Alert.alert('Error', 'Could not fetch leaderboard data.');
//       } finally {
//         setLoading(false); // Set loading to false regardless of success or error
//       }
//     };

//     fetchLeaderboard();
//   }, []);

//   const renderFeedItem = ({ item }) => (
//     <View style={styles.activityCard}>
//       <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
//       <View style={styles.activityInfo}>
//         <Text style={styles.friendName}>{item.name}</Text>
//         <Text style={styles.activityText}>{item.activity}</Text>
//         <Text style={styles.activityDate}>{item.date}</Text>
//       </View>
//     </View>
//   );

//   const renderLeaderboardItem = ({ item }) => (
//     <View style={styles.leaderboardCard}>
//       <Text style={styles.leaderboardName}>{item.name}</Text>
//       <Text style={styles.leaderboardPoints}>{item.points} points</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Dashboard</Text>
//       <View style={styles.tabContainer}>
//         <TouchableOpacity onPress={() => setActiveTab('feed')} style={[styles.tab, activeTab === 'feed' && styles.activeTab]}>
//           <Text style={styles.tabText}>Feed</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setActiveTab('leaderboard')} style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}>
//           <Text style={styles.tabText}>Leaderboard</Text>
//         </TouchableOpacity>
//       </View>
//       {activeTab === 'feed' ? (
//         <FlatList
//           data={friendsActivities}
//           renderItem={renderFeedItem}
//           keyExtractor={(item) => item.id}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : loading ? (
//         // Show a loading indicator while fetching leaderboard data
//         <Text style={styles.loadingText}>Loading...</Text>
//       ) : (
//         <FlatList
//           data={leaderboardData}
//           renderItem={renderLeaderboardItem}
//           keyExtractor={(item) => item.id}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f2f2f2',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 16,
//   },
//   tab: {
//     padding: 10,
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   activeTab: {
//     borderBottomColor: '#1E90FF',
//   },
//   tabText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f8ef1',
//   },
//   activityCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 16,
//     marginBottom: 12,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   profilePic: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   activityInfo: {
//     flex: 1,
//   },
//   friendName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f8ef1',
//   },
//   activityText: {
//     fontSize: 14,
//     color: '#555',
//     marginVertical: 4,
//   },
//   activityDate: {
//     fontSize: 12,
//     color: '#888',
//   },
//   leaderboardCard: {
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   leaderboardName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f8ef1',
//   },
//   leaderboardPoints: {
//     fontSize: 14,
//     color: '#555',
//   },
//   loadingText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default DashboardScreen;
