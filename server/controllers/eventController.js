import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, category, date, location, description, spotsTotal } = req.body;

    if (!title || !category || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide event title, category, date, and location.'
      });
    }

    const event = await Event.create({
      title,
      category,
      date,
      location,
      description: description || '',
      spotsTotal: spotsTotal || 30,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Volunteer register for an event
// @route   POST /api/events/:id/register
// @access  Private (Volunteer)
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    // Check if already registered
    if (event.volunteersRegistered.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event.'
      });
    }

    // Check if spots full
    if (event.volunteersRegistered.length >= event.spotsTotal) {
      return res.status(400).json({
        success: false,
        message: 'This event has reached full capacity.'
      });
    }

    event.volunteersRegistered.push(req.user._id);
    await event.save();

    res.json({
      success: true,
      message: `Successfully registered for ${event.title}!`,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
