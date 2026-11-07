import React, { useState, useEffect, useRef } from 'react';
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
function Icon({ d, size = 16, color = 'currentColor', strokeWidth = 2, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
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
  {
    _id: '1',
    title: 'Food Drive at City Center',
    category: 'Community',
    date: '12',
    month: 'JUL',
    year: '2026',
    fullDate: 'July 12, 2026',
    location: 'City Center, Mumbai',
    spotsTotal: 30,
    spotsLeft: 24,
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    description: 'Distribute hot meals, dry rations, and care packages to underprivileged families.'
  },
  {
    _id: '2',
    title: 'Coastal Cleanup Campaign',
    category: 'Environment',
    date: '19',
    month: 'JUL',
    year: '2026',
    fullDate: 'July 19, 2026',
    location: 'Juhu Beach, Mumbai',
    spotsTotal: 40,
    spotsLeft: 18,
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    description: 'Join volunteers to clean plastic waste along the coastline and protect marine life.'
  },
  {
    _id: '3',
    title: 'School Supplies Drive',
    category: 'Education',
    date: '26',
    month: 'JUL',
    year: '2026',
    fullDate: 'July 26, 2026',
    location: 'Dharavi School, Mumbai',
    spotsTotal: 25,
    spotsLeft: 10,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    description: 'Provide bags, textbooks, and stationery kits to children for the upcoming academic year.'
  },
  {
    _id: '4',
    title: 'Community Tree Plantation Drive',
    category: 'Environment',
    date: '02',
    month: 'AUG',
    year: '2026',
    fullDate: 'August 2, 2026',
    location: 'Sanjay Gandhi National Park',
    spotsTotal: 50,
    spotsLeft: 35,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    description: 'Help plant indigenous saplings and restore green cover in urban fringes.'
  }
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
  const tabRef = useRef(tab);
  const [userName, setUserName] = useState('Priya Sharma');
  const [userEmail, setUserEmail] = useState('priya@care.org');
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(false);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const registerModalRef = useRef(registerModalOpen);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regFormData, setRegFormData] = useState({
    name: 'Priya Sharma',
    email: 'priya@care.org',
    phone: '',
    emergencyContact: '',
    notes: ''
  });
  const [regSubmitting, setRegSubmitting] = useState(false);

  useEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  useEffect(() => {
    registerModalRef.current = registerModalOpen;
  }, [registerModalOpen]);

  const changeTab = (newTab) => {
    if (newTab === tabRef.current) return;
    if (tabRef.current === 'dashboard' && newTab !== 'dashboard') {
      window.history.pushState({ tab: newTab }, '');
    } else if (newTab !== 'dashboard') {
      window.history.replaceState({ tab: newTab }, '');
    }
    setTab(newTab);
  };

  useEffect(() => {
    // Initial guard entry on dashboard mount
    window.history.pushState({ tab: 'dashboard' }, '');

    const handlePopState = () => {
      if (registerModalRef.current) {
        setRegisterModalOpen(false);
        window.history.pushState({ tab: tabRef.current }, '');
        return;
      }
      if (tabRef.current !== 'dashboard') {
        setTab('dashboard');
        window.history.pushState({ tab: 'dashboard' }, '');
      } else {
        // Already on dashboard — prevent going back to signin/register screen
        window.history.pushState({ tab: 'dashboard' }, '');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'));
      if (u?.name) setUserName(u.name);
      if (u?.email) setUserEmail(u.email);
    } catch (e) {}
    fetchEvents();
    fetchMyRegistrations();
  }, []);

  // Listen to cross-tab storage changes so admin acceptance reflects immediately
  useEffect(() => {
    const handleStorageChange = () => {
      fetchMyRegistrations();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events');
      if (res.data?.data?.length > 0) {
        setEvents(res.data.data.map(ev => {
          const d = new Date(ev.date || Date.now());
          return {
            ...ev,
            date: d.getDate(),
            month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
            year: d.getFullYear(),
            fullDate: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            spotsLeft: Math.max(0, (ev.spotsTotal || 30) - (ev.volunteersRegistered?.length || 0)),
            image: ev.image || (
              ev.category === 'Environment' ? 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80' :
              ev.category === 'Education' ? 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80' :
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'
            )
          };
        }));
      }
    } catch (e) {}
    setLoading(false);
  };

  const fetchMyRegistrations = async () => {
    let regs = [];
    try {
      const res = await API.get('/registrations/my');
      if (res.data?.data) {
        regs = res.data.data;
      }
    } catch (e) {}

    // Merge with localStorage portal_registrations for real-time local sync with Admin
    try {
      const stored = JSON.parse(localStorage.getItem('portal_registrations') || '[]');
      if (stored.length > 0) {
        const ids = new Set(regs.map(r => r._id));
        for (const sr of stored) {
          if (!ids.has(sr._id)) {
            regs.unshift(sr);
          } else {
            const match = regs.find(r => r._id === sr._id);
            if (match && sr.status) match.status = sr.status;
          }
        }
      }
    } catch (e) {}

    setMyRegistrations(regs);
  };

  const handleOpenRegisterForm = (ev) => {
    setSelectedEvent(ev);
    setRegFormData({
      name: userName || 'Priya Sharma',
      email: userEmail || 'priya@care.org',
      phone: '',
      emergencyContact: '',
      notes: ''
    });
    setRegisterModalOpen(true);
  };

  const handleFormRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setRegSubmitting(true);

    const newReg = {
      _id: 'reg_' + Date.now(),
      eventId: selectedEvent._id,
      event: selectedEvent._id,
      eventTitle: selectedEvent.title,
      volunteerName: regFormData.name,
      volunteerEmail: regFormData.email,
      volunteerPhone: regFormData.phone,
      emergencyContact: regFormData.emergencyContact,
      notes: regFormData.notes,
      createdAt: new Date().toISOString(),
      status: 'Pending' // Acceptance: pending!
    };

    // Try posting to API
    const isRealId = /^[a-f\d]{24}$/i.test(selectedEvent._id);
    if (isRealId) {
      try {
        const res = await API.post('/registrations', {
          eventId: selectedEvent._id,
          volunteerPhone: regFormData.phone,
          emergencyContact: regFormData.emergencyContact,
          notes: regFormData.notes
        });
        if (res.data?.data) {
          newReg._id = res.data.data._id;
        }
      } catch (err) {}
    }

    // Persist to localStorage portal_registrations so Admin dashboard receives it immediately
    try {
      const stored = JSON.parse(localStorage.getItem('portal_registrations') || '[]');
      const filtered = stored.filter(r => r.eventTitle !== selectedEvent.title && r.event !== selectedEvent._id);
      localStorage.setItem('portal_registrations', JSON.stringify([newReg, ...filtered]));
    } catch (err) {}

    setMyRegistrations(prev => [newReg, ...prev.filter(r => r.eventTitle !== selectedEvent.title && r.event !== selectedEvent._id)]);

    // Update spot count locally
    setEvents(prev => prev.map(ev => ev._id === selectedEvent._id ? {
      ...ev,
      spotsLeft: Math.max(0, (ev.spotsLeft !== undefined ? ev.spotsLeft : 24) - 1)
    } : ev));

    setRegSubmitting(false);
    setRegisterModalOpen(false);
    alert(`📋 Registration submitted for "${selectedEvent.title}"! Status: Acceptance Pending.`);
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  const handleLogout = () => { localStorage.removeItem('currentUser'); navigate('/'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter','Manrope',sans-serif", background: C.bg, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 180, minWidth: 180, background: C.sidebar, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
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
            <button key={item.key} onClick={() => changeTab(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', background: tab === item.key ? C.sidebarActive : 'none', border: 'none', color: tab === item.key ? '#fff' : C.sidebarText, fontSize: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', borderRadius: tab === item.key ? '0 8px 8px 0' : 0, marginRight: tab === item.key ? 8 : 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Icon d={item.icon} size={14} color={tab === item.key ? '#fff' : 'rgba(255,255,255,0.6)'}/>
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
      <main style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', overflowX: 'hidden', minWidth: 0, boxSizing: 'border-box' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: C.navy, margin: 0 }}>{greeting()}, {userName.split(' ')[0]} 👋</h1>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 0 }}>Here's what's happening with your volunteering today.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              style={{
                position: 'relative',
                background: tab === 'notifications' ? '#e2e8f0' : '#fff',
                border: `1.5px solid ${tab === 'notifications' ? '#0f172a' : C.border}`,
                borderRadius: 8,
                padding: '8px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: tab === 'notifications' ? '0 1px 3px rgba(0,0,0,0.15)' : 'none',
                transition: 'all 0.15s ease',
              }}
              title="Notifications"
              aria-label="Notifications"
              onClick={() => changeTab('notifications')}
            >
              <Icon
                d={ICONS.bell}
                size={20}
                color={tab === 'notifications' ? '#0f172a' : C.muted}
                fill={tab === 'notifications' ? '#0f172a' : 'none'}
                strokeWidth={tab === 'notifications' ? 2.5 : 2}
              />
            </button>
            <button style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => changeTab('events')}>
              <Icon d={ICONS.plus} size={16} color="#fff"/> Find Events
            </button>
          </div>
        </div>

        {tab === 'dashboard' && (
          <DashboardView
            events={events}
            activities={DEFAULT_ACTIVITIES}
            loading={loading}
            myRegistrations={myRegistrations}
            onOpenRegisterForm={handleOpenRegisterForm}
            onTabChange={changeTab}
          />
        )}
        {tab === 'events' && (
          <EventsView
            events={events}
            loading={loading}
            myRegistrations={myRegistrations}
            onOpenRegisterForm={handleOpenRegisterForm}
          />
        )}
        {tab === 'hours' && <HoursView/>}
        {tab === 'donations' && <DonationsView/>}
        {tab === 'notifications' && <NotificationsView/>}
        {tab === 'reports' && <ReportsView/>}
        {tab === 'beneficiaries' && <BeneficiariesView/>}
      </main>

      {/* ── Event Registration Form Modal ── */}
      {registerModalOpen && selectedEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div style={{
            background: '#fff',
            width: 480,
            maxWidth: '100%',
            borderRadius: 16,
            padding: '26px 28px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setRegisterModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, color: C.muted, cursor: 'pointer' }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 4px', fontSize: 18, color: C.navy, fontWeight: 700 }}>
              Volunteer Registration Form
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: C.muted }}>
              Submit your details to register. Your application will be sent to the administrator for acceptance.
            </p>

            {/* Event Summary Card */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: C.navy, marginBottom: 4 }}>
                {selectedEvent.title}
              </div>
              <div style={{ fontSize: 12, color: '#4b5563', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <span>📅 {selectedEvent.fullDate || `${selectedEvent.month || 'JUL'} ${selectedEvent.date}, 2026`}</span>
                <span>📍 {selectedEvent.location}</span>
                <span>🏷️ {selectedEvent.category}</span>
              </div>
            </div>

            <form onSubmit={handleFormRegisterSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={regFormData.name}
                  onChange={e => setRegFormData({ ...regFormData, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regFormData.email}
                  onChange={e => setRegFormData({ ...regFormData, email: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={regFormData.phone}
                  onChange={e => setRegFormData({ ...regFormData, phone: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  Emergency Contact (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Contact Name & Number"
                  value={regFormData.emergencyContact}
                  onChange={e => setRegFormData({ ...regFormData, emergencyContact: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                  Volunteer Notes / Availability (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Any relevant skills or notes for admin review"
                  value={regFormData.notes}
                  onChange={e => setRegFormData({ ...regFormData, notes: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  style={{ padding: '9px 16px', border: `1px solid ${C.border}`, background: '#fff', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontWeight: 600, color: C.muted }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regSubmitting}
                  style={{ padding: '9px 20px', border: 'none', background: C.green, color: '#fff', borderRadius: 8, fontSize: 13.5, cursor: 'pointer', fontWeight: 700 }}
                >
                  {regSubmitting ? 'Submitting…' : 'Submit Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, ...style }}>{children}</div>;
}

function DashboardView({ events, activities, loading, myRegistrations = [], onOpenRegisterForm, onTabChange }) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 20 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
        <Card style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Upcoming Events</div>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 12px', fontSize: 12, color: C.muted, cursor: 'pointer' }} onClick={() => onTabChange('events')}>View all</button>
          </div>
          {loading ? <p style={{ color: C.muted }}>Loading…</p> : events.slice(0, 3).map((ev, i) => {
            const userReg = myRegistrations.find(r => r.event === ev._id || r.eventId === ev._id || r.eventTitle?.toLowerCase() === ev.title?.toLowerCase());
            const regStatus = userReg ? userReg.status : null;
            return (
              <div key={ev._id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ textAlign: 'center', width: 38, flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{ev.date}</div>
                  <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', marginTop: 1 }}>{ev.month || 'JUL'}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {ev.location}</div>
                </div>
                {regStatus === 'Pending' && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#fef3c7', color: '#d97706', whiteSpace: 'nowrap' }}>
                    Acceptance: Pending
                  </span>
                )}
                {regStatus === 'Approved' && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: C.greenLight, color: C.green, whiteSpace: 'nowrap' }}>
                    Accepted
                  </span>
                )}
                {regStatus === 'Rejected' && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#fee2e2', color: '#dc2626', whiteSpace: 'nowrap' }}>
                    Declined
                  </span>
                )}
                {!regStatus && (
                  <button onClick={() => onOpenRegisterForm(ev)} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    Register
                  </button>
                )}
              </div>
            );
          })}
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

function EventCard({ event, regStatus, onRegister }) {
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
    }}>
      {/* Top Banner Photo */}
      <div style={{ height: 160, width: '100%', overflow: 'hidden', position: 'relative', background: '#f3f4f6' }}>
        <img
          src={event.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80'}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Card Content */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Category & Spots Left */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{
            background: '#dcfce7',
            color: '#16a34a',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 20
          }}>
            {event.category}
          </span>
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>
            {event.spotsLeft !== undefined ? `${event.spotsLeft} spots left` : 'Spots available'}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 10px',
          fontSize: 15.5,
          fontWeight: 700,
          color: '#0a3d24',
          lineHeight: 1.3
        }}>
          {event.title}
        </h3>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#4b5563', marginBottom: 6 }}>
          <Icon d={ICONS.calendar} size={14} color="#6b7280"/>
          <span>{event.fullDate || `${event.month || 'JUL'} ${event.date}, 2026`}</span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#4b5563', marginBottom: 18 }}>
          <Icon d={ICONS.map} size={14} color="#6b7280"/>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.location}</span>
        </div>

        {/* Button / Acceptance Status */}
        <div style={{ marginTop: 'auto' }}>
          {!regStatus && (
            <button
              onClick={onRegister}
              style={{
                width: '100%',
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '11px',
                fontSize: 13.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              Register Now
            </button>
          )}

          {regStatus === 'Pending' && (
            <div style={{
              width: '100%',
              background: '#fef3c7',
              color: '#d97706',
              border: '1.5px solid #fde68a',
              borderRadius: 8,
              padding: '10px',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              <span>⏳ Acceptance: Pending</span>
            </div>
          )}

          {regStatus === 'Approved' && (
            <div style={{
              width: '100%',
              background: '#dcfce7',
              color: '#16a34a',
              border: '1.5px solid #bbf7d0',
              borderRadius: 8,
              padding: '10px',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}>
              <span>✓ Registered (Accepted)</span>
            </div>
          )}

          {regStatus === 'Rejected' && (
            <div style={{
              width: '100%',
              background: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: 8,
              padding: '10px',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center'
            }}>
              <span>✕ Registration Declined</span>
            </div>
          )}

          {regStatus === 'Attended' && (
            <div style={{
              width: '100%',
              background: '#eff6ff',
              color: '#2563eb',
              border: '1px solid #bfdbfe',
              borderRadius: 8,
              padding: '10px',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'center'
            }}>
              <span>★ Attended</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventsView({ events, loading, myRegistrations = [], onOpenRegisterForm }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
                          ev.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || ev.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Community Events</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Browse upcoming drives, register as a volunteer, and track your acceptance status.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ padding: '9px 12px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, background: '#fff', outline: 'none' }}
          >
            <option value="All">All Categories</option>
            <option value="Community">Community</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
          </select>
          <input
            type="text"
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '9px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', width: 220 }}
          />
        </div>
      </div>

      {loading ? (
        <Card><p style={{ color: C.muted, margin: 0 }}>Loading events…</p></Card>
      ) : filtered.length === 0 ? (
        <Card><p style={{ color: C.muted, margin: 0 }}>No events found matching your search.</p></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(ev => {
            const userReg = myRegistrations.find(r => r.event === ev._id || r.eventId === ev._id || r.eventTitle?.toLowerCase() === ev.title?.toLowerCase());
            const regStatus = userReg ? userReg.status : null;

            return (
              <EventCard
                key={ev._id}
                event={ev}
                regStatus={regStatus}
                onRegister={() => onOpenRegisterForm(ev)}
              />
            );
          })}
        </div>
      )}
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
    try {
      const res = await API.post('/activities', { title: form.title, hoursLogged: Number(form.hours), category: form.category });
      setEntries([{ title: form.title, category: form.category, hours: Number(form.hours), date: 'Today', status: 'Pending' }, ...entries]);
    } catch (err) {
      setEntries([{ title: form.title, category: form.category, hours: Number(form.hours), date: 'Today', status: 'Pending' }, ...entries]);
    }
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
  const [notes, setNotes] = useState([
    { text: 'Registered for Coastal Cleanup Campaign', sub: 'Event Registration', time: '2h ago', icon: ICONS.calendar },
    { text: 'Your hours for Food Drive have been approved', sub: 'Hours Approved', time: 'Yesterday', icon: ICONS.check },
    { text: 'New event: School Supplies Drive on Jul 26', sub: 'New Event', time: 'Jul 8', icon: ICONS.bell },
    { text: 'Monthly goal: 70% reached — keep going!', sub: 'Goal Update', time: 'Jul 6', icon: ICONS.award },
  ]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('portal_notifications') || '[]');
      if (stored.length > 0) {
        const mapped = stored.map(s => ({
          text: s.text,
          sub: s.sub || 'Status Update',
          time: s.time || 'Recently',
          icon: ICONS.check
        }));
        setNotes(prev => [...mapped, ...prev]);
      }
    } catch (e) {}
  }, []);

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Notifications</h2>
      <Card>
        {notes.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0', borderBottom: i < notes.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 36, height: 36, background: C.greenLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={n.icon || ICONS.bell} size={16} color={C.green}/>
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
