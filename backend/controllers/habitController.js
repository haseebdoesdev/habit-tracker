const Habit = require('../models/Habit');
const Log = require('../models/Log');

exports.createHabit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description, frequency, targetDays } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Create new habit
        const habit = new Habit({
            user: userId,
            title,
            description,
            frequency: frequency || 'daily',
            targetDays: targetDays || [],
            streak: 0,
            completedDates: []
        });

        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getHabits = async (req, res) => {
    try {
        const userId = req.user.id;
        const habits = await Habit.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(habits);
    } catch (error) {
        console.error('Error getting habits:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateHabit = async (req, res) => {
    try {
        const userId = req.user.id;
        const habitId = req.params.id;
        const { title, description, frequency, targetDays } = req.body;

        // Find habit and verify ownership
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this habit' });
        }

        // Update fields
        if (title !== undefined) habit.title = title;
        if (description !== undefined) habit.description = description;
        if (frequency !== undefined) habit.frequency = frequency;
        if (targetDays !== undefined) habit.targetDays = targetDays;

        await habit.save();
        res.status(200).json(habit);
    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteHabit = async (req, res) => {
    try {
        const userId = req.user.id;
        const habitId = req.params.id;

        // Find habit and verify ownership
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this habit' });
        }

        // Delete associated logs
        await Log.deleteMany({ habit: habitId });

        // Delete habit
        await Habit.findByIdAndDelete(habitId);
        res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
