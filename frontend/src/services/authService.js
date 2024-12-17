import axios from 'axios';

const API_URL = '/api/users';

class AuthService {
    async signup(userData) {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error('Signup Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });

                return {
                    success: false,
                    error: error.response.data.error || 'Error registering user.',
                    statusCode: error.response.status
                };
            } else if (error.request) {
                console.error('No response received:', error.request);
                return {
                    success: false,
                    error: 'No response from server. Check your connection.',
                    statusCode: null
                };
            } else {
                console.error('Error setting up request:', error.message);
                return {
                    success: false,
                    error: 'Internal error. Try again.',
                    statusCode: null
                };
            }
        }
    }

    // Login
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });

            if (response.data.user) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));

                return {
                    success: true,
                    user: response.data.user,
                    message: response.data.message
                };
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            if (error.response) {
                console.error('Login Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
                switch (error.response.status) {
                    case 401:
                        return {
                            success: false,
                            error: 'Invalid credentials. Check your username and password.',
                            statusCode: 401
                        };
                    case 403:
                        return {
                            success: false,
                            error: 'Access denied. Check your permissions.',
                            statusCode: 403
                        };
                    case 404:
                        return {
                            success: false,
                            error: 'User not found.',
                            statusCode: 404
                        };
                    default:
                        return {
                            success: false,
                            error: error.response.data.error || 'Error logging in.',
                            statusCode: error.response.status
                        };
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                return {
                    success: false,
                    error: 'No response from server. Check your internet connection.',
                    statusCode: null
                };
            } else {
                // Error in setting up the request
                console.error('Error setting up login request:', error.message);
                return {
                    success: false,
                    error: 'Internal error. Try again.',
                    statusCode: null
                };
            }
        }
    }

    // Update Profile
    async updateProfile(updates) {
        try {
            const response = await axios.put(`${API_URL}/updateProfile`, updates);

            // Update localStorage with new user data
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Erro ao atualizar perfil.' };
        }
    }

    // Add Interaction
    async addInteraction(userId, paintingId, saved) {
        try {
            console.log("Sending data to addInteraction:", { userId, paintingId, saved });
            const response = await axios.post(`${API_URL}/addInteraction`, {
                userId,
                paintingId,
                saved
            });
            return response.data;
        } catch (error) {
            console.error("Error adding interaction:", error.response?.data || error);
            throw error.response?.data || { error: 'Error adding interaction.' };
        }
    }

    async updateInteraction(userId, paintingId, saved) {
        try {
            const response = await axios.put(`${API_URL}/updateInteraction`, {
                userId,
                paintingId,
                saved
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Error updating interaction.' };
        }
    }

    // Delete Account
    async deleteAccount(username) {
        try {
            const response = await axios.delete(`${API_URL}/deleteAccount`, {
                data: { username }, // Send username in request body
            });

            // Clear localStorage if deletion is successful
            localStorage.removeItem('user');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Erro ao excluir conta.' };
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('user');
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