const Rewards = require('../models/Rewards');

// Add a new reward
const addReward = (req, res) => {
    const { points, reward } = req.body;

    // Check if the required fields are present
    if (!points || !reward) {
        return res.status(400).json({ error: 'Missing required fields: points and reward' });
    }

    // Check if an exact reward with the same points and reward text already exists
    Rewards.findExactReward(points, reward, (err, existingReward) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: 'Database error occurred' });
        }

        if (existingReward.length > 0) {
            // If the exact reward exists, return a conflict error
            return res.status(409).json({ error: 'An identical reward already exists with the same points and reward description' });
        }

        // If no identical reward exists, proceed to add the new reward
        Rewards.addReward(points, reward, (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ error: 'Failed to add reward' });
            }
            res.status(201).json({ message: 'Reward added successfully' });
        });
    });
};

// Get reward by points
const getRewardByPoints = (req, res) => {
    const { points } = req.params;
    Rewards.getRewardByPoints(points, (err, reward) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve reward' });
        if (!reward.length) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json(reward[0]);
    });
};

// Get all rewards
const getAllRewards = (req, res) => {
    Rewards.getAllRewards((err, rewards) => {
        if (err) return res.status(500).json({ error: 'Failed to retrieve rewards' });
        res.status(200).json(rewards);
    });
};

// Delete a reward by points
const deleteReward = (req, res) => {
    const { points } = req.body;
    Rewards.deleteReward(points, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to delete reward' });
        res.status(200).json({ message: 'Reward deleted successfully' });
    });
};

module.exports = {
    addReward,
    getRewardByPoints,
    getAllRewards,
    deleteReward
};
