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
}

export default new InteractionService();