import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

import ActivityScreen from './ActivityScreen';
import DashboardScreen from './DashboardScreen';
import ProfileScreen from './ProfileScreen';
import ChatBot from './ChatBot'

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Activity"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E', // Match background of other pages
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 10, // Elevation for Android
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          borderTopLeftRadius: 20, // Rounded corners
          borderTopRightRadius: 20, // Rounded corners
          paddingBottom: 10, // Padding to create space
        },
        tabBarActiveTintColor: '#27ae60', // Active tab icon color
        tabBarInactiveTintColor: '#999', // Inactive tab icon color
      }}
    >
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Chatbot"
        component={ChatBot}
        options={{
          tabBarLabel: 'Chatbot',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
