const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password, fullname } = req.body;

    if (!username || !password || !fullname) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newUser = await User.create(username, password, fullname);
        res.status(201).json({
            message: 'User Signuped successfully!',
            user: { username: newUser.username, fullName: newUser.fullName }
        });
    } catch (error) {
        console.error(error);
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: 'User already exists.' });
        }
        res.status(500).json({ error: 'Error Signuping user.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const user = await User.findByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            user: { username: user.username, fullName: user.fullName }
        });
    } catch (error) {
        res.status(500).json({ error: 'Login error.' });
    }
});

// Update Profile Route
router.put('/updateProfile', async (req, res) => {
    const { username, password, fullName } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        const updates = {};
        if (password) updates.password = password;
        if (fullName) updates.fullName = fullName;

        const result = await User.updateProfile(username, updates);

        if (!result) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({
            message: 'Profile updated successfully!',
            user: result
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Error updating profile.' });
    }
});

// Delete Account Route
router.delete('/deleteAccount', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required.' });
    }

    try {
        const result = await User.deleteAccount(username);

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Account deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting account.' });
    }
});

module.exports = router;