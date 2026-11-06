import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please provide a category (e.g. Community, Environment, Education)'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date']
    },
    location: {
      type: String,
      required: [true, 'Please provide event location'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    organization: {
      type: String,
      default: 'Community Care Portal'
    },
    spotsTotal: {
      type: Number,
      default: 30
    },
    volunteersRegistered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['Published', 'Upcoming', 'Completed', 'Cancelled'],
      default: 'Published'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model('Event', eventSchema);
export default Event;
