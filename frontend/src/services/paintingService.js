import axios from 'axios';

const API_URL = '/api/paintings';

class PaintingService {
    // Fetch all paintings with optional filtering and pagination
    async getPaintings(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                artist
            } = options;

            const response = await axios.get(API_URL, {
                params: { page, limit, artist }
            });

            // Ensure data is returned
            console.log('Painting response:', response.data);

            return {
                success: true,
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit,
                paintings: response.data.data || [] // Fallback to empty array
            };
        } catch (error) {
            console.error('Error fetching paintings:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch paintings',
                statusCode: error.response?.status
            };
        }
    }

    // Fetch a specific painting by ID
    async getPaintingById(id) {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return {
                success: true,
                painting: response.data.data
            };
        } catch (error) {
            console.error('Error fetching painting:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch painting',
                statusCode: error.response?.status
            };
        }
    }
}

export default new PaintingService();