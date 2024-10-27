import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store chat history
  const [input, setInput] = useState(''); // Store current user input
  const [loading, setLoading] = useState(false); // Loading indicator when sending a message

  // Function to handle sending user message to the AI endpoint
  const sendMessage = async () => {
    if (input.trim() === '') return; // Do nothing if input is empty

    // Add user message to chat history
    const newMessage = { id: messages.length, text: input, sender: 'user' };
    setMessages([...messages, newMessage]);

    setInput(''); // Clear input field
    setLoading(true); // Show loading indicator

    try {
      // Make a request to the AI chatbot endpoint
      const response = await axios.post('http://10.16.69.24:3000/api/chat', {
        userPrompt: input, // Send the user's message as `userPrompt`
      });

      // Get the AI response from the server
      const botMessage = response.data.response || 'Sorry, I did not understand that.';

      // Add AI message to chat history
      const newBotMessage = { id: messages.length + 1, text: botMessage, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      const errorMessage = { id: messages.length + 1, text: 'Error communicating with AI.', sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Render each message bubble
  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
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
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: '#fff',
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
