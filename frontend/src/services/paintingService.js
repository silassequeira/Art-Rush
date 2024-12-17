import axios from 'axios';

const API_URL = '/api/paintings';

class PaintingService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
        });
    }

    async getPaintings({ page = 1, limit = 10 } = {}) {
        try {
            const response = await this.api.get('/', {
                params: { page, limit },
            });

            const { total, page: currentPage, limit: perPage, data: paintings } = response.data;

            return {
                success: true,
                total,
                page: currentPage,
                limit: perPage,
                paintings,
            };
        } catch (error) {
            console.error('Error fetching paintings:', error);

            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch paintings',
                statusCode: error.response?.status || 500,
            };
        }
    }

    async getPaintingById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            const { data: painting } = response.data;

            return {
                success: true,
                painting,
            };
        } catch (error) {
            console.error('Error fetching painting by ID:', error);

            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch painting',
                statusCode: error.response?.status || 500,
            };
        }
    }
}

export default new PaintingService();
