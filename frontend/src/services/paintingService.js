import axios from 'axios';

const API_URL = '/api/paintings';
const CACHE_KEY = 'fetchedPaintings';
const CACHE_TIMESTAMP_KEY = 'fetchedPaintingsTimestamp';
const CACHE_DURATION = 1800000;
const CACHE_LIMIT = 50;

class PaintingService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
        });
        this.fetchedPaintings = this.loadFetchedPaintings(); // Track fetched painting objects
    }

    loadFetchedPaintings() {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp, 10)) < CACHE_DURATION) {
            return JSON.parse(cachedData);
        } else {
            console.log('Cache is invalid or expired. Clearing cache.');
            this.clearCache();
            return [];
        }
    }

    saveFetchedPaintings() {
        const limitedPaintings = this.fetchedPaintings.slice(0, CACHE_LIMIT);
        localStorage.setItem(CACHE_KEY, JSON.stringify(limitedPaintings));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log('Saved fetched paintings to cache:', limitedPaintings);
    }


    clearCache() {
        localStorage.removeItem(CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        console.log('Cache cleared.');
    }

    async getPaintings({ page = 1, limit = 8, useCache = true } = {}) {
        if (useCache && this.fetchedPaintings.length > 0) {
            const cachedPaintings = this.getCachedPaintings(limit);
            this.fetchedPaintings = this.fetchedPaintings.slice(limit); // Remove the returned paintings from the cache
            this.saveFetchedPaintings();
            return {
                success: true,
                total: cachedPaintings.length,
                page,
                limit,
                paintings: cachedPaintings,
            };
        }

        try {
            const excludeIds = this.fetchedPaintings.map(painting => painting._id);
            const response = await this.api.get('/', {
                params: { page, limit, excludeIds },
            });

            const { total, page: currentPage, limit: perPage, data: paintings } = response.data;

            // Track fetched painting objects
            this.fetchedPaintings = [...this.fetchedPaintings, ...paintings];
            this.saveFetchedPaintings();

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

    getCachedPaintings(limit = 8) {
        const cachedPaintings = this.fetchedPaintings.slice(0, limit);
        console.log('Returning cached paintings:', cachedPaintings);
        return cachedPaintings;
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