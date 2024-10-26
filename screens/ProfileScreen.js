import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const ProfileScreen = () => {
  const user = {
    name: 'Dhruv Mukherjee',
    username: 'dmukherjee',
    avatar: 'https://media.licdn.com/dms/image/v2/D4E03AQGFyVLZI01tfg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1707934528588?e=1735171200&v=beta&t=p_TWpA-7oZWLBC6-POxRyVuRG6anfGxUqI2ZvLXB7TM',
    year: 'Junior',
    points: 120 // Example: user's current points
  };

  // Rewards milestones
  const milestones = [
    { points: 50, label: 'Starter' },
    { points: 100, label: 'Bronze' },
    { points: 200, label: 'Silver' },
    { points: 300, label: 'Gold' },
    { points: 500, label: 'Platinum' },
  ];

  // Find current milestone progress
  const currentMilestoneIndex = milestones.findIndex(m => user.points < m.points);
  const nextMilestone = milestones[currentMilestoneIndex] || milestones[milestones.length - 1];
  const previousMilestone = milestones[currentMilestoneIndex - 1] || { points: 0 };

  // Calculate progress towards the next milestone
  const progress = (user.points - previousMilestone.points) / (nextMilestone.points - previousMilestone.points);

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      {/* <Text style={styles.username}>{user.username}</Text> */}
      <Text style={styles.username}>{user.year}</Text>

      {/* <TouchableOpacity style={styles.button} onPress={() => alert('Edit Profile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => alert('Logged Out')}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity> */}

      {/* Rewards Timeline */}
      <View style={styles.timelineContainer}>
          
        <Text style={styles.rewardsHeader}>My Rewards</Text>
        
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
          <Text style={{ fontSize: 18, marginRight: 5 }}>🔥</Text>
          <Text style={styles.pointsText}>{user.points} / {nextMilestone.points} pts to {nextMilestone.label} level</Text>
</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
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
    color: '#333',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#1E90FF',
    width: '100%',
    height: 50,
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
    color: '#333',
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
    color: '#3ca832'
  },
  pointsText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
