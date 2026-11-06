import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    donorName: {
      type: String,
      required: true
    },
    donorEmail: {
      type: String,
      required: true
    },
    campaignTitle: {
      type: String,
      required: [true, 'Please specify the campaign or cause'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Please enter a donation amount'],
      min: [1, 'Donation amount must be at least ₹1']
    },
    receiptId: {
      type: String,
      unique: true,
      required: true
    },
    taxDeductible: {
      type: Boolean,
      default: true // 80G tax benefit
    },
    paymentStatus: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Completed'
    },
    paymentMethod: {
      type: String,
      default: 'Online / Card / UPI'
    }
  },
  {
    timestamps: true
  }
);

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
