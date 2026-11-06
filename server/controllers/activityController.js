import Activity from '../models/Activity.js';

// @desc    Log volunteer hours
// @route   POST /api/activities
// @access  Private (Volunteer or Admin)
export const logActivity = async (req, res) => {
  try {
    const { title, category, hoursLogged, dateWorked } = req.body;

    if (!title || !hoursLogged || Number(hoursLogged) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide activity title and valid hours logged.'
      });
    }

    const activity = await Activity.create({
      volunteer: req.user._id,
      volunteerName: req.user.name,
      title,
      category: category || 'Community Support',
      hoursLogged: Number(hoursLogged),
      dateWorked: dateWorked || Date.now(),
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in volunteer's activities
// @route   GET /api/activities/my-activities
// @access  Private
export const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ volunteer: req.user._id }).sort({ createdAt: -1 });
    const approvedHours = activities
      .filter((a) => a.status === 'Approved')
      .reduce((sum, a) => sum + a.hoursLogged, 0);

    res.json({
      success: true,
      totalHoursApproved: approvedHours,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all activities (Admin)
// @route   GET /api/activities
// @access  Private (Admin)
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve or Reject volunteer hours
// @route   PUT /api/activities/:id/review
// @access  Private (Admin only)
export const reviewActivity = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'."
      });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity record not found.'
      });
    }

    activity.status = status;
    activity.reviewedBy = req.user._id;
    if (reviewNotes) activity.reviewNotes = reviewNotes;

    await activity.save();

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
