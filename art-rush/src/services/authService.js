// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Your backend server URL

class AuthService {
    // Signup method
    async signup(userData) {
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                username: userData.username,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Signup failed');
        }
    }

    // Login method
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });

            // Store user info in localStorage if login is successful
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Login failed');
        }
    }

    // Logout method
    logout() {
        localStorage.removeItem('user');
    }

    // Update profile method
    async updateProfile(userData) {
        try {
            const response = await axios.put(`${API_URL}/updateProfile`, userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Update failed');
        }
    }

    // Delete account method
    async deleteAccount(username) {
        try {
            const response = await axios.delete(`${API_URL}/deleteAccount`, {
                data: { username }
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Delete account failed');
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('user');
    }

    // Get current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();