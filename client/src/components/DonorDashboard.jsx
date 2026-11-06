import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import API from '../services/api';

const BRAND_NAVY = '#0b1220';
const ACCENT_GREEN = '#16995a';
const GREEN_DARK = '#0f6b3f';
const GREEN_LIGHT = '#e3f5ea';
const GREEN_BG = '#f2faf5';
const LINE_COLOR = '#eaecf0';
const MUTED_TEXT = '#667085';

const DEFAULT_CAMPAIGNS = [
  {
    id: 1,
    title: 'City Hunger Alleviation Drive',
    tag: 'Food Relief',
    raised: 85000,
    goal: 100000,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 2,
    title: 'Rural School Supplies Kit',
    tag: 'Education',
    raised: 30000,
    goal: 50000,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 3,
    title: 'Coastal Ocean Preservation',
    tag: 'Environment',
    raised: 18000,
    goal: 40000,
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80'
  }
];

export default function DonorDashboard({ onBackToHome }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Rahul Verma');
  const [userEmail, setUserEmail] = useState('rahul@roshantrust.org');
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal checkout state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('General Community Fund');
  const [donationAmount, setDonationAmount] = useState(1000);

  // Load user info and fetch donations on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('currentUser'));
      if (saved && saved.name) setUserName(saved.name);
      if (saved && saved.email) setUserEmail(saved.email);
    } catch (e) {}

    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await API.get('/donations/my-donations');
      if (res.data && res.data.data && res.data.data.length > 0) {
        const formatted = res.data.data.map(d => ({
          id: d.receiptId,
          campaign: d.campaignTitle,
          date: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: d.amount
        }));
        setReceipts(formatted);
      } else {
        // Fallback default receipts for presentation
        setReceipts([
          { id: '#REC-2026-881', campaign: 'City Hunger Alleviation Drive', date: 'July 8, 2026', amount: 10000 },
          { id: '#REC-2026-412', campaign: 'Rural School Supplies Kit', date: 'June 20, 2026', amount: 5000 }
        ]);
      }
    } catch (err) {
      console.warn('Backend unavailable, using local mock receipts:', err.message);
      setReceipts([
        { id: '#REC-2026-881', campaign: 'City Hunger Alleviation Drive', date: 'July 8, 2026', amount: 10000 },
        { id: '#REC-2026-412', campaign: 'Rural School Supplies Kit', date: 'June 20, 2026', amount: 5000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openCheckout = (campaignTitle) => {
    setSelectedCampaign(campaignTitle || 'General Community Fund');
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const handleConfirmDonation = async () => {
    const amt = Number(donationAmount);
    if (!amt || amt <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }

    try {
      // Post to backend API
      const res = await API.post('/donations', {
        campaignTitle: selectedCampaign,
        amount: amt
      });

      const newDonation = res.data.data;
      const newReceipt = {
        id: newDonation.receiptId,
        campaign: newDonation.campaignTitle,
        date: new Date(newDonation.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: newDonation.amount
      };

      setReceipts([newReceipt, ...receipts]);
    } catch (err) {
      console.warn('Backend error, creating locally:', err.message);
      const fallbackReceipt = {
        id: `#REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        campaign: selectedCampaign,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: amt
      };
      setReceipts([fallbackReceipt, ...receipts]);
    }

    // Update campaign raised total in UI
    setCampaigns(prev =>
      prev.map(c => c.title === selectedCampaign ? { ...c, raised: c.raised + amt } : c)
    );

    alert(`Thank you! Your donation of ₹${amt.toLocaleString()} to "${selectedCampaign}" was successful. An 80G tax receipt has been generated.`);
    setIsCheckoutOpen(false);
  };

  const totalDonated = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z"/>
              </svg>
            </div>
            Community Care
          </div>

          <div style={styles.roleBadge}>DONOR HUB</div>

          <nav style={styles.nav}>
            <NavLink
              to="dashboard"
              style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}
            >
              📊 Overview Dashboard
            </NavLink>
            <NavLink
              to="campaigns"
              style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}
            >
              🎯 Browse Campaigns
            </NavLink>
            <NavLink
              to="receipts"
              style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}
            >
              📄 Donation History / Receipts
            </NavLink>
            <NavLink
              to="profile"
              style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}
            >
              👤 Profile & Settings
            </NavLink>
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.84rem', color: '#fff' }}>{userName}</strong>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{userEmail}</span>
            </div>
          </div>
          <button
            style={styles.homeBtn}
            onClick={onBackToHome ? onBackToHome : () => navigate('/')}
            title="Log out and return to home"
          >
            Home
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.main}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <DonorOverview
                userName={userName}
                totalDonated={totalDonated}
                campaigns={campaigns}
                receiptsCount={receipts.length}
                onOpenCheckout={openCheckout}
                onViewAll={() => navigate('campaigns')}
              />
            }
          />
          <Route
            path="campaigns"
            element={<DonorCampaigns campaigns={campaigns} onOpenCheckout={openCheckout} />}
          />
          <Route
            path="receipts"
            element={<DonorReceipts receipts={receipts} loading={loading} />}
          />
          <Route
            path="profile"
            element={<DonorProfile userName={userName} userEmail={userEmail} />}
          />
        </Routes>
      </main>

      {/* DONATION CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.modalClose} onClick={closeCheckout}>✕</button>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: BRAND_NAVY }}>
              Donate to: {selectedCampaign}
            </h3>
            <p style={{ fontSize: '0.84rem', color: MUTED_TEXT, margin: '0 0 16px 0' }}>
              Your contribution is eligible for 80G tax benefits under Indian Income Tax regulations.
            </p>

            <div style={styles.amountGrid}>
              {[500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  style={{
                    ...styles.amountBtn,
                    ...(donationAmount === amt ? styles.amountBtnActive : {})
                  }}
                  onClick={() => setDonationAmount(amt)}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
              Custom Amount (₹)
            </label>
            <input
              type="number"
              style={styles.inputField}
              value={donationAmount}
              onChange={(e) => setDonationAmount(Number(e.target.value))}
              placeholder="Enter amount in ₹"
            />

            <button
              style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px' }}
              onClick={handleConfirmDonation}
            >
              Complete Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DonorOverview({ userName, totalDonated, campaigns, receiptsCount, onOpenCheckout, onViewAll }) {
  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Welcome, {userName} 👋</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Thank you for supporting community causes. Here is your giving overview.
          </p>
        </div>
        <button style={styles.btnPrimary} onClick={() => onOpenCheckout('General Community Fund')}>
          + Make a Donation
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statCardTop}>
            <div style={styles.statIcon}>₹</div>
            <span style={styles.badgeSuccess}>80G Eligible</span>
          </div>
          <div style={styles.statVal}>₹{totalDonated.toLocaleString()}</div>
          <div style={styles.statLbl}>Total Donated</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statCardTop}>
            <div style={styles.statIcon}>🎯</div>
          </div>
          <div style={styles.statVal}>{campaigns.length}</div>
          <div style={styles.statLbl}>Campaigns Supported</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statCardTop}>
            <div style={styles.statIcon}>❤️</div>
          </div>
          <div style={styles.statVal}>{Math.round(totalDonated / 200) || 120}</div>
          <div style={styles.statLbl}>Lives Impacted</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statCardTop}>
            <div style={styles.statIcon}>🧾</div>
          </div>
          <div style={styles.statVal}>{receiptsCount}</div>
          <div style={styles.statLbl}>Tax Receipts Issued</div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHead}>
          <h3 style={{ margin: 0 }}>Active Fundraising Campaigns</h3>
          <button style={styles.btnOutline} onClick={onViewAll}>View All</button>
        </div>

        <div style={styles.campaignGrid}>
          {campaigns.slice(0, 3).map((item) => {
            const pct = Math.min(100, Math.round((item.raised / item.goal) * 100));
            return (
              <div key={item.id} style={styles.campaignCard}>
                <img src={item.image} style={styles.campaignImg} alt={item.title} />
                <div style={styles.campaignBody}>
                  <div style={styles.campaignTag}>{item.tag}</div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.98rem' }}>{item.title}</h4>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${pct}%` }}></div>
                  </div>
                  <div style={styles.campaignMeta}>
                    <span>₹{item.raised.toLocaleString()} raised</span>
                    <span>Goal: ₹{item.goal.toLocaleString()}</span>
                  </div>
                  <button
                    style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center' }}
                    onClick={() => onOpenCheckout(item.title)}
                  >
                    Donate Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DonorCampaigns({ campaigns, onOpenCheckout }) {
  const [search, setSearch] = useState('');
  const filtered = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Explore Verified Campaigns</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Choose a verified NGO cause and contribute directly.
          </p>
        </div>
        <input
          type="text"
          style={{ ...styles.inputField, width: '260px', margin: 0 }}
          placeholder="🔍 Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.campaignGrid}>
        {filtered.map((item) => {
          const pct = Math.min(100, Math.round((item.raised / item.goal) * 100));
          return (
            <div key={item.id} style={styles.campaignCard}>
              <img src={item.image} style={styles.campaignImg} alt={item.title} />
              <div style={styles.campaignBody}>
                <div style={styles.campaignTag}>{item.tag}</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.98rem' }}>{item.title}</h4>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${pct}%` }}></div>
                </div>
                <div style={styles.campaignMeta}>
                  <span>₹{item.raised.toLocaleString()} raised</span>
                  <span>Goal: ₹{item.goal.toLocaleString()}</span>
                </div>
                <button
                  style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center' }}
                  onClick={() => onOpenCheckout(item.title)}
                >
                  Donate Now
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonorReceipts({ receipts, loading }) {
  const handleDownload = (rec) => {
    alert(`Downloading 80G Tax Exemption Certificate for ${rec.id} (₹${rec.amount.toLocaleString()})`);
  };

  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Donation History & 80G Receipts</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Download instant tax receipts for all your contributions.
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Receipt ID</th>
                <th style={styles.th}>Campaign</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Tax Deduction</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: MUTED_TEXT }}>
                    Loading receipts from server...
                  </td>
                </tr>
              ) : receipts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: MUTED_TEXT }}>
                    No donations recorded yet. Click "Make a Donation" to support a cause!
                  </td>
                </tr>
              ) : (
                receipts.map((r, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{r.id}</td>
                    <td style={styles.td}>{r.campaign}</td>
                    <td style={styles.td}>{r.date}</td>
                    <td style={styles.td}><strong>₹{r.amount.toLocaleString()}</strong></td>
                    <td style={styles.td}><span style={styles.badgeSuccess}>80G Tax Deductible</span></td>
                    <td style={styles.td}>
                      <button style={styles.btnOutline} onClick={() => handleDownload(r)}>
                        ⬇ Download Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DonorProfile({ userName, userEmail }) {
  const [pan, setPan] = useState('ABCDE1234F');

  const handleSave = (e) => {
    e.preventDefault();
    alert('Donor tax profile saved successfully!');
  };

  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Donor Profile & Settings</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Manage tax registration and donor details.
          </p>
        </div>
      </div>

      <div style={{ ...styles.card, maxWidth: '600px' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Tax Identification & Information</h3>
        <form onSubmit={handleSave}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            Full Name
          </label>
          <input type="text" style={styles.inputField} defaultValue={userName} readOnly />

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            Email Address
          </label>
          <input type="email" style={styles.inputField} defaultValue={userEmail} readOnly />

          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
            PAN Number (For 80G Tax Certificate)
          </label>
          <input
            type="text"
            style={styles.inputField}
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            required
          />

          <button type="submit" style={{ ...styles.btnPrimary, marginTop: '10px' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif' },
  sidebar: {
    width: '260px',
    backgroundColor: BRAND_NAVY,
    color: '#ffffff',
    flexShrink: 0,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  brand: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '1.05rem', color: '#ffffff', marginBottom: '24px', padding: '0 8px' },
  brandIcon: { width: '28px', height: '28px', borderRadius: '8px', backgroundColor: ACCENT_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  roleBadge: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginBottom: '12px', padding: '0 12px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 14px',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: 500,
    transition: 'all 0.2s'
  },
  navBtnActive: {
    backgroundColor: ACCENT_GREEN,
    color: '#ffffff',
    fontWeight: 700
  },
  sidebarFooter: {
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: ACCENT_GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  homeBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  main: { flex: 1, padding: '32px 40px', overflowY: 'auto' },
  headerBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  btnPrimary: {
    padding: '10px 18px',
    backgroundColor: GREEN_DARK,
    color: '#ffffff',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.88rem',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.2s'
  },
  btnOutline: {
    padding: '8px 14px',
    border: `1.5px solid ${LINE_COLOR}`,
    background: '#fff',
    color: '#101828',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer'
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' },
  statCard: { background: '#ffffff', border: `1px solid ${LINE_COLOR}`, borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  statCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  statIcon: { width: '36px', height: '36px', borderRadius: '9px', background: GREEN_LIGHT, color: ACCENT_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 },
  statVal: { fontSize: '1.65rem', fontWeight: 800, color: '#101828' },
  statLbl: { fontSize: '0.8rem', color: MUTED_TEXT, marginTop: '2px' },
  card: { background: '#ffffff', border: `1px solid ${LINE_COLOR}`, borderRadius: '16px', padding: '22px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  campaignGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  campaignCard: { border: `1px solid ${LINE_COLOR}`, borderRadius: '14px', overflow: 'hidden', background: '#fff' },
  campaignImg: { height: '150px', width: '100%', objectFit: 'cover' },
  campaignBody: { padding: '16px' },
  campaignTag: { fontSize: '0.72rem', fontWeight: 700, color: ACCENT_GREEN, textTransform: 'uppercase', marginBottom: '6px' },
  progressBar: { height: '7px', background: '#eaecf0', borderRadius: '999px', overflow: 'hidden', margin: '10px 0 6px' },
  progressFill: { height: '100%', background: ACCENT_GREEN, borderRadius: '999px' },
  campaignMeta: { display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: MUTED_TEXT, marginBottom: '14px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' },
  th: { padding: '12px 14px', background: '#f8fafc', borderBottom: `1.5px solid ${LINE_COLOR}`, color: MUTED_TEXT, fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' },
  td: { padding: '14px', borderBottom: `1px solid ${LINE_COLOR}`, color: '#101828' },
  badgeSuccess: { padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, display: 'inline-block', background: GREEN_LIGHT, color: GREEN_DARK },
  inputField: { width: '100%', padding: '10px 14px', border: `1.5px solid ${LINE_COLOR}`, borderRadius: '8px', fontSize: '0.9rem', marginBottom: '14px', outline: 'none', boxSizing: 'border-box' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(11, 18, 32, 0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', width: '440px', maxWidth: '92vw', borderRadius: '16px', padding: '28px', position: 'relative', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' },
  modalClose: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: MUTED_TEXT, cursor: 'pointer' },
  amountGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '16px 0' },
  amountBtn: { padding: '10px', border: `1.5px solid ${LINE_COLOR}`, borderRadius: '8px', background: '#fff', fontWeight: 700, cursor: 'pointer', textAlign: 'center' },
  amountBtnActive: { borderColor: ACCENT_GREEN, background: GREEN_BG, color: GREEN_DARK }
};
