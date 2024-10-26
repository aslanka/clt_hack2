import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


import LoginScreen from './screens/LoginScreen';
import Feed from './screens/Feed'
// import HomeScreen from './screens/HomeScreen';  // Uncomment this if HomeScreen is defined
import { AuthProvider, AuthContext } from './context/AuthContext'; // Import AuthProvider

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken} = React.useContext(AuthContext);



  return (
    <Stack.Navigator initialRouteName={userToken ? "Home" : "LoginScreen"}>
    <Stack.Screen 
      name="LoginScreen" 
      component={LoginScreen} 
      options={{ headerShown: false }} 
    />
     <Stack.Screen 
      name="Feed" 
      component={Feed} 
      options={{ headerShown: false }} 
    />

  </Stack.Navigator>
  );
};

export default function App() {
  return (
 
      <AuthProvider>
        <NavigationContainer>

            <AppNavigator />

        </NavigationContainer>
      </AuthProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
