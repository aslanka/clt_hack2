import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'; // Import UUID

const SERVER_URL = 'http://10.16.69.24:3000'; // Replace with your server's IP and port

const ChatScreen = () => {
  const [messages, setMessages] = useState([]); // Store chat history
  const [input, setInput] = useState(''); // Store current user input
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialMessage = {
      id: uuidv4(),
      text: 'Hello! I am your assistant. How can I help you today?',
      sender: 'bot',
    };
    setMessages([initialMessage]);
  }, []);

  // Function to handle sending user message to the AI endpoint
  const sendMessage = async () => {
    if (input.trim() === '') return; // Do nothing if input is empty

    setLoading(true); // Show loading indicator

    const userInput = input; // Save input for async operation
    setInput(''); // Clear input field

    // Add user message to chat history
    setMessages((prevMessages) => {
      const newMessage = { id: uuidv4(), text: userInput, sender: 'user' };
      return [...prevMessages, newMessage];
    });

    try {
      // Make a request to the AI chatbot endpoint
      const response = await axios.post(`${SERVER_URL}/api/chat`, {
        userPrompt: userInput, // Send the user's message as `userPrompt`
      });

      // Get the AI response from the server
      const botMessage =
        response.data.response || 'Sorry, I did not understand that.';

      // Add AI message to chat history
      setMessages((prevMessages) => {
        const newBotMessage = { id: uuidv4(), text: botMessage, sender: 'bot' };
        return [...prevMessages, newBotMessage];
      });
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages((prevMessages) => {
        const errorMessage = {
          id: uuidv4(),
          text: 'Error communicating with AI.',
          sender: 'bot',
        };
        return [...prevMessages, errorMessage];
      });
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Render each message bubble
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text
        style={
          item.sender === 'user' ? styles.userMessageText : styles.botMessageText
        }
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={sendMessage} // Send message on enter/return key
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // Light background
  },
  container: {
    flex: 1,
    backgroundColor: '#121212', // Light background
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 20,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#0B93F6', // Blue bubble
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  botMessage: {
    backgroundColor: '#E5E5EA', // Light gray bubble
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  userMessageText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
  },
  botMessageText: {
    color: '#000000', // Black text
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    paddingBottom: 90,
    borderColor: '#DDD',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    marginRight: 10,
    color: '#000000',
  },
  sendButton: {
    backgroundColor: '#0B93F6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ChatScreen;
