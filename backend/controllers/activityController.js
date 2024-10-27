const OpenAI = require("openai");
const fs = require("fs");
const Activity = require("../models/Activity.js");  // Adjust path if needed

// Initialize OpenAI instance
const openai = new OpenAI();

// Controller to validate activity description with OpenAI
const validateActivity = async (req, res) => {
    const { prompt } = req.body;
    const image = req.file;

    if (!image || !prompt) {
        return res.status(400).json({ error: 'Image and prompt are required' });
    }

    // Assuming the image is hosted and publicly accessible
    const imageUrl = `https://your-storage-url.com/path/to/${image.filename}`; // Replace with actual URL after upload

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Adjust to your model preference
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Does this image match the activity: ${prompt}?` },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ],
                },
            ],
        });

        // Check if OpenAI response is affirmative
        const responseMessage = response.choices[0].message.content;
        const success = responseMessage.toLowerCase().includes("yes");

        // Return validation result to the client
        return res.status(200).json({
            message: success ? "Validation successful! Points added." : "Validation failed. Activity not recognized.",
            success,
        });
    } catch (error) {
        console.error("Error during validation:", error);
        res.status(500).json({ error: "Validation failed due to server error" });
    } finally {
        fs.unlinkSync(image.path); // Clean up uploaded file
    }
};

// Controller to add a new activity
const addActivity = (req, res) => {
    const { activity_name, description, points } = req.body;
    Activity.add(activity_name, description, points, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add activity" });
        res.status(201).json({ message: "Activity added successfully" });
    });
};

// Controller to get all activities
const getAllActivities = (req, res) => {
    Activity.getAll((err, activities) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve activities" });
        res.status(200).json(activities);
    });
};

// Controller to get an activity by ID
const getActivityById = (req, res) => {
    const { activity_id } = req.params;
    Activity.findById(activity_id, (err, activity) => {
        if (err) return res.status(500).json({ error: "Failed to retrieve activity" });
        if (!activity.length) return res.status(404).json({ error: "Activity not found" });
        res.status(200).json(activity[0]);
    });
};

// Controller to update an activity by ID
const updateActivity = (req, res) => {
    const { activity_id } = req.params;
    const { activity_name, description, points } = req.body;
    Activity.update(activity_id, activity_name, description, points, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update activity" });
        res.status(200).json({ message: "Activity updated successfully" });
    });
};

// Controller to delete an activity by ID
const deleteActivity = (req, res) => {
    const { activity_id } = req.params;
    Activity.delete(activity_id, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete activity" });
        res.status(200).json({ message: "Activity deleted successfully" });
    });
};

// Export all controllers for use in routing
module.exports = {
    validateActivity,
    addActivity,
    getAllActivities,
    getActivityById,
    updateActivity,
    deleteActivity
};
