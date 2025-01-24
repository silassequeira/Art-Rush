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

    async getFavoritePaintings(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching favorite paintings for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/favorite`);
            console.log('Response data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorite paintings:', error);
            throw error;
        }
    }
    async countSaved(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved artworks count for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/countSaved`);
            console.log('Count of saved Artworks:', response.data.count);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching saved artworks count:', error);
            throw error;
        }
    }

    async countFavorite(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching favorite artworks count for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/countFavorite`);
            console.log('Count of favorite Artworks:', response.data.count);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching favorite artworks count:', error);
            throw error;
        }
    }

    async countSavedArtists(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved artists count for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/countSavedArtists`);
            console.log('Count of saved Artists:', response.data.count);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching saved artworks count:', error);
            throw error;
        }
    }

    async checkSavedState(userId, paintingId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            const paintingIdString = typeof paintingId === 'object' ? paintingId.toString() : paintingId;
            const response = await axios.get(`${API_URL}/${userIdString}/${paintingIdString}/checkSaved`);
            console.log('Response state:', response.data.saved);
            return response.data.saved;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
            console.error('Error config:', error.config);
            throw error;
        }
    }

    async checkFavoriteState(userId, paintingId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            const paintingIdString = typeof paintingId === 'object' ? paintingId.toString() : paintingId;
            const response = await axios.get(`${API_URL}/${userIdString}/${paintingIdString}/checkFavorite`);
            console.log('Response state:', response.data.favorite);
            return response.data.favorite;
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
            console.error('Error config:', error.config);
            throw error;
        }
    }

    async savedNationalities(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved nationalities for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/nationalities`);
            console.log('Fetched nationalities:', response.data.nationalities);
            return response.data;
        } catch (error) {
            console.error('Error fetching saved artworks nationalities:', error);
            throw error;
        }
    }

    async savedMediums(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved mediums for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/mediums`);
            console.log('Fetched mediums:', response.data.mediums);
            return response.data;
        } catch (error) {
            console.error('Error fetching saved artworks nationalities:', error);
            throw error;
        }
    }

    async savedArtists(userId) {
        try {
            const userIdString = typeof userId === 'object' ? userId.toString() : userId;
            console.log(`Fetching saved artists for userId: ${userIdString}`);
            const response = await axios.get(`${API_URL}/${userIdString}/artists`);
            console.log('Fetched artists:', response.data.artists);
            return response.data;
        } catch (error) {
            console.error('Error fetching saved artworks nationalities:', error);
            throw error;
        }
    }

}

export default new InteractionService();