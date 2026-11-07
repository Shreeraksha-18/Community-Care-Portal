import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    volunteerName: { type: String },
    volunteerEmail: { type: String },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Attended'],
      default: 'Pending'
    },
    hoursLogged: { type: Number, default: 0 },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    attendanceMarkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
