import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users'; // Updated to match new routes

class AuthService {
    // Signup
    async Signup(userData) {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            return response.data;
        } catch (error) {
            // More comprehensive error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Signup Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });

                // Return more specific error message
                return {
                    success: false,
                    error: error.response.data.error || 'Erro ao registrar usuário.',
                    statusCode: error.response.status
                };
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                return {
                    success: false,
                    error: 'Sem resposta do servidor. Verifique sua conexão.',
                    statusCode: null
                };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
                return {
                    success: false,
                    error: 'Erro interno. Tente novamente.',
                    statusCode: null
                };
            }
        }
    }

    // Login
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });

            // Validate response data
            if (response.data.user) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));

                // Optional: Store authentication token if provided
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                }

                return {
                    success: true,
                    user: response.data.user,
                    message: response.data.message || 'Login realizado com sucesso!'
                };
            } else {
                throw new Error('Dados de usuário inválidos');
            }
        } catch (error) {
            // Comprehensive error handling
            if (error.response) {
                // Server responded with an error status
                console.error('Login Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });

                // Specific error handling based on status code
                switch (error.response.status) {
                    case 401:
                        return {
                            success: false,
                            error: 'Credenciais inválidas. Verifique seu usuário e senha.',
                            statusCode: 401
                        };
                    case 403:
                        return {
                            success: false,
                            error: 'Acesso negado. Verifique suas permissões.',
                            statusCode: 403
                        };
                    case 404:
                        return {
                            success: false,
                            error: 'Usuário não encontrado.',
                            statusCode: 404
                        };
                    default:
                        return {
                            success: false,
                            error: error.response.data.error || 'Erro ao fazer login.',
                            statusCode: error.response.status
                        };
                }
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
                return {
                    success: false,
                    error: 'Sem resposta do servidor. Verifique sua conexão de internet.',
                    statusCode: null
                };
            } else {
                // Error in setting up the request
                console.error('Error setting up login request:', error.message);
                return {
                    success: false,
                    error: 'Erro interno. Tente novamente.',
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