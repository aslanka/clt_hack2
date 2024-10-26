// screens/FeedScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Sample data for the feed
const sampleData = [
  {
    id: '1',
    title: 'New Restaurant Opening',
    description: 'Check out the latest restaurant opening downtown! Great food and atmosphere.',
  },
  {
    id: '2',
    title: 'Concert Coming Soon',
    description: 'Don’t miss the live concert at the park this weekend. Get your tickets now!',
  },
  {
    id: '3',
    title: 'Summer Sale!',
    description: 'Huge discounts available on all summer items. Visit our website for more details.',
  },
  {
    id: '4',
    title: 'Fitness Tips',
    description: 'Learn the top 5 exercises to stay fit and healthy. Read more for the full guide.',
  },
  {
    id: '5',
    title: 'Travel Destination',
    description: 'Explore the best travel destinations for 2024. Start planning your next trip!',
  },
];

const FeedScreen = () => {
  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sampleData}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 16,
    color: '#555',
  },
});

export default FeedScreen;
