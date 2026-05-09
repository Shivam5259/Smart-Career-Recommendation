import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

/**
 * Context is like a "Global Storage" for your app.
 * Instead of passing data through every single component,
 * we can put it here and any component can "subscribe" to it.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // useState is a "hook" that lets React remember information (state).
  // user: stores the logged-in user's information
  // loading: true while we are checking if the user is already logged in
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect runs code once when the component first appears on the screen.
  // We use it here to check if the user has a "token" (key) saved in their browser.
  useEffect(() => {
    const checkAuth = async () => {
      // Check if there's a token saved in the browser's local storage
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // If there is a token, ask the server "Who am I?"
          const response = await api.get('/users/me');
          setUser(response.data); // Save the user info
        } catch (error) {
          // If the token is old or wrong, remove it
          console.error('Auth error:', error);
          localStorage.removeItem('token');
        }
      }
      
      // Once the check is done, stop showing the loading spinner
      setLoading(false);
    };

    checkAuth();
  }, []); // The empty [] means "only run this once"

  /**
   * login function: handles user sign-in.
   */
  const login = async (email, password) => {
    // Create the data format the server expects
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    // Send the request to the server
    const response = await api.post('/auth/token', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    // Save the "access token" (security key) in the browser
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    
    // Fetch the full user details
    const userResponse = await api.get('/users/me');
    setUser(userResponse.data);
    return userResponse.data;
  };

  /**
   * register function: handles new account creation.
   */
  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

  /**
   * logout function: clears user data and token.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // This part makes the data available to the rest of the app.
  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is a custom hook that makes it easy for other components to use the Auth data.
export const useAuth = () => useContext(AuthContext);

