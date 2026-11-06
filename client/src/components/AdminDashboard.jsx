import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';

const BRAND_NAVY = '#0e1626';
const ACCENT_GREEN = '#16995a';
const GREEN_DARK = '#0f6b3f';
const GREEN_LIGHT = '#e3f5ea';
const LINE_COLOR = '#eaecf0';
const MUTED_TEXT = '#667085';

const INITIAL_VOLUNTEERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@seva.org', hours: 128, status: 'Active' },
  { id: 2, name: 'Ishaan Kapoor', email: 'ishaan@helpage.org', hours: 64, status: 'Active' },
  { id: 3, name: 'Ananya Roy', email: 'ananya@ecocare.org', hours: 42, status: 'Active' }
];

const INITIAL_EVENTS = [
  { id: 1, name: 'City Food Drive', category: 'Community', date: '2026-07-12', location: 'Mumbai' },
  { id: 2, name: 'Coastal Cleanup Campaign', category: 'Environment', date: '2026-07-19', location: 'Juhu Beach' }
];

const INITIAL_CAMPAIGNS = [
  { id: 1, title: 'City Hunger Alleviation Drive', category: 'Food Relief', goal: 100000, raised: 85000 },
  { id: 2, title: 'Rural School Supplies Kit', category: 'Education', goal: 50000, raised: 30000 }
];

const INITIAL_BENEFICIARIES = [
  { id: 1, name: 'Dharavi Primary Students Kit', supportType: 'Education Supplies', location: 'Mumbai', status: 'Assisted' },
  { id: 2, name: 'Coastal Fishermen Community Welfare', supportType: 'Disaster Relief', location: 'Versova', status: 'In Progress' }
];

export default function AdminDashboard({ onBackToHome }) {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin Console');
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [beneficiaries, setBeneficiaries] = useState(INITIAL_BENEFICIARIES);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'event', 'campaign', 'beneficiary'
  const [newEvent, setNewEvent] = useState({ name: '', category: '', date: '', location: '' });
  const [newCampaign, setNewCampaign] = useState({ title: '', category: '', goal: '' });
  const [newBeneficiary, setNewBeneficiary] = useState({ name: '', supportType: '', location: '' });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('currentUser'));
      if (saved && saved.name) setAdminName(saved.name);
    } catch (e) {}
  }, []);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name) return;
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setNewEvent({ name: '', category: '', date: '', location: '' });
    setActiveModal(null);
    alert('New community event published successfully!');
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaign.title) return;
    setCampaigns([...campaigns, { ...newCampaign, id: Date.now(), raised: 0, goal: Number(newCampaign.goal) }]);
    setNewCampaign({ title: '', category: '', goal: '' });
    setActiveModal(null);
    alert('Fundraising campaign created successfully!');
  };

  const handleCreateBeneficiary = (e) => {
    e.preventDefault();
    if (!newBeneficiary.name) return;
    setBeneficiaries([...beneficiaries, { ...newBeneficiary, id: Date.now(), status: 'Assisted' }]);
    setNewBeneficiary({ name: '', supportType: '', location: '' });
    setActiveModal(null);
    alert('Beneficiary record stored securely.');
  };

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

          <div style={styles.roleBadge}>ADMINISTRATION</div>

          <nav style={styles.nav}>
            <NavLink to="overview" style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}>
              📊 Overview
            </NavLink>
            <NavLink to="volunteers" style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}>
              👥 Manage Volunteers
            </NavLink>
            <NavLink to="events" style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}>
              📅 Manage Events
            </NavLink>
            <NavLink to="campaigns" style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}>
              🎯 Manage Campaigns
            </NavLink>
            <NavLink to="beneficiaries" style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}>
              🤝 Manage Beneficiaries
            </NavLink>
            <NavLink to="reports" style={({ isActive }) => ({ ...styles.navBtn, ...(isActive ? styles.navBtnActive : {}) })}>
              📈 Reports & Analytics
            </NavLink>
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.82rem', color: '#fff' }}>{adminName}</strong>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>admin@communitycare.org</span>
            </div>
          </div>
          <button
            style={styles.homeBtn}
            onClick={onBackToHome ? onBackToHome : () => navigate('/')}
            title="Return to Home"
          >
            Home
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.main}>
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route
            path="overview"
            element={
              <AdminOverview
                adminName={adminName}
                volunteersCount={volunteers.length}
                eventsCount={events.length}
                campaignsCount={campaigns.length}
                beneficiariesCount={beneficiaries.length}
              />
            }
          />
          <Route
            path="volunteers"
            element={<AdminVolunteers volunteers={volunteers} setVolunteers={setVolunteers} />}
          />
          <Route
            path="events"
            element={<AdminEvents events={events} onOpenModal={() => setActiveModal('event')} />}
          />
          <Route
            path="campaigns"
            element={<AdminCampaigns campaigns={campaigns} onOpenModal={() => setActiveModal('campaign')} />}
          />
          <Route
            path="beneficiaries"
            element={<AdminBeneficiaries beneficiaries={beneficiaries} onOpenModal={() => setActiveModal('beneficiary')} />}
          />
          <Route path="reports" element={<AdminReports />} />
        </Routes>
      </main>

      {/* CREATE EVENT MODAL */}
      {activeModal === 'event' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
            <h3 style={{ margin: '0 0 16px 0', color: BRAND_NAVY }}>Create New Community Event</h3>
            <form onSubmit={handleCreateEvent}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Event Title</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="e.g. Tree Plantation Drive"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Category</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="Environment / Healthcare / Education"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Date</label>
                <input
                  type="date"
                  style={styles.inputField}
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Location</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="City / Area"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  required
                />
              </div>
              <button type="submit" style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center' }}>
                Publish Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {activeModal === 'campaign' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
            <h3 style={{ margin: '0 0 16px 0', color: BRAND_NAVY }}>Create Fundraising Campaign</h3>
            <form onSubmit={handleCreateCampaign}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Campaign Title</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="e.g. Clean Drinking Water Initiative"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Category</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="Health / Education / Welfare"
                  value={newCampaign.category}
                  onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Target Goal (₹)</label>
                <input
                  type="number"
                  style={styles.inputField}
                  placeholder="100000"
                  value={newCampaign.goal}
                  onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                  required
                />
              </div>
              <button type="submit" style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center' }}>
                Start Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD BENEFICIARY MODAL */}
      {activeModal === 'beneficiary' && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button style={styles.modalClose} onClick={() => setActiveModal(null)}>✕</button>
            <h3 style={{ margin: '0 0 16px 0', color: BRAND_NAVY }}>Add Beneficiary Record</h3>
            <form onSubmit={handleCreateBeneficiary}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Beneficiary / Organization</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="e.g. Sunshine Orphanage Children"
                  value={newBeneficiary.name}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Assistance Type</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="Food Support / Medical Kits / Education"
                  value={newBeneficiary.supportType}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, supportType: e.target.value })}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Location</label>
                <input
                  type="text"
                  style={styles.inputField}
                  placeholder="District / City"
                  value={newBeneficiary.location}
                  onChange={(e) => setNewBeneficiary({ ...newBeneficiary, location: e.target.value })}
                  required
                />
              </div>
              <button type="submit" style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center' }}>
                Save Beneficiary Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOverview({ adminName, volunteersCount, eventsCount, campaignsCount, beneficiariesCount }) {
  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Platform Executive Overview</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Real-time status across volunteers, events, fundraising campaigns, and beneficiaries.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLbl}>Registered Volunteers</div>
          <div style={styles.statVal}>{volunteersCount + 12400}+</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLbl}>Events Organized</div>
          <div style={styles.statVal}>{eventsCount + 840}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLbl}>Fundraising Drives</div>
          <div style={styles.statVal}>{campaignsCount}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLbl}>Beneficiaries Supported</div>
          <div style={styles.statVal}>{beneficiariesCount + 1250}</div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{ margin: '0 0 14px 0' }}>Recent Operational Activities</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Activity</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>User / Submitter</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>City Food Drive Registration Open</td>
                <td style={styles.td}>Event Coordination</td>
                <td style={styles.td}>Priya Sharma</td>
                <td style={styles.td}><span style={styles.badgeSuccess}>Approved</span></td>
              </tr>
              <tr>
                <td style={styles.td}>Volunteer Hours Submission (4 hrs)</td>
                <td style={styles.td}>Hours Log</td>
                <td style={styles.td}>Ishaan Kapoor</td>
                <td style={styles.td}><span style={styles.badgeWarning}>Pending Review</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminVolunteers({ volunteers, setVolunteers }) {
  const handleToggleStatus = (id) => {
    setVolunteers(volunteers.map(v =>
      v.id === id ? { ...v, status: v.status === 'Active' ? 'Suspended' : 'Active' } : v
    ));
  };

  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Manage Volunteers</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Review volunteer profiles, total hours logged, and active status.
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Volunteer Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Total Hours</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol.id}>
                  <td style={styles.td}><strong>{vol.name}</strong></td>
                  <td style={styles.td}>{vol.email}</td>
                  <td style={styles.td}>{vol.hours} hrs</td>
                  <td style={styles.td}>
                    <span style={vol.status === 'Active' ? styles.badgeSuccess : styles.badgeDanger}>
                      {vol.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={{
                        ...styles.btnOutline,
                        color: vol.status === 'Active' ? '#dc2626' : '#16995a'
                      }}
                      onClick={() => handleToggleStatus(vol.id)}
                    >
                      {vol.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminEvents({ events, onOpenModal }) {
  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Manage Community Events</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Create, coordinate, and review upcoming drives.
          </p>
        </div>
        <button style={styles.btnPrimary} onClick={onOpenModal}>+ Create New Event</button>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Event Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id}>
                  <td style={styles.td}><strong>{evt.name}</strong></td>
                  <td style={styles.td}>{evt.category}</td>
                  <td style={styles.td}>{evt.date}</td>
                  <td style={styles.td}>{evt.location}</td>
                  <td style={styles.td}><span style={styles.badgeSuccess}>Published</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminCampaigns({ campaigns, onOpenModal }) {
  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Manage Fundraising Campaigns</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Create and monitor transparent donation initiatives.
          </p>
        </div>
        <button style={styles.btnPrimary} onClick={onOpenModal}>+ Create Campaign</button>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Campaign Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Goal</th>
                <th style={styles.th}>Raised</th>
                <th style={styles.th}>Progress</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
                return (
                  <tr key={c.id}>
                    <td style={styles.td}><strong>{c.title}</strong></td>
                    <td style={styles.td}>{c.category}</td>
                    <td style={styles.td}>₹{c.goal.toLocaleString()}</td>
                    <td style={styles.td}><strong>₹{c.raised.toLocaleString()}</strong></td>
                    <td style={styles.td}>{pct}% funded</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminBeneficiaries({ beneficiaries, onOpenModal }) {
  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Manage Beneficiary Records</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Maintain confidential, access-controlled records of supported groups.
          </p>
        </div>
        <button style={styles.btnPrimary} onClick={onOpenModal}>+ Add Beneficiary</button>
      </div>

      <div style={styles.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Beneficiary / Group</th>
                <th style={styles.th}>Assistance Type</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.id}>
                  <td style={styles.td}><strong>{b.name}</strong></td>
                  <td style={styles.td}>{b.supportType}</td>
                  <td style={styles.td}>{b.location}</td>
                  <td style={styles.td}><span style={styles.badgeSuccess}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminReports() {
  return (
    <div>
      <div style={styles.headerBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800 }}>Reports & Analytics</h1>
          <p style={{ margin: '4px 0 0 0', color: MUTED_TEXT, fontSize: '0.88rem' }}>
            Export operational summaries and audit trails.
          </p>
        </div>
        <button style={styles.btnOutline} onClick={() => alert('Exporting quarterly NGO summary as CSV...')}>
          ⬇ Export Report (CSV)
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={{ margin: '0 0 10px 0' }}>Quarterly Impact Summary</h3>
        <p style={{ color: MUTED_TEXT, fontSize: '0.9rem', lineHeight: '1.6' }}>
          Over the past quarter, Community Care Portal helped mobilize 12,400+ volunteers across 840 community events,
          channeling over ₹2.3 Crores in transparent donations to verified humanitarian and environmental programs.
        </p>
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
  brandIcon: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: ACCENT_GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  roleBadge: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginBottom: '12px', padding: '0 12px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px' },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '9px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.86rem',
    fontWeight: 500,
    transition: 'all 0.2s'
  },
  navBtnActive: { backgroundColor: ACCENT_GREEN, color: '#ffffff', fontWeight: 600 },
  sidebarFooter: {
    paddingTop: '14px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px'
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', backgroundColor: ACCENT_GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
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
    borderRadius: '9px',
    fontWeight: 600,
    fontSize: '0.88rem',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  btnOutline: {
    padding: '7px 12px',
    border: `1.5px solid ${LINE_COLOR}`,
    background: '#fff',
    color: '#101828',
    borderRadius: '7px',
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' },
  statCard: { background: '#ffffff', border: `1px solid ${LINE_COLOR}`, borderRadius: '14px', padding: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  statVal: { fontSize: '1.65rem', fontWeight: 800, marginTop: '6px', color: '#101828' },
  statLbl: { fontSize: '0.8rem', color: MUTED_TEXT },
  card: { background: '#ffffff', border: `1px solid ${LINE_COLOR}`, borderRadius: '16px', padding: '22px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' },
  th: { padding: '12px 14px', background: '#f8fafc', borderBottom: `1.5px solid ${LINE_COLOR}`, color: MUTED_TEXT, fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' },
  td: { padding: '14px', borderBottom: `1px solid ${LINE_COLOR}`, color: '#101828' },
  badgeSuccess: { padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, display: 'inline-block', background: GREEN_LIGHT, color: GREEN_DARK },
  badgeWarning: { padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, display: 'inline-block', background: '#fef3c7', color: '#d97706' },
  badgeDanger: { padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, display: 'inline-block', background: '#fee2e2', color: '#dc2626' },
  inputGroup: { marginBottom: '14px' },
  inputLabel: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#344054', marginBottom: '6px' },
  inputField: { width: '100%', padding: '10px 14px', border: `1.5px solid ${LINE_COLOR}`, borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(11, 18, 32, 0.65)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#fff', width: '500px', maxWidth: '92vw', borderRadius: '16px', padding: '28px', position: 'relative', boxShadow: '0 16px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  modalClose: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', color: MUTED_TEXT, cursor: 'pointer' }
};
