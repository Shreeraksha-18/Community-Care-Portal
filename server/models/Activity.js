import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    volunteerName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide activity title'],
      trim: true
    },
    category: {
      type: String,
      default: 'Community Support'
    },
    hoursLogged: {
      type: Number,
      required: [true, 'Please specify hours worked'],
      min: [0.5, 'Minimum hours logged is 0.5']
    },
    dateWorked: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
