import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ActivityScreen from './ActivityScreen';
import DashboardScreen from './DashboardScreen'
import ProfileScreen from './ProfileScreen'

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Swiper"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}