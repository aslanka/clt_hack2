// screens/LoginScreen.js
import React, { useContext, useState} from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import ActivityScreen from './ActivityScreen'
import axiosInstance from '../api/axiosInstance'
const LoginScreen = () => {

  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  
  const handleLogin = async () => {
    console.log('Clicked on log in')
    try {
      const response = await axiosInstance.post('/login', {
        username,
        password,
      });
      console.log(response.data)
      // Assuming your AuthContext has a method to store the token
      signIn(response.data.token, response.data.userId);
    } catch (error) {
      if (error.response) {
        // Handle specific errors returned from the backend
        Alert.alert('Login Failed', error.response.data.message || 'An error occurred');
      } else {
        // Handle network or other errors
        Alert.alert('Login Failed', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#ffffff', // Light text color
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E', // Dark input background
    borderRadius: 25, // Rounded input bezels
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff', // Light text color
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50', // Green button color
    borderRadius: 25, // Rounded button bezels
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    width: 350,       // Set width based on the image size and desired display size
    height: 350,      // Set height based on the image size and desired display size
    marginBottom: 30, // Spacing between logo and form
  },
  buttonText: {
    color: '#ffffff', // Light text color
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;