import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ActivityScreen from './ActivityScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Swiper"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Activity" component={ActivityScreen} />
      {/* <Tab.Screen name="Swiper" component={SwiperScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Chats" component={ChatStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}