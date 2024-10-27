import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SERVER_URL = 'http://10.16.69.24:3000'; // Replace with your server's IP and port

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store chat history
  const [input, setInput] = useState(''); // Store current user input
  const [loading, setLoading] = useState(false); // Loading indicator when sending a message

  // Function to handle sending user message to the AI endpoint
  const sendMessage = async () => {
    if (input.trim() === '') return; // Do nothing if input is empty

    setLoading(true); // Show loading indicator

    // Add user message to chat history
    setMessages((prevMessages) => {
      const newMessage = { id: prevMessages.length, text: input, sender: 'user' };
      return [...prevMessages, newMessage];
    });

    const userInput = input; // Save input for async operation
    setInput(''); // Clear input field

    try {
      // Make a request to the AI chatbot endpoint
      const response = await axios.post(`${SERVER_URL}/api/chat`, {
        userPrompt: userInput, // Send the user's message as `userPrompt`
      });

      // Get the AI response from the server
      const botMessage = response.data.response || 'Sorry, I did not understand that.';

      // Add AI message to chat history
      setMessages((prevMessages) => {
        const newBotMessage = { id: prevMessages.length, text: botMessage, sender: 'bot' };
        return [...prevMessages, newBotMessage];
      });
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setMessages((prevMessages) => {
        const errorMessage = { id: prevMessages.length, text: 'Error communicating with AI.', sender: 'bot' };
        return [...prevMessages, errorMessage];
      });
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Render each message bubble
  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
        <Text>nnnnn</Text>
      <Text style={item.sender === 'user' ? styles.messageText : styles.botMessageText}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatContainer}
      />

      {loading && (
        <ActivityIndicator size="large" color="#1E90FF" style={styles.loadingIndicator} />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={sendMessage} // Send message on enter/return key
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingTop: 20,
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#1E90FF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  botMessage: {
    backgroundColor: '#e1e1e1', // Light gray background
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#fff', // White text for user messages
    fontSize: 16,
  },
  botMessageText: {
    color: '#000', // Black text for bot messages
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingIndicator: {
    marginVertical: 10,
  },
});

export default Chatbot;
