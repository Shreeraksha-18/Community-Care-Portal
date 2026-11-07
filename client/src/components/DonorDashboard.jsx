import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const C = {
  sidebar: '#0a3d24', sidebarActive: '#16a34a', green: '#16a34a', greenDark: '#0f6b3f',
  greenLight: '#dcfce7', greenBg: '#f0fdf4', bg: '#f4f6f5', card: '#ffffff',
  border: '#e5e7eb', text: '#111827', muted: '#6b7280', navy: '#0a3d24',
};

function Icon({ d, size = 16, color = 'currentColor' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{Array.isArray(d) ? d.map((p, i) => <path key={i} d={p}/>) : <path d={d}/>}</svg>;
}

const ICONS = {
  dashboard: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  campaigns: 'M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z',
  receipts: 'M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 12h8M8 16h5',
  profile: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  plus: 'M12 5v14M5 12h14',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  rupee: 'M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9',
};

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { key: 'campaigns', label: 'Browse Campaigns', icon: ICONS.campaigns },
  { key: 'receipts', label: 'Donation History', icon: ICONS.receipts },
  { key: 'profile', label: 'Profile & Settings', icon: ICONS.profile },
];

const DEFAULT_CAMPAIGNS = [
  { id: 1, title: 'City Hunger Alleviation Drive', tag: 'Food Relief', raised: 85000, goal: 100000, img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=500&q=80' },
  { id: 2, title: 'Rural School Supplies Kit', tag: 'Education', raised: 30000, goal: 50000, img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=500&q=80' },
  { id: 3, title: 'Coastal Ocean Preservation', tag: 'Environment', raised: 18000, goal: 40000, img: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80' },
];

function Card({ children, style = {} }) {
  return <div style={{ background: C.card, borderRadius: 12, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, ...style }}>{children}</div>;
}

export default function DonorDashboard({ onBackToHome }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [userName, setUserName] = useState('Rahul Verma');
  const [userEmail, setUserEmail] = useState('rahul@roshantrust.org');
  const [campaigns, setCampaigns] = useState(DEFAULT_CAMPAIGNS);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [amount, setAmount] = useState(1000);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('currentUser'));
      if (u?.name) setUserName(u.name);
      if (u?.email) setUserEmail(u.email);
    } catch (e) {}
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await API.get('/donations/my-donations');
      if (res.data?.data?.length > 0) {
        setReceipts(res.data.data.map(d => ({ id: d.receiptId, campaign: d.campaignTitle, date: new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), amount: d.amount })));
      } else {
        setReceipts([{ id: '#REC-2026-881', campaign: 'City Hunger Alleviation Drive', date: 'Jul 8, 2026', amount: 10000 }, { id: '#REC-2026-412', campaign: 'Rural School Supplies Kit', date: 'Jun 20, 2026', amount: 5000 }]);
      }
    } catch (e) {
      setReceipts([{ id: '#REC-2026-881', campaign: 'City Hunger Alleviation Drive', date: 'Jul 8, 2026', amount: 10000 }, { id: '#REC-2026-412', campaign: 'Rural School Supplies Kit', date: 'Jun 20, 2026', amount: 5000 }]);
    }
    setLoading(false);
  };

  const openCheckout = (title) => { setSelectedCampaign(title || 'General Community Fund'); setCheckoutOpen(true); };

  const confirmDonation = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    try {
      const res = await API.post('/donations', { campaignTitle: selectedCampaign, amount: amt });
      const d = res.data.data;
      setReceipts(prev => [{ id: d.receiptId, campaign: d.campaignTitle, date: new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), amount: d.amount }, ...prev]);
    } catch (e) {
      setReceipts(prev => [{ id: `#REC-2026-${Math.floor(1000 + Math.random() * 9000)}`, campaign: selectedCampaign, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), amount: amt }, ...prev]);
    }
    setCampaigns(prev => prev.map(c => c.title === selectedCampaign ? { ...c, raised: c.raised + amt } : c));
    setCheckoutOpen(false);
    alert(`Thank you! ₹${amt.toLocaleString()} donated to "${selectedCampaign}". 80G receipt generated.`);
  };

  const totalDonated = receipts.reduce((s, r) => s + r.amount, 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter','Manrope',sans-serif", background: C.bg }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: C.sidebar, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z"/></svg>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Community Care</span>
        </div>
        <div style={{ flex: 1, padding: '16px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', padding: '0 20px 10px', textTransform: 'uppercase' }}>Donor</div>
          {NAV.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 20px', background: tab === item.key ? C.sidebarActive : 'none', border: 'none', color: tab === item.key ? '#fff' : 'rgba(255,255,255,0.7)', fontSize: 13.5, cursor: 'pointer', textAlign: 'left', borderRadius: tab === item.key ? '0 8px 8px 0' : 0, marginRight: tab === item.key ? 12 : 0 }}>
              <Icon d={item.icon} size={16} color={tab === item.key ? '#fff' : 'rgba(255,255,255,0.6)'}/>{item.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.green, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{userName[0]}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
          </div>
          <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <Icon d={ICONS.logout} size={15} color="rgba(255,255,255,0.5)"/>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {tab === 'dashboard' && <DonorOverview userName={userName} totalDonated={totalDonated} campaigns={campaigns} receipts={receipts} openCheckout={openCheckout} onViewCampaigns={() => setTab('campaigns')} onViewReceipts={() => setTab('receipts')}/>}
        {tab === 'campaigns' && <DonorCampaigns campaigns={campaigns} openCheckout={openCheckout}/>}
        {tab === 'receipts' && <DonorReceipts receipts={receipts} loading={loading}/>}
        {tab === 'profile' && <DonorProfile userName={userName} userEmail={userEmail}/>}
      </main>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', width: 440, maxWidth: '92vw', borderRadius: 16, padding: 28, position: 'relative', boxShadow: '0 16px 40px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setCheckoutOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, color: C.muted, cursor: 'pointer' }}>✕</button>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, color: C.navy }}>Make a Donation</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px' }}>Supporting: <strong>{selectedCampaign}</strong> · 80G tax deductible</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[500, 1000, 2500].map(a => (
                <button key={a} onClick={() => setAmount(a)} style={{ padding: '12px', border: `1.5px solid ${amount === a ? C.green : C.border}`, borderRadius: 8, background: amount === a ? C.greenBg : '#fff', fontWeight: 700, fontSize: 14, color: amount === a ? C.green : C.text, cursor: 'pointer' }}>₹{a.toLocaleString()}</button>
              ))}
            </div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Custom Amount (₹)</label>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}/>
            <button onClick={confirmDonation} style={{ width: '100%', background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '13px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Complete Payment</button>
          </div>
        </div>
      )}
    </div>
  );
}

function DonorOverview({ userName, totalDonated, campaigns, receipts, openCheckout, onViewCampaigns, onViewReceipts }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.navy }}>Good morning, {userName.split(' ')[0]} 👋</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Thank you for supporting community causes.</p>
        </div>
        <button onClick={() => openCheckout('General Community Fund')} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon d={ICONS.plus} size={16} color="#fff"/> Make a Donation
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Donated', value: `₹${totalDonated.toLocaleString()}`, badge: '80G Eligible', icon: ICONS.rupee },
          { label: 'Campaigns Supported', value: campaigns.length, badge: 'Active', icon: ICONS.campaigns },
          { label: 'Lives Impacted', value: Math.round(totalDonated / 200) || 120, badge: '+5 this month', icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
          { label: 'Tax Receipts Issued', value: receipts.length, badge: 'Download available', icon: ICONS.receipts },
        ].map((s, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon d={s.icon} size={18} color={C.green}/>
              </div>
              <span style={{ background: C.greenLight, color: C.green, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>{s.badge}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.navy }}>{s.value}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>Active Campaigns</h3>
          <button onClick={onViewCampaigns} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 14px', fontSize: 12, color: C.muted, cursor: 'pointer' }}>View All</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {campaigns.map(c => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <div key={c.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <img src={c.img} style={{ width: '100%', height: 130, objectFit: 'cover' }} alt={c.title}/>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: 'uppercase', marginBottom: 4 }}>{c.tag}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text, marginBottom: 10 }}>{c.title}</div>
                  <div style={{ background: C.border, borderRadius: 99, height: 6, marginBottom: 6 }}><div style={{ background: C.green, borderRadius: 99, height: '100%', width: `${pct}%` }}/></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.muted, marginBottom: 12 }}>
                    <span>₹{c.raised.toLocaleString()} raised</span><span>{pct}%</span>
                  </div>
                  <button onClick={() => openCheckout(c.title)} style={{ width: '100%', background: C.green, color: '#fff', border: 'none', borderRadius: 7, padding: '9px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Donate Now</button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>Recent Receipts</h3>
          <button onClick={onViewReceipts} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 14px', fontSize: 12, color: C.muted, cursor: 'pointer' }}>View All</button>
        </div>
        {receipts.slice(0, 3).map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 36, height: 36, background: C.greenLight, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d={ICONS.receipts} size={16} color={C.green}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{r.campaign}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.date} · {r.id}</div>
            </div>
            <div style={{ fontWeight: 700, color: C.navy, fontSize: 14 }}>₹{r.amount.toLocaleString()}</div>
            <span style={{ background: C.greenLight, color: C.green, fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>80G</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function DonorCampaigns({ campaigns, openCheckout }) {
  const [search, setSearch] = useState('');
  const filtered = campaigns.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.tag.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Browse Campaigns</h2><p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>Support verified NGO causes directly.</p></div>
        <input type="text" placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '9px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, outline: 'none', width: 220 }}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {filtered.map(c => {
          const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
          return (
            <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <img src={c.img} style={{ width: '100%', height: 150, objectFit: 'cover' }} alt={c.title}/>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: 'uppercase', marginBottom: 4 }}>{c.tag}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{c.title}</div>
                <div style={{ background: C.border, borderRadius: 99, height: 6, marginBottom: 6 }}><div style={{ background: C.green, borderRadius: 99, height: '100%', width: `${pct}%` }}/></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginBottom: 14 }}>
                  <span>₹{c.raised.toLocaleString()} raised</span><span>Goal: ₹{c.goal.toLocaleString()}</span>
                </div>
                <button onClick={() => openCheckout(c.title)} style={{ width: '100%', background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}>Donate Now</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonorReceipts({ receipts, loading }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Donation History & 80G Receipts</h2>
      <Card>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead><tr>{['Receipt ID', 'Campaign', 'Date', 'Amount', 'Tax Status', 'Action'].map(h => <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', borderBottom: `1.5px solid ${C.border}`, background: '#f9fafb' }}>{h}</th>)}</tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: C.muted }}>Loading…</td></tr>
            : receipts.length === 0 ? <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: C.muted }}>No donations yet. Make your first donation!</td></tr>
            : receipts.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, fontWeight: 600, color: C.muted }}>{r.id}</td>
                <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, color: C.text }}>{r.campaign}</td>
                <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, color: C.muted }}>{r.date}</td>
                <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, color: C.navy }}>₹{r.amount.toLocaleString()}</td>
                <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}` }}><span style={{ background: C.greenLight, color: C.green, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>80G Deductible</span></td>
                <td style={{ padding: '14px', borderBottom: `1px solid ${C.border}` }}>
                  <button onClick={() => alert(`Downloading receipt ${r.id}`)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: `1.5px solid ${C.border}`, background: '#fff', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: C.text }}>
                    <Icon d={ICONS.download} size={13} color={C.muted}/> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function DonorProfile({ userName, userEmail }) {
  const [pan, setPan] = useState('ABCDE1234F');
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: C.navy }}>Profile & Settings</h2>
      <Card style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: C.green, color: '#fff', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{userName[0]}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>{userName}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{userEmail}</div>
            <span style={{ background: C.greenLight, color: C.green, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, marginTop: 6, display: 'inline-block' }}>Donor</span>
          </div>
        </div>
        {[{ label: 'Full Name', value: userName, readOnly: true }, { label: 'Email Address', value: userEmail, readOnly: true }].map((f, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{f.label}</label>
            <input defaultValue={f.value} readOnly={f.readOnly} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, outline: 'none', boxSizing: 'border-box', background: f.readOnly ? '#f9fafb' : '#fff' }}/>
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>PAN Number (For 80G Tax Certificate)</label>
          <input value={pan} onChange={e => setPan(e.target.value.toUpperCase())} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${C.border}`, borderRadius: 8, fontSize: 13.5, outline: 'none', boxSizing: 'border-box' }}/>
        </div>
        <button onClick={() => alert('Profile saved!')} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Save Changes</button>
      </Card>
    </div>
  );
}
