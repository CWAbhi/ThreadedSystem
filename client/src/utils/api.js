const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthToken = () => localStorage.getItem('authToken');

export const api = {
  getComments: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/comments?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return response.json();
  },

  getReplies: async (commentId, skip = 0, limit = 5) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/replies?skip=${skip}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch replies');
    }
    return response.json();
  },

  createComment: async (commentData) => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    return response.json();
  },

  likeComment: async (commentId) => {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to like comment');
    }
    return response.json();
  },

  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      return response.json();
    },

    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      return response.json();
    },

    getCurrentUser: async () => {
      const token = getAuthToken();
      if (!token) return null;
      
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        localStorage.removeItem('authToken');
        return null;
      }
      return response.json();
    },
  },
};

