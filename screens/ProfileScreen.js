import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';



const rewardsData = [
  { id: '1', title: 'GreenScore T-Shirt                        400 Points', description: 'Get a free T-Shirt from the GreenScore Team.' },
  { id: '2', title: 'Free Coffee                                     1,000 Points', description: 'Free coffee on us!' },
  { id: '3', title: 'Study Supplies                             2,500 Points', description: 'Free study supplies for the semester.' },
  { id: '4', title: 'Amazon Gift Card                       5,000 Points', description: 'Receive a $10 gift card for your favorite store.' },
  { id: '5', title: 'Home Composting Set             10,000 points', description: 'Enjoy a free home composting set' },
];

const ProfileScreen = () => {
  const [user, setUser] = useState(null); // Initialize user state
  const [loading, setLoading] = useState(true); // Loading state
  const { signOut, userId } = useContext(AuthContext);
  const [user_points, setUserPoints] = useState({});
  const n = 3;
  // Rewards milestones
  const milestones = [
    { points: 50, label: 'Starter' },
    { points: 100, label: 'Bronze' },
    { points: 200, label: 'Silver' },
    { points: 300, label: 'Gold' },
    { points: 500, label: 'Platinum' },
  ];

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const response = await axiosInstance.get(`users/${parseInt(1, 10)}`);
        const points = await axiosInstance.get(`totalpoints/${parseInt(1, 10)}`);

        setUserPoints(points.data)
        setUser(response.data); // Set the user data from the response
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    signOut();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator while fetching
  }

  if (!user) {
    return <Text>No user data found.</Text>; // Handle case where user data is not available
  }

  // Find current milestone progress
  const currentMilestoneIndex = milestones.findIndex(m => 8 < m.points);
  const nextMilestone = milestones[currentMilestoneIndex] || milestones[milestones.length - 1];
  const previousMilestone = milestones[currentMilestoneIndex - 1] || { points: 0 };

  // Calculate progress towards the next milestone
  const progress = (8- previousMilestone.points) / (nextMilestone.points - previousMilestone.points);

  const renderRewardItem = ({ item }) => (
    <View style={styles.rewardItem}>
      <Text style={styles.rewardTitle}>{item.title}</Text>
      <Text style={styles.rewardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

     <Image source={{ uri: user[0].profile_uri }} style={styles.avatar} />
     <Text style={styles.name}>{user[0].full_name}</Text>
        <Text style={styles.username}>{user[0].academic_year}</Text>
      
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      {/* Rewards Timeline */}
      <View style={styles.timelineContainer}>
        <Text style={styles.rewardsHeader}>My Rewards 🏆</Text>

        {/* Milestone stops */}
        <View style={styles.milestonesContainer}>
          {milestones.map((milestone, index) => (
            <View key={index} style={styles.milestone}>
              <Text style={styles.milestoneLabel}>{milestone.label}</Text>
              <Text style={styles.milestonePoints}>{milestone.points} pts</Text>
            </View>
          ))}
        </View>

        <View style={{ width: '90%', marginBottom: 10 }}>
          <ProgressBar 
            progress={progress} 
            color='#3ca832' 
            style={[styles.progressBar, { width: '100%', height: 8 }]} 
          />
        </View>
        

        {/* Points info */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginRight: 5 }}></Text>
          {/* <Text style={styles.pointsText}>{user.points} / {nextMilestone.points} pts to {nextMilestone.label} level</Text> */}
        </View>
      </View>


       {/* FlatList of rewards */}
       <FlatList
            data={rewardsData}
            renderItem={renderRewardItem}
            keyExtractor={(item) => item.id}
            style={styles.rewardsList}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingTop: 80,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#1E90FF',
    width: '40%',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timelineContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  rewardsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  milestonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  milestone: {
    alignItems: 'center',
  },
  milestoneLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  milestonePoints: {
    fontSize: 12,
    color: '#888',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
    color: '#3ca832',
  },
  rewardsList: {
    width: '90%',
    marginVertical: 20,
  },
  rewardItem: {
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardDescription: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ProfileScreen;