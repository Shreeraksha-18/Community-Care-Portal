import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/registrations', registrationRoutes);

// ONE-TIME admin seed route (auto-disabled after first use)
app.post('/api/seed/admin', async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const { secret } = req.body;
    if (secret !== 'communitycare_seed_2026') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const exists = await User.findOne({ email: 'admin@communitycare.org' });
    if (exists) {
      return res.json({ success: true, message: 'Admin already exists', email: exists.email });
    }
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@communitycare.org',
      password: 'Admin@1234',
      role: 'admin',
      phone: '9999999999'
    });
    res.json({ success: true, message: 'Admin created!', email: admin.email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '💚 Community Care Portal API Server is running!',
    timestamp: new Date().toISOString()
  });
});

// CSV Export Route (Admin only)
app.get('/api/export/report', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ success: false, message: 'Not authorized.' });
    }
    const { default: jwt } = await import('jsonwebtoken');
    const { default: User } = await import('./models/User.js');
    const { default: Donation } = await import('./models/Donation.js');
    const { default: Activity } = await import('./models/Activity.js');

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }

    const donations = await Donation.find().sort({ createdAt: -1 });
    const activities = await Activity.find().sort({ createdAt: -1 });
    const volunteers = await User.find({ role: 'volunteer' }).select('name email createdAt');

    let csv = 'COMMUNITY CARE PORTAL - REPORT\n\n';
    csv += 'VOLUNTEERS\nName,Email,Joined\n';
    volunteers.forEach(v => { csv += `"${v.name}","${v.email}","${new Date(v.createdAt).toLocaleDateString()}"\n`; });

    csv += '\nDONATIONS\nReceipt ID,Donor,Campaign,Amount,Date\n';
    donations.forEach(d => { csv += `"${d.receiptId}","${d.donorName}","${d.campaignTitle}","₹${d.amount}","${new Date(d.createdAt).toLocaleDateString()}"\n`; });

    csv += '\nVOLUNTEER HOURS\nVolunteer,Activity,Hours,Status,Date\n';
    activities.forEach(a => { csv += `"${a.volunteerName}","${a.title}","${a.hoursLogged}","${a.status}","${new Date(a.createdAt).toLocaleDateString()}"\n`; });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=community-care-report.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
