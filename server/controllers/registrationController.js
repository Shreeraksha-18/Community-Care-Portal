import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import Activity from '../models/Activity.js';

// @route POST /api/registrations
// @desc  Volunteer registers for an event
// @access Private (volunteer)
export const registerForEvent = async (req, res) => {
  try {
    const { eventId, volunteerPhone, emergencyContact, notes } = req.body;
    if (!eventId) return res.status(400).json({ success: false, message: 'eventId is required.' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found.' });

    // Check duplicate
    const exists = await Registration.findOne({ volunteer: req.user._id, event: eventId });
    if (exists) return res.status(400).json({ success: false, message: 'Already registered for this event.' });

    const reg = await Registration.create({
      volunteer: req.user._id,
      volunteerName: req.user.name,
      volunteerEmail: req.user.email,
      volunteerPhone: volunteerPhone || req.user.phone || '',
      emergencyContact: emergencyContact || '',
      event: eventId,
      eventTitle: event.title,
      status: 'Pending',
      notes: notes || ''
    });

    res.status(201).json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/registrations/my
// @desc  Get logged-in volunteer's registrations
// @access Private
export const getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ volunteer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: regs.length, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/registrations
// @desc  Admin — get all registrations
// @access Private (admin)
export const getAllRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, count: regs.length, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/registrations/:id/approve
// @desc  Admin approves or rejects a registration
// @access Private (admin)
export const approveRegistration = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be 'Approved' or 'Rejected'." });
    }
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found.' });

    reg.status = status;
    reg.approvedBy = req.user._id;
    if (notes) reg.notes = notes;
    await reg.save();

    // Sync with Event.volunteersRegistered
    if (status === 'Approved') {
      await Event.findByIdAndUpdate(reg.event, {
        $addToSet: { volunteersRegistered: reg.volunteer }
      });
    } else if (status === 'Rejected') {
      await Event.findByIdAndUpdate(reg.event, {
        $pull: { volunteersRegistered: reg.volunteer }
      });
    }

    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/registrations/:id/attend
// @desc  Admin marks attendance and logs hours
// @access Private (admin)
export const markAttendance = async (req, res) => {
  try {
    const { hoursLogged } = req.body;
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found.' });
    if (reg.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Registration must be Approved before marking attendance.' });
    }

    reg.status = 'Attended';
    reg.hoursLogged = Number(hoursLogged) || 0;
    reg.attendanceMarkedBy = req.user._id;
    await reg.save();

    // Auto-create an approved activity entry for the volunteer
    if (reg.hoursLogged > 0) {
      await Activity.create({
        volunteer: reg.volunteer,
        volunteerName: reg.volunteerName,
        title: reg.eventTitle,
        category: 'Event Attendance',
        hoursLogged: reg.hoursLogged,
        dateWorked: new Date(),
        status: 'Approved',
        reviewedBy: req.user._id
      });
    }

    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
