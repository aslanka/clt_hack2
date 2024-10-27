// screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axiosInstance from '../api/axiosInstance';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileUri, setProfileUri] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const response = await axiosInstance.post('/signup', {
        username,
        full_name: fullName,
        academic_year: academicYear,
        email,
        password,
        profile_uri: profileUri,
      });
      console.log(response.data);
      Alert.alert('Signup Successful', 'You can now log in with your account.');
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Signup Failed', error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Academic Year"
        placeholderTextColor="#888"
        value={academicYear}
        onChangeText={setAcademicYear}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Profile URI (optional)"
        placeholderTextColor="#888"
        value={profileUri}
        onChangeText={setProfileUri}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#ffffff',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
