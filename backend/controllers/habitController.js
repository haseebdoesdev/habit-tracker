exports.createHabit = async (req, res) => {
    try {
        // TODO: Get userId from req.user (set by auth middleware)
        // WHY: Associate habit with the logged-in user, prevent creating habits for others

        // TODO: Create new habit with request body data
        // WHY: Take user input (title, frequency, etc.) and create habit document

        // TODO: Save to database
        // WHY: Persist the habit so user can track it later

        // TODO: Return created habit
        // WHY: Frontend needs the new habit (with _id) to display it

        res.status(201).json({ message: 'Create habit - to be implemented' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getHabits = async (req, res) => {
    try {
        // TODO: Find all habits for the logged-in user
        // WHY: Show only the user's own habits

        res.status(200).json({ message: 'Get habits - to be implemented' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateHabit = async (req, res) => {
    try {
        // TODO: Find habit by ID and update
        // WHY: Allow users to change habit details

        res.status(200).json({ message: 'Update habit - to be implemented' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteHabit = async (req, res) => {
    try {
        // TODO: Find habit by ID and delete
        // WHY: Remove unwanted habits

        res.status(200).json({ message: 'Delete habit - to be implemented' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
