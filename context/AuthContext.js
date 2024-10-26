// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventEmitter from '../eventEmitter'; // Ensure this exists or replace/remove it if not needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token from AsyncStorage when the app starts
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      }
      setLoading(false);
    };
    loadToken();

    // Listen for logout event
    const handleLogout = () => {
      logout();
    };

    eventEmitter.on('logout', handleLogout);

    // Clean up the event listener on unmount
    return () => {
      eventEmitter.off('logout', handleLogout);
    };
  }, []);

  // Function to handle login
  const login = async (token) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    } catch (e) {
      console.error('Failed to save token', e);
    }
    setLoading(false);
  };

  // Function to handle logout
  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (e) {
      console.error('Failed to remove token', e);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ userToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
