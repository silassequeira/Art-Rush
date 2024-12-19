import axios from 'axios';

const API_URL = '/api/interactions';

class InteractionService {

    async getSavedPaintings(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved paintings for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}`);
            console.log('Response data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching saved paintings:', error);
            throw error;
        }
    }
    async countSaved(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved artworks count for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/countSaved`);
            console.log('Count of saved artworks:', response.data.count);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching saved artworks count:', error);
            throw error;
        }
    }

    async getFilteredSavedPaintings(userId, filters) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching filtered saved paintings for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/filter`, {
                params: filters
            });
            console.log('Filtered response data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered saved paintings:', error);
            throw error;
        }
    }
}

export default new InteractionService();