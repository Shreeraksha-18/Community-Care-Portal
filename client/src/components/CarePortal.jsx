import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

// ── Design tokens ──────────────────────────────────────────────
const C = {
  sidebar: '#0a3d24',
  sidebarActive: '#16a34a',
  sidebarText: 'rgba(255,255,255,0.75)',
  sidebarActiveText: '#ffffff',
  green: '#16a34a',
  greenDark: '#0f6b3f',
  greenLight: '#dcfce7',
  greenBg: '#f0fdf4',
  bg: '#f4f6f5',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  navy: '#0a3d24',
};

// ── SVG Icon ────────────────────────────────────────────────────
function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}
    </svg>
  );
}

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  events: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  hours: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2',
  donations: 'M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z',
  beneficiaries: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  notifications: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0',
  reports: 'M4 20V10m6 10V4m6 16v-7',
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0',
  plus: 'M12 5v14M5 12h14',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  badge: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  check: 'M20 6L9 17l-5-5',
  award: 'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12',
};

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { key: 'events', label: 'My Events', icon: ICONS.events },
  { key: 'hours', label: 'Volunteer Hours', icon: ICONS.hours },
  { key: 'donations', label: 'Donations', icon: ICONS.donations },
  { key: 'beneficiaries', label: 'Beneficiaries', icon: ICONS.beneficiaries },
  { key: 'notifications', label: 'Notifications', icon: ICONS.notifications },
  { key: 'reports', label: 'Reports', icon: ICONS.reports },
];

const DEFAULT_EVENTS = [
  { _id: '1', title: 'City Food Drive', category: 'Community', date: '12', month: 'JUL', location: 'City Center, Mumbai', status: 'Registered' },
  { _id: '2', title: 'Coastal Cleanup', category: 'Environment', date: '19', month: 'JUL', location: 'Juhu Beach, Mumbai', status: 'Registered' },
  { _id: '3', title: 'School Supplies Drive', category: 'Education', date: '26', month: 'JUL', location: 'Dharavi School', status: 'Pending' },
];

const DEFAULT_ACTIVITIES = [
  { _id: '1', title: 'Registered for Coastal Cleanup Campaign', type: 'Event Registration', time: '2h ago', icon: ICONS.calendar },
  { _id: '2', title: 'Logged 4 hours for Food Drive', type: 'Hours Logged', time: 'Yesterday', icon: ICONS.clock },
  { _id: '3', title: 'Donated ₹500 to Water for All campaign', type: 'Donation', time: 'Jul 8', icon: ICONS.heart },
  { _id: '4', title: 'Completed onboarding at Dharavi School', type: 'Event Completed', time: 'Jul 5', icon: ICONS.check },
];

const MONTHLY_HOURS = [
  { month: 'Jan', hours: 8 }, { month: 'Feb', hours: 12 }, { month: 'Mar', hours: 6 },
  { month: 'Apr', hours: 10 }, { month: 'May', hours: 9 }, { month: 'Jun', hours: 15 }, { month: 'Jul', hours: 20 },
];

export default function CarePortal({ onBackToHome }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [userName, setUserName] = useState('Priya Sharma');
  const [userEmail, setUserEmail] = useState('priya@care.org');
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'));
      if (u?.name) setUserName(u.name);
      if (u?.email) setUserEmail(u.email);
    } catch (e) {}
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events');
      if (res.data?.data?.length > 0) {
        setEvents(res.data.data.map(ev => {
          const d = new Date(ev.date);
          return { ...ev, date: d.getDate(), month: d.toLocaleString('en', { month: 'short' }).toUpperCase(), status: 'Open' };
        }));
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleRegister = async (ev) => {
    try { await API.post(`/events/${ev._id}/register`); } catch (e) {}
    alert(`Registered for "${ev.title}"!`);
    setEvents(prev => prev.map(e => e._id === ev._id ? { ...e, status: 'Registered' } : e));
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  const handleLogout = () => { localStorage.removeItem('currentUser'); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter','Manrope',sans-serif", background: C.bg }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 220, background: C.sidebar, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '22px 20px 18px', borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z"/></svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Community Care</span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', padding: '0 20px 10px', textTransform: 'uppercase' }}>Volunteer</div>
          {NAV.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 20px', background: tab === item.key ? C.sidebarActive : 'none', border: 'none', color: tab === item.key ? '#fff' : C.sidebarText, fontSize: 13.5, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', borderRadius: tab === item.key ? '0 8px 8px 0' : 0, marginRight: tab === item.key ? 12 : 0 }}>
              <Icon d={item.icon} size={16} color={tab === item.key ? '#fff' : 'rgba(255,255,255,0.6)'}/>
              {item.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.green, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{userName[0]}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.5)', display: 'flex' }} title="Sign out">
            <Icon d={ICONS.logout} size={15} color="rgba(255,255,255,0.5)"/>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: 0 }}>{greeting()}, {userName.split(' ')[0]} 👋</h1>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 0 }}>Here's what's happening with your volunteering today.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ position: 'relative', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', display: 'flex' }} onClick={() => setTab('notifications')}>
              <Icon d={ICONS.bell} size={20} color={C.muted}/>
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', borderRadius: '50%', fontSize: 10, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span>
            </button>
            <button style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setTab('events')}>
              <Icon d={ICONS.plus} size={16} color="#fff"/> Find Events
            </button>
          </div>
        </div>

        {tab === 'dashboard' && <DashboardView events={events} activities={DEFAULT_ACTIVITIES} loading={loading} onRegister={handleRegister} onTabChange={setTab}/>}
        {tab === 'events' && <EventsView events={events} loading={loading} onRegister={handleRegister}/>}
        {tab === 'hours' && <HoursView/>}
        {tab === 'donations' && <DonationsView/>}
        {tab === 'notifications' && <NotificationsView/>}
        {tab === 'reports' && <ReportsView/>}
        {tab === 'beneficiaries' && <BeneficiariesView/>}
      </main>
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, ...style }}>{children}</div>;
}

function DashboardView({ events, activities, loading, onRegister, onTabChange }) {
  const maxH = Math.max(...MONTHLY_HOURS.map(m => m.hours));
  const stats = [
    { label: 'Total Hours Logged', value: '128 hrs', badge: '+8 this month', badgeColor: C.green, icon: ICONS.clock },
    { label: 'Events Attended', value: '24', badge: '+3 this month', badgeColor: C.green, icon: ICONS.calendar },
    { label: 'Badges Earned', value: '7', badge: '+1 new', badgeColor: C.green, icon: ICONS.badge },
    { label: 'Upcoming Events', value: '3', badge: 'Next: Jul 12', badgeColor: '#3b82f6', icon: ICONS.events },
  ];

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={s.icon} size={18} color={C.green}/>
              </div>
              <span style={{ background: s.badgeColor === '#3b82f6' ? '#eff6ff' : C.greenLight, color: s.badgeColor, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{s.badge}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Goal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Monthly Volunteer Hours</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Jan – Jul 2025</div>
            </div>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 12px', fontSize: 12, color: C.green, cursor: 'pointer', fontWeight: 600 }} onClick={() => onTabChange('hours')}>View all</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 110 }}>
            {MONTHLY_HOURS.map((m, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' }}>
                <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: i === 6 ? C.green : '#bbf7d0', height: `${(m.hours / maxH) * 90}%`, minHeight: 4, transition: 'height 0.3s' }}/>
                <div style={{ fontSize: 10.5, color: i === 6 ? C.green : C.muted, fontWeight: i === 6 ? 700 : 400 }}>{m.month}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Monthly Goal</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2, marginBottom: 16 }}>20 hours target for July</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
            <span style={{ color: C.muted }}>Progress</span>
            <span style={{ fontWeight: 700, color: C.navy }}>14 / 20 hrs</span>
          </div>
          <div style={{ background: C.border, borderRadius: 99, height: 8, marginBottom: 20 }}>
            <div style={{ background: C.green, borderRadius: 99, height: '100%', width: '70%' }}/>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.muted, marginBottom: 8, textTransform: 'uppercase' }}>Skill Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {['Teaching', 'Logistics', 'Outreach', 'Medical Aid'].map(t => (
              <span key={t} style={{ background: C.greenLight, color: C.green, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: C.greenBg, borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.green, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>P</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 12.5, color: C.navy }}>Top Volunteer</div>
              <div style={{ fontSize: 11, color: C.muted }}>July rank: #4</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Events + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Card style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Upcoming Events</div>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 12px', fontSize: 12, color: C.muted, cursor: 'pointer' }} onClick={() => onTabChange('events')}>View all</button>
          </div>
          {loading ? <p style={{ color: C.muted }}>Loading…</p> : events.slice(0, 3).map((ev, i) => (
            <div key={ev._id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ textAlign: 'center', width: 38, flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{ev.date}</div>
                <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', marginTop: 1 }}>{ev.month || 'JUL'}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{ev.title}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>📍 {ev.location}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ev.status === 'Registered' ? C.greenLight : '#fef3c7', color: ev.status === 'Registered' ? C.green : '#d97706', whiteSpace: 'nowrap' }}>{ev.status || 'Open'}</span>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Recent Activity</div>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 12px', fontSize: 12, color: C.muted, cursor: 'pointer' }}>See history</button>
          </div>
          {activities.map((a, i) => (
            <div key={a._id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < activities.length - 1 ? 14 : 0 }}>
              <div style={{ width: 28, height: 28, background: C.greenLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={a.icon || ICONS.activity} size={13} color={C.green}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{a.type}</div>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', paddingTop: 2 }}>{a.time}</div>
            </div>
          ))}
        </Card>
      </div>

      {/* Impact banner */}
      <div style={{ background: C.sidebar, borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 36, height: 36, background: C.greenLight, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d={ICONS.heart} size={18} color={C.green}/>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14.5 }}>You've impacted 48 lives this year</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>Keep going — you're in the top 10% of volunteers on this platform.</div>
          </div>
        </div>
        <button style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap' }}>View Impact Report</button>
      </div>
    </div>
  );
}

function EventsView({ events, loading, onRegister }) {
  const [search, setSearch] = useState('');
  const filtered = events.filter(ev => ev.title.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>My Events</h2><p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Browse and register for upcoming community drives.</p></div>
        <input type="text" placeholder="Search events…" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '9px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', width: 220 }}/>
      </div>
      <Card>
        {loading ? <p style={{ color: C.muted }}>Loading…</p> : filtered.map((ev, i) => (
          <div key={ev._id || i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 44, height: 44, background: C.greenLight, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{ev.date}</div>
              <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase' }}>{ev.month || 'JUL'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>📍 {ev.location} · {ev.category}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: ev.status === 'Registered' ? C.greenLight : '#fef3c7', color: ev.status === 'Registered' ? C.green : '#d97706', marginRight: 12 }}>{ev.status || 'Open'}</span>
            {ev.status !== 'Registered' && (
              <button onClick={() => onRegister(ev)} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Register</button>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function HoursView() {
  const [entries, setEntries] = useState([
    { title: 'City Center Food Distribution', category: 'Community Support', hours: 4, date: 'Jul 8', status: 'Approved' },
    { title: 'School Supplies Drive Onboarding', category: 'Education Drive', hours: 3, date: 'Jul 5', status: 'Pending' },
    { title: 'Beach Cleanup Volunteer', category: 'Environment', hours: 5, date: 'Jun 28', status: 'Approved' },
  ]);
  const [form, setForm] = useState({ title: '', hours: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  const totalApproved = entries.filter(e => e.status === 'Approved').reduce((s, e) => s + e.hours, 0);

  const submit = async (e) => {
    e.preventDefault();
    try { await API.post('/activities', { title: form.title, hoursLogged: Number(form.hours), category: form.category }); } catch (err) {}
    setEntries([{ ...form, hours: Number(form.hours), date: 'Today', status: 'Pending' }, ...entries]);
    setForm({ title: '', hours: '', category: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Volunteer Hours</h2><p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Log and track your approved volunteer hours.</p></div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon d={ICONS.plus} size={16} color="#fff"/> Log Hours
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        {[{ label: 'Total Hours Logged', value: entries.reduce((s, e) => s + e.hours, 0) + ' hrs' }, { label: 'Approved Hours', value: totalApproved + ' hrs' }, { label: 'Pending Review', value: entries.filter(e => e.status === 'Pending').length }].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <Card>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, color: C.navy }}>Log New Hours</h3>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Activity Title</label><input style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} placeholder="e.g. Food Distribution" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required/></div>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Hours</label><input type="number" style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} placeholder="e.g. 4" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })} required min="0.5"/></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Category</label><input style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} placeholder="e.g. Community Support" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}/></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Submit Hours</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: '#fff', color: C.muted, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead><tr>{['Activity', 'Category', 'Hours', 'Date', 'Status'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', borderBottom: `1.5px solid ${C.border}`, background: '#f9fafb' }}>{h}</th>)}</tr></thead>
          <tbody>{entries.map((e, i) => (
            <tr key={i}>
              <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, color: C.text }}>{e.title}</td>
              <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{e.category}</td>
              <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.navy }}>{e.hours} hrs</td>
              <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{e.date}</td>
              <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}` }}><span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: e.status === 'Approved' ? C.greenLight : '#fef3c7', color: e.status === 'Approved' ? C.green : '#d97706' }}>{e.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

function DonationsView() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Donations</h2>
      <Card><p style={{ color: C.muted, margin: 0 }}>No donations recorded yet. Visit the Campaigns section on the Donor dashboard to support a cause.</p></Card>
    </div>
  );
}

function NotificationsView() {
  const notes = [
    { text: 'Registered for Coastal Cleanup Campaign', sub: 'Event Registration', time: '2h ago', icon: ICONS.calendar },
    { text: 'Your hours for Food Drive have been approved', sub: 'Hours Approved', time: 'Yesterday', icon: ICONS.check },
    { text: 'New event: School Supplies Drive on Jul 26', sub: 'New Event', time: 'Jul 8', icon: ICONS.bell },
    { text: 'Monthly goal: 70% reached — keep going!', sub: 'Goal Update', time: 'Jul 6', icon: ICONS.award },
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Notifications</h2>
      <Card>
        {notes.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', borderBottom: i < notes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 36, height: 36, background: C.greenLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={n.icon} size={16} color={C.green}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: C.text }}>{n.text}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{n.sub}</div>
            </div>
            <div style={{ fontSize: 11.5, color: '#9ca3af', whiteSpace: 'nowrap' }}>{n.time}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ReportsView() {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
        {[{ label: 'Total Hours Logged', value: '128 hrs' }, { label: 'Events Attended', value: '24' }, { label: 'Lives Impacted', value: '48' }].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <Card>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, color: C.navy }}>Volunteer Summary</h3>
        <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>You have contributed <strong>128 hours</strong> across <strong>24 events</strong> this year, directly impacting <strong>48 lives</strong> in your community. You're ranked <strong>#4</strong> among volunteers this month.</p>
        <button style={{ marginTop: 16, background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Download Report (PDF)</button>
      </Card>
    </div>
  );
}

function BeneficiariesView() {
  const items = [
    { name: 'Dharavi Primary School Children', category: 'Education', location: 'Mumbai', status: 'Assisted' },
    { name: 'Coastal Fishermen Community', category: 'Disaster Relief', location: 'Versova', status: 'In Progress' },
    { name: 'Andheri Food Bank Recipients', category: 'Food Support', location: 'Andheri', status: 'Assisted' },
  ];
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Beneficiaries</h2>
      <Card>
        {items.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 40, height: 40, background: C.greenLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={ICONS.beneficiaries} size={18} color={C.green}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{b.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{b.category} · 📍 {b.location}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: b.status === 'Assisted' ? C.greenLight : '#fef3c7', color: b.status === 'Assisted' ? C.green : '#d97706' }}>{b.status}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
