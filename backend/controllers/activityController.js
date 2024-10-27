const Activity = require('../models/Activity');
const fs = require('fs');
// const { Configuration, OpenAIApi } = require('openai');

// const configuration = new Configuration({
//     apiKey: 'sk-euzNx-wuCXxdasjamIfjt0itriOXzss4fNDEgwQGKjT3BlbkFJEFXoTvmv2RvCebvCp1TsO3-6DwoYZVlYHDpSx-X8cA',
// });
// const openai = new OpenAIApi(configuration);

// const validateActivity = async (req, res) => {
//     const { prompt } = req.body;
//     const image = req.file;

//     if (!image || !prompt) {
//         return res.status(400).json({ error: 'Image and prompt are required' });
//     }

//     try {
//         const validationResult = await openai.createChatCompletion({
//             model: 'gpt-3.5-turbo', // Specify the model you want to use
//             messages: [{ role: 'user', content: prompt }],
//             max_tokens: 100,
//         });

//         // Extract the content from the response
//         const responseMessage = validationResult.data.choices[0].message.content;

//         // Example condition if validation succeeded
//         if (responseMessage.toLowerCase().includes('yes')) {
//             return res.status(200).json({ message: 'Validation successful! Points added.', success: true });
//         } else {
//             return res.status(200).json({ message: 'Validation failed. Activity not recognized.', success: false });
//         }
//     } catch (error) {
//         console.error('Error during validation:', error);
//         res.status(500).json({ error: 'Validation failed due to server error' });
//     } finally {
//         fs.unlinkSync(image.path); // Clean up uploaded file
//     }
// };

// Controller to add a new activity
const addActivity = (req, res) => {
    const { activity_name, description, points } = req.body;
    Activity.add(activity_name, description, points, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to add activity' });
        }
        res.status(201).json({ message: 'Activity added successfully' });
    });
};

// Controller to get all activities
const getAllActivities = (req, res) => {
    Activity.getAll((err, activities) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve activities' });
        }
        res.status(200).json(activities);
    });
};

// Controller to get an activity by ID
const getActivityById = (req, res) => {
    const { activity_id } = req.params;
    Activity.findById(activity_id, (err, activity) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to retrieve activity' });
        }
        if (!activity.length) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(200).json(activity[0]);
    });
};

// Controller to update an activity by ID
const updateActivity = (req, res) => {
    const { activity_id } = req.params;
    const { activity_name, description, points } = req.body;
    Activity.update(activity_id, activity_name, description, points, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update activity' });
        }
        res.status(200).json({ message: 'Activity updated successfully' });
    });
};

// Controller to delete an activity by ID
const deleteActivity = (req, res) => {
    const { activity_id } = req.params;
    Activity.delete(activity_id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete activity' });
        }
        res.status(200).json({ message: 'Activity deleted successfully' });
    });
};

module.exports = {
    addActivity,
    getAllActivities,
    getActivityById,
    updateActivity,
    deleteActivity
};
