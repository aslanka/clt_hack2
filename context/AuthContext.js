// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setUserToken(token); // Set userToken if token exists
      } else {
        setUserToken(null); // No token, user needs to log in
      }
    };

    checkToken();
  }, []);

  const signIn = async (token, newUserId) => {
    await AsyncStorage.setItem('token', token); // Store token
    setUserToken(token); // Update state
    setUserId(newUserId);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('token'); // Remove token
    setUserToken(null); 
    setUserId(null);// Update state
  };

  return (
    <AuthContext.Provider value={{ userToken, userId, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
