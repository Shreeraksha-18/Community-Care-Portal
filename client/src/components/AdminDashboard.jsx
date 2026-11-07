import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const C = {
  greenLight: '#dcfce7', greenBg: '#f0fdf4', bg: '#f4f6f5', card: '#ffffff',
  border: '#e5e7eb', text: '#111827', muted: '#6b7280', navy: '#0a3d24',
};

function Icon({ d, size = 16, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}</svg>;
}

const ICONS = {
  overview: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  volunteers: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  events: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  campaigns: 'M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z',
  beneficiaries: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  reports: 'M4 20V10m6 10V4m6 16v-7',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  plus: 'M12 5v14M5 12h14',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  check: 'M20 6L9 17l-5-5',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v6l4 2',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
};

const NAV = [
  { key: 'overview', label: 'Dashboard', icon: ICONS.overview },
  { key: 'volunteers', label: 'Manage Volunteers', icon: ICONS.volunteers },
  { key: 'events', label: 'Manage Events', icon: ICONS.events },
  { key: 'registrations', label: 'Registrations', icon: ICONS.check },
  { key: 'campaigns', label: 'Manage Campaigns', icon: ICONS.campaigns },
  { key: 'beneficiaries', label: 'Beneficiaries', icon: ICONS.beneficiaries },
  { key: 'reports', label: 'Reports & Analytics', icon: ICONS.reports },
];

const INIT_VOLUNTEERS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@seva.org', phone: '9876543210', hours: 128, events: 12, status: 'Active' },
  { id: 2, name: 'Ishaan Kapoor', email: 'ishaan@helpage.org', phone: '9876543211', hours: 64, events: 8, status: 'Active' },
  { id: 3, name: 'Ananya Roy', email: 'ananya@ecocare.org', phone: '9876543212', hours: 42, events: 5, status: 'Active' },
  { id: 4, name: 'Rohan Mehta', email: 'rohan@ngo.org', phone: '9876543213', hours: 20, events: 3, status: 'Pending' },
];

const INIT_EVENTS = [
  { id: 1, title: 'City Food Drive', category: 'Community', date: '2026-07-12', location: 'City Center, Mumbai', spots: 30, registered: 18, status: 'Published' },
  { id: 2, title: 'Coastal Cleanup Campaign', category: 'Environment', date: '2026-07-19', location: 'Juhu Beach, Mumbai', spots: 40, registered: 22, status: 'Published' },
  { id: 3, title: 'School Supplies Drive', category: 'Education', date: '2026-07-26', location: 'Dharavi School', spots: 25, registered: 10, status: 'Upcoming' },
];

const INIT_CAMPAIGNS = [
  { id: 1, title: 'City Hunger Alleviation Drive', category: 'Food Relief', goal: 100000, raised: 85000 },
  { id: 2, title: 'Rural School Supplies Kit', category: 'Education', goal: 50000, raised: 30000 },
  { id: 3, title: 'Coastal Ocean Preservation', category: 'Environment', goal: 40000, raised: 18000 },
];

const INIT_BENEFICIARIES = [
  { id: 1, name: 'Dharavi Primary Students Kit', category: 'Education Supplies', location: 'Mumbai', status: 'Assisted' },
  { id: 2, name: 'Coastal Fishermen Community', category: 'Disaster Relief', location: 'Versova', status: 'In Progress' },
  { id: 3, name: 'Andheri Food Bank', category: 'Food Support', location: 'Andheri', status: 'Assisted' },
];

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, ...style }}>{children}</div>;
}

function Modal({ title, onClose, onSubmit, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', width: 500, maxWidth: '92vw', borderRadius: 16, padding: 28, position: 'relative', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, color: C.muted, cursor: 'pointer' }}>✕</button>
        <h3 style={{ margin: '0 0 20px', fontSize: 17, color: C.navy }}>{title}</h3>
        <form onSubmit={onSubmit}>{children}<button type="submit" style={{ width: '100%', background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 8 }}>Save</button></form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      <input {...props} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }}/>
    </div>
  );
}

export default function AdminDashboard({ onBackToHome }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [adminName, setAdminName] = useState('Admin');
  const [adminEmail, setAdminEmail] = useState('admin@communitycare.org');
  const [volunteers, setVolunteers] = useState(INIT_VOLUNTEERS);
  const [events, setEvents] = useState(INIT_EVENTS);
  const [campaigns, setCampaigns] = useState(INIT_CAMPAIGNS);
  const [beneficiaries, setBeneficiaries] = useState(INIT_BENEFICIARIES);
  const [registrations, setRegistrations] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'));
      if (u?.name) setAdminName(u.name);
      if (u?.email) setAdminEmail(u.email);
    } catch (e) {}
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regRes, evRes] = await Promise.all([
        API.get('/registrations'),
        API.get('/events')
      ]);
      if (regRes.data?.data) setRegistrations(regRes.data.data);
      if (evRes.data?.data?.length > 0) setEvents(evRes.data.data.map(ev => ({
        id: ev._id, title: ev.title, category: ev.category,
        date: new Date(ev.date).toLocaleDateString('en-IN'),
        location: ev.location, spots: ev.spotsTotal,
        registered: ev.volunteersRegistered?.length || 0, status: ev.status
      })));
    } catch (e) {}
  };

  const handleApprove = async (id, status) => {
    try {
      await API.put(`/registrations/${id}/approve`, { status });
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch (e) { alert('Error updating registration'); }
  };

  const handleAttendance = async (id, hours) => {
    try {
      await API.put(`/registrations/${id}/attend`, { hoursLogged: hours });
      setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'Attended', hoursLogged: hours } : r));
      alert('Attendance marked and hours logged!');
    } catch (e) { alert('Error marking attendance'); }
  };

  const handleExportCSV = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('currentUser'))?.token;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/export/report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'community-care-report.csv'; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert('Export failed'); }
  };

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const createEvent = (e) => {
    e.preventDefault();
    setEvents(p => [...p, { id: Date.now(), ...form, spots: Number(form.spots) || 30, registered: 0, status: 'Upcoming' }]);
    setModal(null); setForm({});
  };

  const createCampaign = (e) => {
    e.preventDefault();
    setCampaigns(p => [...p, { id: Date.now(), ...form, goal: Number(form.goal), raised: 0 }]);
    setModal(null); setForm({});
  };

  const createBeneficiary = (e) => {
    e.preventDefault();
    setBeneficiaries(p => [...p, { id: Date.now(), ...form, status: 'Assisted' }]);
    setModal(null); setForm({});
  };

  const toggleVolunteer = (id) => setVolunteers(p => p.map(v => v.id === id ? { ...v, status: v.status === 'Active' ? 'Suspended' : 'Active' } : v));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter','Manrope',sans-serif", background: C.bg, overflow: 'hidden', width: '100%' }}>
      {/* Sidebar */}
      <aside style={{ width: 200, minWidth: 200, background: C.sidebar, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z"/></svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Community Care</span>
        </div>
        <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', padding: '0 20px 10px', textTransform: 'uppercase' }}>Administration</div>
          {NAV.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 20px', background: tab === item.key ? C.sidebarActive : 'none', border: 'none', color: tab === item.key ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 13.5, cursor: 'pointer', textAlign: 'left', borderRadius: tab === item.key ? '0 8px 8px 0' : 0, marginRight: tab === item.key ? 12 : 0 }}>
              <Icon d={item.icon} size={16} color={tab === item.key ? '#fff' : 'rgba(255,255,255,0.6)'}/>{item.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.green, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{adminName[0]}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminEmail}</div>
          </div>
          <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <Icon d={ICONS.logout} size={15} color="rgba(255,255,255,0.5)"/>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', overflowX: 'hidden', minWidth: 0, boxSizing: 'border-box' }}>
        {tab === 'overview' && <AdminOverview volunteers={volunteers} events={events} campaigns={campaigns} beneficiaries={beneficiaries} adminName={adminName} registrations={registrations}/>}
        {tab === 'volunteers' && <AdminVolunteers volunteers={volunteers} onToggle={toggleVolunteer}/>}
        {tab === 'events' && <AdminEvents events={events} onNew={() => { setForm({}); setModal('event'); }}/>}
        {tab === 'campaigns' && <AdminCampaigns campaigns={campaigns} onNew={() => { setForm({}); setModal('campaign'); }}/>}
        {tab === 'beneficiaries' && <AdminBeneficiaries beneficiaries={beneficiaries} onNew={() => { setForm({}); setModal('beneficiary'); }}/>}
        {tab === 'registrations' && <AdminRegistrations registrations={registrations} onApprove={handleApprove} onAttendance={handleAttendance}/>}
        {tab === 'reports' && <AdminReports volunteers={volunteers} events={events} campaigns={campaigns} onExport={handleExportCSV}/>}
      </main>

      {/* Modals */}
      {modal === 'event' && (
        <Modal title="Create New Event" onClose={() => setModal(null)} onSubmit={createEvent}>
          <Field label="Event Title" placeholder="e.g. Tree Plantation Drive" value={form.title||''} onChange={f('title')} required/>
          <Field label="Category" placeholder="Community / Environment / Education" value={form.category||''} onChange={f('category')} required/>
          <Field label="Date" type="date" value={form.date||''} onChange={f('date')} required/>
          <Field label="Location" placeholder="City / Area" value={form.location||''} onChange={f('location')} required/>
          <Field label="Total Spots" type="number" placeholder="30" value={form.spots||''} onChange={f('spots')}/>
        </Modal>
      )}
      {modal === 'campaign' && (
        <Modal title="Create Fundraising Campaign" onClose={() => setModal(null)} onSubmit={createCampaign}>
          <Field label="Campaign Title" placeholder="e.g. Clean Drinking Water Initiative" value={form.title||''} onChange={f('title')} required/>
          <Field label="Category" placeholder="Health / Education / Welfare" value={form.category||''} onChange={f('category')} required/>
          <Field label="Target Goal (₹)" type="number" placeholder="100000" value={form.goal||''} onChange={f('goal')} required/>
        </Modal>
      )}
      {modal === 'beneficiary' && (
        <Modal title="Add Beneficiary Record" onClose={() => setModal(null)} onSubmit={createBeneficiary}>
          <Field label="Beneficiary / Organization" placeholder="e.g. Sunshine Orphanage" value={form.name||''} onChange={f('name')} required/>
          <Field label="Assistance Category" placeholder="Food / Medical / Education" value={form.category||''} onChange={f('category')} required/>
          <Field label="Location" placeholder="District / City" value={form.location||''} onChange={f('location')} required/>
        </Modal>
      )}
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>{title}</h2>{sub && <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>{sub}</p>}</div>
      {action}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead><tr>{headers.map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', borderBottom: `1.5px solid ${C.border}`, background: '#f9fafb', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function Td({ children }) {
  return <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{children}</td>;
}

function Badge({ label, color = 'green' }) {
  const colors = {
    green: { bg: C.greenLight, text: C.green },
    yellow: { bg: '#fef3c7', text: '#d97706' },
    red: { bg: '#fee2e2', text: '#dc2626' },
    blue: { bg: '#eff6ff', text: '#3b82f6' },
  };
  const col = colors[color] || colors.green;
  return <span style={{ background: col.bg, color: col.text, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'inline-block' }}>{label}</span>;
}

function ActionBtn({ label, color, onClick }) {
  return <button onClick={onClick} style={{ padding: '6px 14px', border: `1.5px solid ${color || C.border}`, background: '#fff', color: color || C.text, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{label}</button>;
}

function AdminOverview({ volunteers, events, campaigns, beneficiaries, adminName }) {
  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const stats = [
    { label: 'Total Volunteers', value: (volunteers.length + 12400).toLocaleString() + '+', badge: '+12 this week', icon: ICONS.volunteers },
    { label: 'Events Organized', value: (events.length + 840).toLocaleString(), badge: '+3 this month', icon: ICONS.events },
    { label: 'Total Donations', value: `₹${(totalRaised / 100000).toFixed(1)}L+`, badge: '+₹40K today', icon: ICONS.campaigns },
    { label: 'Beneficiaries', value: (beneficiaries.length + 1250).toLocaleString() + '+', badge: '+8 this week', icon: ICONS.beneficiaries },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.navy }}>Good morning, {adminName.split(' ')[0]} 👋</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Here's your platform overview for today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon d={s.icon} size={18} color={C.green}/></div>
              <span style={{ background: C.greenLight, color: C.green, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{s.badge}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <Card style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Pending Approvals</div>
          {volunteers.filter(v => v.status === 'Pending').map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.greenLight, color: C.green, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{v.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{v.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>Volunteer Registration</div>
              </div>
              <Badge label="Pending" color="yellow"/>
            </div>
          ))}
          {volunteers.filter(v => v.status === 'Pending').length === 0 && <p style={{ color: C.muted, fontSize: 13 }}>No pending approvals.</p>}
        </Card>

        <Card style={{ marginBottom: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Recent Activity</div>
          {[
            { text: 'City Food Drive — 18 volunteers registered', time: '2h ago', icon: ICONS.events },
            { text: 'Donation ₹5,000 received for School Supplies', time: 'Yesterday', icon: ICONS.campaigns },
            { text: 'Ishaan Kapoor logged 4 volunteer hours', time: 'Jul 8', icon: ICONS.clock },
            { text: 'New volunteer: Rohan Mehta registered', time: 'Jul 7', icon: ICONS.volunteers },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 3 ? 14 : 0 }}>
              <div style={{ width: 28, height: 28, background: C.greenLight, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon d={a.icon} size={13} color={C.green}/></div>
              <div style={{ flex: 1, fontSize: 12.5, color: C.text }}>{a.text}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{a.time}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AdminVolunteers({ volunteers, onToggle }) {
  return (
    <div>
      <SectionHeader title="Manage Volunteers" sub="Review volunteer profiles, hours, and status."/>
      <Card>
        <Table
          headers={['Volunteer', 'Email', 'Hours', 'Events', 'Status', 'Actions']}
          rows={volunteers.map(v => (
            <tr key={v.id}>
              <Td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: '50%', background: C.greenLight, color: C.green, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{v.name[0]}</div><div><div style={{ fontWeight: 600 }}>{v.name}</div><div style={{ fontSize: 11.5, color: C.muted }}>{v.phone}</div></div></div></Td>
              <Td><span style={{ color: C.muted }}>{v.email}</span></Td>
              <Td><strong>{v.hours} hrs</strong></Td>
              <Td>{v.events}</Td>
              <Td><Badge label={v.status} color={v.status === 'Active' ? 'green' : v.status === 'Pending' ? 'yellow' : 'red'}/></Td>
              <Td><ActionBtn label={v.status === 'Active' ? 'Suspend' : 'Activate'} color={v.status === 'Active' ? '#dc2626' : C.green} onClick={() => onToggle(v.id)}/></Td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

function AdminEvents({ events, onNew }) {
  return (
    <div>
      <SectionHeader title="Manage Events" sub="Create, edit and monitor community drives."
        action={<button onClick={onNew} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icon d={ICONS.plus} size={16} color="#fff"/> Create Event</button>}
      />
      <Card>
        <Table
          headers={['Event', 'Category', 'Date', 'Location', 'Registered', 'Status']}
          rows={events.map(ev => (
            <tr key={ev.id}>
              <Td><strong>{ev.title}</strong></Td>
              <Td>{ev.category}</Td>
              <Td>{ev.date}</Td>
              <Td>{ev.location}</Td>
              <Td>{ev.registered} / {ev.spots}</Td>
              <Td><Badge label={ev.status} color={ev.status === 'Published' ? 'green' : 'blue'}/></Td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

function AdminCampaigns({ campaigns, onNew }) {
  return (
    <div>
      <SectionHeader title="Manage Campaigns" sub="Create and monitor fundraising campaigns."
        action={<button onClick={onNew} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icon d={ICONS.plus} size={16} color="#fff"/> New Campaign</button>}
      />
      <Card>
        <Table
          headers={['Campaign', 'Category', 'Goal', 'Raised', 'Progress']}
          rows={campaigns.map(c => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <tr key={c.id}>
                <Td><strong>{c.title}</strong></Td>
                <Td>{c.category}</Td>
                <Td>₹{c.goal.toLocaleString()}</Td>
                <Td><strong style={{ color: C.green }}>₹{c.raised.toLocaleString()}</strong></Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, background: C.border, borderRadius: 99, height: 6 }}><div style={{ background: C.green, borderRadius: 99, height: '100%', width: `${pct}%` }}/></div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.navy, minWidth: 36 }}>{pct}%</span>
                  </div>
                </Td>
              </tr>
            );
          })}
        />
      </Card>
    </div>
  );
}

function AdminBeneficiaries({ beneficiaries, onNew }) {
  return (
    <div>
      <SectionHeader title="Beneficiary Records" sub="Confidential records of supported individuals and groups."
        action={<button onClick={onNew} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Icon d={ICONS.plus} size={16} color="#fff"/> Add Beneficiary</button>}
      />
      <Card>
        <Table
          headers={['Name / Group', 'Assistance Type', 'Location', 'Status']}
          rows={beneficiaries.map(b => (
            <tr key={b.id}>
              <Td><strong>{b.name}</strong></Td>
              <Td>{b.category}</Td>
              <Td>{b.location}</Td>
              <Td><Badge label={b.status} color={b.status === 'Assisted' ? 'green' : 'yellow'}/></Td>
            </tr>
          ))}
        />
      </Card>
    </div>
  );
}

function AdminReports({ volunteers, events, campaigns, onExport }) {
  const totalHours = volunteers.reduce((s, v) => s + v.hours, 0);
  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  return (
    <div>
      <SectionHeader title="Reports & Analytics" sub="Export operational summaries and impact reports."
        action={<button onClick={onExport} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', border: `1.5px solid ${C.border}`, background: '#fff', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', color: C.text }}><Icon d={ICONS.download} size={16} color={C.muted}/> Export CSV</button>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[{ label: 'Total Volunteer Hours', value: totalHours + ' hrs' }, { label: 'Events Organized', value: events.length }, { label: 'Total Raised', value: `₹${totalRaised.toLocaleString()}` }, { label: 'Active Campaigns', value: campaigns.length }].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <Card>
        <h3 style={{ margin: '0 0 12px', fontSize: 15, color: C.navy }}>Quarterly Impact Summary</h3>
        <p style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
          Over this quarter, Community Care Portal mobilized <strong>12,400+ volunteers</strong> across <strong>840 events</strong>, raising over <strong>₹2.3 Crores</strong> for verified humanitarian programs. <strong>1,250+ beneficiaries</strong> received direct assistance.
        </p>
        <button style={{ marginTop: 16, background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Download Full Report (PDF)</button>
      </Card>
    </div>
  );
}

function AdminRegistrations({ registrations, onApprove, onAttendance }) {
  const [hoursInput, setHoursInput] = useState({});

  return (
    <div>
      <SectionHeader title="Volunteer Registrations" sub="Approve, reject or mark attendance for volunteer event registrations."/>
      <Card>
        {registrations.length === 0 ? (
          <p style={{ color: C.muted, fontSize: 13 }}>No registrations yet.</p>
        ) : (
          <Table
            headers={['Volunteer', 'Event', 'Registered On', 'Status', 'Actions']}
            rows={registrations.map((r, i) => (
              <tr key={r._id || i}>
                <Td><strong>{r.volunteerName}</strong><div style={{ fontSize: 11.5, color: C.muted }}>{r.volunteerEmail}</div></Td>
                <Td>{r.eventTitle}</Td>
                <Td>{new Date(r.createdAt).toLocaleDateString('en-IN')}</Td>
                <Td>
                  <Badge
                    label={r.status}
                    color={r.status === 'Approved' || r.status === 'Attended' ? 'green' : r.status === 'Rejected' ? 'red' : 'yellow'}
                  />
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    {r.status === 'Pending' && (
                      <>
                        <ActionBtn label="Approve" color={C.green} onClick={() => onApprove(r._id, 'Approved')}/>
                        <ActionBtn label="Reject" color="#dc2626" onClick={() => onApprove(r._id, 'Rejected')}/>
                      </>
                    )}
                    {r.status === 'Approved' && (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          type="number"
                          placeholder="hrs"
                          min="0.5"
                          value={hoursInput[r._id] || ''}
                          onChange={e => setHoursInput(p => ({ ...p, [r._id]: e.target.value }))}
                          style={{ width: 60, padding: '5px 8px', border: `1.5px solid ${C.border}`, borderRadius: 6, fontSize: 12 }}
                        />
                        <ActionBtn label="Mark Attended" color={C.green} onClick={() => onAttendance(r._id, Number(hoursInput[r._id]) || 0)}/>
                      </div>
                    )}
                    {r.status === 'Attended' && (
                      <span style={{ fontSize: 12, color: C.muted }}>{r.hoursLogged} hrs logged</span>
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          />
        )}
      </Card>
    </div>
  );
}
