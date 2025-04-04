import axios from 'axios';

// API base URL
const API_URL = 'https://localhost:7114/api/messages';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Message service with CRUD operations
const messageService = {
  // Get all messages
  getMessages: async () => {
    try {
      const response = await apiClient.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Get a single message by ID
  getMessage: async (id) => {
    try {
      const response = await apiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching message ${id}:`, error);
      throw error;
    }
  },

  // Get replies for a message
  getReplies: async (id) => {
    try {
      const response = await apiClient.get(`/${id}/replies`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching replies for message ${id}:`, error);
      throw error;
    }
  },

  // Create a new message
  createMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/', messageData);
      return response.data;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  // Reply to a message
  replyToMessage: async (id, replyData) => {
    try {
      const response = await apiClient.post(`/${id}/reply`, replyData);
      return response.data;
    } catch (error) {
      console.error(`Error replying to message ${id}:`, error);
      throw error;
    }
  },

  // Update an existing message
  updateMessage: async (id, messageData) => {
    try {
      const response = await apiClient.put(`/${id}`, messageData);
      return response.data;
    } catch (error) {
      console.error(`Error updating message ${id}:`, error);
      throw error;
    }
  },

  // Delete a message
  deleteMessage: async (id, deleteReplies = false) => {
    try {
      await apiClient.delete(`/${id}?deleteReplies=${deleteReplies}`);
      return true;
    } catch (error) {
      console.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }
};

export default messageService; 