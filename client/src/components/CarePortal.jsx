import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ─── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  events: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  hours: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2',
  donations: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  beneficiaries: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 0l-3-3m0 0l-3 3m3-3v9',
  notifications: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  reports: 'M12 20h9 M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  plus: 'M12 5v14M5 12h14',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  badge: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
};

// ─── Default data ────────────────────────────────────────────────────────────
const DEFAULT_EVENTS = [
  { _id: '1', title: 'City Food Drive', category: 'Community', date: 'Jul 12', location: 'City Center, Mumbai', organization: 'Seva NGO', status: 'Registered' },
  { _id: '2', title: 'Coastal Cleanup', category: 'Environment', date: 'Jul 19', location: 'Juhu Beach, Mumbai', organization: 'EcoCare', status: 'Registered' },
  { _id: '3', title: 'School Supplies Drive', category: 'Education', date: 'Jul 26', location: 'Dharavi School', organization: 'LearnCare', status: 'Pending' },
];
const DEFAULT_ACTIVITIES = [
  { _id: '1', title: 'Registered for Coastal Cleanup Campaign', type: 'Event Registration', time: '2h ago' },
  { _id: '2', title: 'Logged 4 hours for Food Drive', type: 'Hours Logged', time: 'Yesterday' },
  { _id: '3', title: 'Donated ₹500 to Water for All campaign', type: 'Donation', time: 'Jul 8' },
  { _id: '4', title: 'Completed onboarding at Dharavi School', type: 'Event Completed', time: 'Jul 5' },
];
const MONTHLY_HOURS = [
  { month: 'Jan', hours: 8 },
  { month: 'Feb', hours: 12 },
  { month: 'Mar', hours: 6 },
  { month: 'Apr', hours: 10 },
  { month: 'May', hours: 9 },
  { month: 'Jun', hours: 15 },
  { month: 'Jul', hours: 20 },
];

// ─── Sidebar nav config ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: Icons.dashboard },
  { key: 'events', label: 'My Events', icon: Icons.events },
  { key: 'hours', label: 'Volunteer Hours', icon: Icons.hours },
  { key: 'donations', label: 'Donations', icon: Icons.donations },
  { key: 'beneficiaries', label: 'Beneficiaries', icon: Icons.beneficiaries },
  { key: 'notifications', label: 'Notifications', icon: Icons.notifications },
  { key: 'reports', label: 'Reports', icon: Icons.reports },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function CarePortal({ onBackToHome }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [volunteerName, setVolunteerName] = useState('Priya Sharma');
  const [volunteerEmail, setVolunteerEmail] = useState('priya@care.org');
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [activities] = useState(DEFAULT_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [notifCount] = useState(3);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('currentUser'));
      if (saved?.name) setVolunteerName(saved.name);
      if (saved?.email) setVolunteerEmail(saved.email);
    } catch (e) {}
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const evRes = await API.get('/events');
      if (evRes.data?.data?.length > 0) {
        setEvents(evRes.data.data.map(ev => ({
          ...ev,
          date: new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          status: 'Registered'
        })));
      }
    } catch (err) { /* use defaults */ }
    setLoading(false);
  };

  const handleRegister = async (ev) => {
    try {
      await API.post(`/events/${ev._id}/register`);
    } catch (e) {}
    alert(`🎉 Registered for "${ev.title}"!`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = volunteerName.split(' ')[0];

  return (
    <div style={S.root}>
      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <span style={S.logoMark}>
            <svg viewBox="0 0 32 32" width="24" height="24">
              <rect x="1" y="1" width="30" height="30" rx="8" fill="white" />
              <path d="M16 22c-4-2.5-7-5.3-7-8.8a4.7 4.7 0 0 1 7-4.1 4.7 4.7 0 0 1 7 4.1c0 3.5-3 6.3-7 8.8Z" fill="#16a34a" />
            </svg>
          </span>
          <span style={S.logoText}>Community Care</span>
        </div>

        <div style={S.navSection}>
          <div style={S.navLabel}>VOLUNTEER</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              style={{ ...S.navItem, ...(activeTab === item.key ? S.navItemActive : {}) }}
              onClick={() => setActiveTab(item.key)}
            >
              <Icon d={item.icon} size={16} color={activeTab === item.key ? '#fff' : '#86efac'} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={S.sidebarFooter}>
          <div style={S.userAvatar}>{volunteerName[0]}</div>
          <div style={S.userInfo}>
            <div style={S.userName}>{volunteerName}</div>
            <div style={S.userEmail}>{volunteerEmail}</div>
          </div>
          <button style={S.logoutBtn} onClick={() => { localStorage.removeItem('currentUser'); navigate('/'); }}>
            <Icon d={Icons.logout} size={15} color="#86efac" />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={S.main}>
        {/* Top bar */}
        <div style={S.topBar}>
          <div>
            <h1 style={S.greeting}>{greeting()}, {firstName} 👋</h1>
            <p style={S.greetingSub}>Here's what's happening with your volunteering today.</p>
          </div>
          <div style={S.topBarRight}>
            <button style={S.bellBtn}>
              <Icon d={Icons.bell} size={20} />
              <span style={S.bellBadge}>{notifCount}</span>
            </button>
            <button style={S.findEventsBtn} onClick={() => setActiveTab('events')}>
              <Icon d={Icons.plus} size={16} color="#fff" /> Find Events
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && <DashboardView events={events} activities={activities} loading={loading} onRegister={handleRegister} />}
        {activeTab === 'events' && <EventsView events={events} loading={loading} onRegister={handleRegister} />}
        {activeTab === 'hours' && <HoursView />}
        {activeTab === 'donations' && <DonationsView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'reports' && <ReportsView />}
        {(activeTab === 'beneficiaries') && <PlaceholderView label="Beneficiaries" />}
      </main>
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView({ events, activities, loading, onRegister }) {
  const maxHours = Math.max(...MONTHLY_HOURS.map(m => m.hours));

  return (
    <div>
      {/* Stat cards */}
      <div style={S.statRow}>
        {[
          { label: 'Total Hours Logged', value: '128 hrs', badge: '+8 this month', icon: Icons.clock },
          { label: 'Events Attended', value: '24', badge: '+3 this month', icon: Icons.calendar },
          { label: 'Badges Earned', value: '7', badge: '+1 new', icon: Icons.badge },
          { label: 'Upcoming Events', value: '3', badge: 'Next: Jul 12', icon: Icons.events, badgeBlue: true },
        ].map((s, i) => (
          <div key={i} style={S.statCard}>
            <div style={S.statTop}>
              <Icon d={s.icon} size={20} color="#16a34a" />
              <span style={{ ...S.statBadge, ...(s.badgeBlue ? S.statBadgeBlue : {}) }}>{s.badge}</span>
            </div>
            <div style={S.statValue}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Goal */}
      <div style={S.twoCol}>
        {/* Bar chart */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div>
              <div style={S.cardTitle}>Monthly Volunteer Hours</div>
              <div style={S.cardSub}>Jan – Jul 2025</div>
            </div>
            <button style={S.viewAllBtn}>View all</button>
          </div>
          <div style={S.chartArea}>
            {MONTHLY_HOURS.map((m, i) => (
              <div key={i} style={S.barCol}>
                <div style={{ ...S.bar, height: `${(m.hours / maxHours) * 100}%`, background: i === 6 ? '#16a34a' : '#bbf7d0' }} />
                <div style={S.barLabel}>{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Goal */}
        <div style={S.card}>
          <div style={S.cardTitle}>Monthly Goal</div>
          <div style={S.cardSub}>20 hours target for July</div>
          <div style={{ margin: '16px 0 8px' }}>
            <div style={S.goalRow}>
              <span style={S.goalLabel}>Progress</span>
              <span style={S.goalValue}>14 / 20 hrs</span>
            </div>
            <div style={S.progressBg}>
              <div style={{ ...S.progressFill, width: '70%' }} />
            </div>
          </div>
          <div style={S.skillSection}>
            <div style={S.skillLabel}>SKILL TAGS</div>
            <div style={S.skillTags}>
              {['Teaching', 'Logistics', 'Outreach', 'Medical Aid'].map(t => (
                <span key={t} style={S.skillTag}>{t}</span>
              ))}
            </div>
          </div>
          <div style={S.topVolCard}>
            <div style={S.topVolAvatar}>P</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#0a3d24' }}>Top Volunteer</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>July rank: #4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events + Activity */}
      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Upcoming Events</div>
            <button style={S.viewAllBtn}>View all</button>
          </div>
          {loading ? <p style={{ color: '#6b7280' }}>Loading…</p> : events.slice(0, 3).map((ev, i) => (
            <div key={ev._id || i} style={S.eventRow}>
              <div style={S.eventDate}>
                <div style={S.eventDay}>{ev.date?.split(' ')[1] || ev.date}</div>
                <div style={S.eventMonth}>{ev.date?.split(' ')[0] || 'Jul'}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={S.eventTitle}>{ev.title}</div>
                <div style={S.eventLoc}>📍 {ev.location || ev.organization}</div>
              </div>
              <span style={{ ...S.statusBadge, ...(ev.status === 'Registered' ? S.statusGreen : S.statusOrange) }}>
                {ev.status || 'Open'}
              </span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={S.cardTitle}>Recent Activity</div>
            <button style={S.viewAllBtn}>See history</button>
          </div>
          {activities.map((a, i) => (
            <div key={a._id || i} style={S.actRow}>
              <div style={S.actIcon}>
                <Icon d={Icons.activity} size={14} color="#16a34a" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={S.actTitle}>{a.title}</div>
                <div style={S.actType}>{a.type}</div>
              </div>
              <div style={S.actTime}>{a.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact banner */}
      <div style={S.impactBanner}>
        <div style={S.impactLeft}>
          <span style={S.impactIcon}><Icon d={Icons.heart} size={18} color="#16a34a" /></span>
          <div>
            <div style={S.impactTitle}>You've impacted 48 lives this year</div>
            <div style={S.impactSub}>Keep going — you're in the top 10% of volunteers on this platform.</div>
          </div>
        </div>
        <button style={S.impactBtn}>View Impact Report</button>
      </div>
    </div>
  );
}

// ─── Events View ──────────────────────────────────────────────────────────────
function EventsView({ events, loading, onRegister }) {
  return (
    <div style={S.card}>
      <div style={S.cardTitle} >My Events</div>
      {loading ? <p>Loading…</p> : events.map((ev, i) => (
        <div key={ev._id || i} style={S.eventRow}>
          <div style={S.eventDate}>
            <div style={S.eventDay}>{ev.date?.split(' ')[1] || ev.date}</div>
            <div style={S.eventMonth}>{ev.date?.split(' ')[0] || 'Jul'}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={S.eventTitle}>{ev.title}</div>
            <div style={S.eventLoc}>📍 {ev.location || ev.organization}</div>
          </div>
          <button style={S.registerBtn} onClick={() => onRegister(ev)}>Register</button>
        </div>
      ))}
    </div>
  );
}

// ─── Hours View ───────────────────────────────────────────────────────────────
function HoursView() {
  const [entries, setEntries] = useState([
    { title: 'City Center Food Distribution', category: 'Community Support', hours: 4, status: 'Approved' },
    { title: 'School Supplies Drive Onboarding', category: 'Education Drive', hours: 3, status: 'Pending' },
  ]);
  const [form, setForm] = useState({ title: '', hours: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setEntries([{ ...form, hours: Number(form.hours), status: 'Pending' }, ...entries]);
    setForm({ title: '', hours: '', category: '' });
    setShowForm(false);
  };

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <div style={S.cardTitle}>Volunteer Hours</div>
        <button style={S.findEventsBtn} onClick={() => setShowForm(!showForm)}>+ Log Hours</button>
      </div>
      {showForm && (
        <form onSubmit={submit} style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <input style={S.input} placeholder="Activity title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input style={S.input} type="number" placeholder="Hours" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} required />
          <input style={S.input} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <button type="submit" style={S.findEventsBtn}>Submit</button>
        </form>
      )}
      {entries.map((e, i) => (
        <div key={i} style={S.eventRow}>
          <div style={{ flex: 1 }}>
            <div style={S.eventTitle}>{e.title}</div>
            <div style={S.eventLoc}>{e.category} · {e.hours} hrs</div>
          </div>
          <span style={{ ...S.statusBadge, ...(e.status === 'Approved' ? S.statusGreen : S.statusOrange) }}>{e.status}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Donations, Notifications, Reports, Placeholder ──────────────────────────
function DonationsView() {
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Donations</div>
      <p style={{ color: '#6b7280', marginTop: 8 }}>No donations recorded yet. Visit the landing page to explore causes.</p>
    </div>
  );
}
function NotificationsView() {
  const notes = [
    { text: 'Registered for Coastal Cleanup Campaign', time: '2h ago' },
    { text: 'Your hours for Food Drive have been approved', time: 'Yesterday' },
    { text: 'New event: School Supplies Drive on Jul 26', time: 'Jul 8' },
  ];
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Notifications</div>
      {notes.map((n, i) => (
        <div key={i} style={{ ...S.actRow, borderBottom: '1px solid #f3f4f6', paddingBottom: 12, marginBottom: 12 }}>
          <div style={S.actIcon}><Icon d={Icons.bell} size={14} color="#16a34a" /></div>
          <div style={{ flex: 1 }}><div style={S.actTitle}>{n.text}</div></div>
          <div style={S.actTime}>{n.time}</div>
        </div>
      ))}
    </div>
  );
}
function ReportsView() {
  return (
    <div style={S.card}>
      <div style={S.cardTitle}>Reports</div>
      <div style={S.statRow}>
        {[
          { label: 'Total Hours', value: '128' },
          { label: 'Events', value: '24' },
          { label: 'Impact Score', value: '48' },
        ].map((r, i) => (
          <div key={i} style={S.statCard}>
            <div style={S.statValue}>{r.value}</div>
            <div style={S.statLabel}>{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function PlaceholderView({ label }) {
  return <div style={S.card}><div style={S.cardTitle}>{label}</div><p style={{ color: '#6b7280', marginTop: 8 }}>Coming soon.</p></div>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  root: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Manrope', sans-serif", background: '#f4f7f6' },
  // Sidebar
  sidebar: { width: 220, background: '#0a3d24', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: 10, padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logoMark: { display: 'flex' },
  logoText: { color: '#fff', fontWeight: 700, fontSize: 15 },
  navSection: { flex: 1, padding: '16px 0' },
  navLabel: { color: '#86efac', fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '0 20px 8px' },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 20px', background: 'none', border: 'none', color: '#86efac', fontSize: 13.5, cursor: 'pointer', textAlign: 'left', borderRadius: 0 },
  navItemActive: { background: '#16a34a', color: '#fff', borderRadius: '0 8px 8px 0', marginRight: 12 },
  sidebarFooter: { display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  userAvatar: { width: 34, height: 34, borderRadius: '50%', background: '#16a34a', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: { color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userEmail: { color: '#86efac', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 },
  // Main
  main: { flex: 1, padding: '28px 32px', overflowY: 'auto' },
  topBar: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: 700, color: '#0a3d24', margin: 0 },
  greetingSub: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  bellBtn: { position: 'relative', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', display: 'flex' },
  bellBadge: { position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', borderRadius: '50%', fontSize: 10, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  findEventsBtn: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  // Stats
  statRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 },
  statCard: { background: '#fff', borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  statTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statBadge: { background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 },
  statBadgeBlue: { background: '#eff6ff', color: '#3b82f6' },
  statValue: { fontSize: 26, fontWeight: 800, color: '#0a3d24' },
  statLabel: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  // Two-col layout
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  // Card
  card: { background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: '#0a3d24' },
  cardSub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  viewAllBtn: { background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#6b7280', cursor: 'pointer' },
  // Chart
  chartArea: { display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, paddingTop: 16 },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '100%', borderRadius: '4px 4px 0 0', transition: 'height 0.3s' },
  barLabel: { fontSize: 11, color: '#6b7280' },
  // Goal
  goalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  goalLabel: { fontSize: 12, color: '#6b7280' },
  goalValue: { fontSize: 12, fontWeight: 600, color: '#0a3d24' },
  progressBg: { background: '#e5e7eb', borderRadius: 99, height: 8 },
  progressFill: { background: '#16a34a', borderRadius: 99, height: '100%' },
  skillSection: { marginTop: 16 },
  skillLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#6b7280', marginBottom: 8 },
  skillTags: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  skillTag: { background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  topVolCard: { display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', borderRadius: 8, padding: '10px 12px', marginTop: 16 },
  topVolAvatar: { width: 32, height: 32, borderRadius: '50%', background: '#16a34a', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  // Event row
  eventRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid #f3f4f6' },
  eventDate: { textAlign: 'center', minWidth: 36 },
  eventDay: { fontSize: 15, fontWeight: 700, color: '#0a3d24' },
  eventMonth: { fontSize: 11, color: '#6b7280', textTransform: 'uppercase' },
  eventTitle: { fontSize: 13.5, fontWeight: 600, color: '#111827' },
  eventLoc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusBadge: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap' },
  statusGreen: { background: '#dcfce7', color: '#16a34a' },
  statusOrange: { background: '#fef3c7', color: '#d97706' },
  registerBtn: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' },
  // Activity
  actRow: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  actIcon: { width: 28, height: 28, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  actTitle: { fontSize: 13, color: '#111827', fontWeight: 500 },
  actType: { fontSize: 11, color: '#6b7280' },
  actTime: { fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', paddingTop: 2 },
  // Impact banner
  impactBanner: { background: '#0a3d24', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  impactLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  impactIcon: { width: 36, height: 36, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  impactTitle: { color: '#fff', fontWeight: 700, fontSize: 15 },
  impactSub: { color: '#86efac', fontSize: 12, marginTop: 2 },
  impactBtn: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap' },
  // Form
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13.5, marginBottom: 10, boxSizing: 'border-box' },
};
