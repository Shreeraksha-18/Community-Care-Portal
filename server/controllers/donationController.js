import Donation from '../models/Donation.js';

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private (Donor or Admin)
export const createDonation = async (req, res) => {
  try {
    const { campaignTitle, amount, paymentMethod } = req.body;

    if (!campaignTitle || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid campaign title and donation amount.'
      });
    }

    const receiptId = `#REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const donation = await Donation.create({
      donor: req.user._id,
      donorName: req.user.name,
      donorEmail: req.user.email,
      campaignTitle,
      amount: Number(amount),
      receiptId,
      taxDeductible: true,
      paymentMethod: paymentMethod || 'Online / Card / UPI',
      paymentStatus: 'Completed'
    });

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user's donations
// @route   GET /api/donations/my-donations
// @access  Private
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all donations (Admin only)
// @route   GET /api/donations
// @access  Private (Admin)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    res.json({
      success: true,
      totalAmount,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
