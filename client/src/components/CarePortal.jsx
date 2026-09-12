import React from 'react';

const BRAND_NAVY = '#0a3d24';
const ACCENT_GREEN = '#16995a';
const LIGHT_BG = '#f4f7f6';

const NOTICES = [
  {
    title: 'City Food Drive Volunteers Needed',
    meta: 'Seva NGO  •  July 12, 2026'
  },
  {
    title: 'Coastal Cleanup Campaign Registration Open',
    meta: 'EcoCare  •  July 19, 2026'
  }
];

const ACTIVITIES = [
  {
    title: 'Log Hours: City Center Food Distribution',
    meta: 'Community Support  •  Logged July 10, 2026',
    status: 'Approved'
  },
  {
    title: 'School Supplies Drive Onboarding',
    meta: 'Education Drive  •  Due July 25, 2026',
    status: 'Pending'
  }
];

const GOAL_TRACKER = [
  { activity: 'Monthly Volunteer Goal', completed: 14, target: 20 },
  { activity: 'Community Events Attended', completed: 5, target: 6 },
  { activity: 'Impact Target (Lives Touched)', completed: 48, target: 50 }
];

const PROFILE = {
  name: 'Priya Sharma',
  organization: 'Community Care Volunteers',
  role: 'Senior Volunteer',
  status: 'Active Volunteer'
};

const TABS = [
  { id: 'notices', label: 'Notices & Drives' },
  { id: 'activities', label: 'Activities & Hours' },
  { id: 'goals', label: 'Track Goals' },
  { id: 'profile', label: 'Volunteer Profile' }
];

export default function CarePortal({ volunteerName = 'Priya Sharma', onBack }) {
  const [activeTab, setActiveTab] = React.useState('notices');

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>💚 Community Care Portal</h1>
          <p style={styles.headerSubtitle}>Welcome back, {volunteerName}</p>
        </div>

        {onBack && (
          <button style={styles.backBtn} onClick={onBack}>
            Back to Main View
          </button>
        )}
      </div>

      <div style={styles.tabRow}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabBtn,
              ...(activeTab === tab.id ? styles.tabBtnActive : {})
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {activeTab === 'notices' && <NoticesTab />}
        {activeTab === 'activities' && <ActivitiesTab />}
        {activeTab === 'goals' && <GoalsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>
    </div>
  );
}

function NoticesTab() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📣 Community Notices & Volunteering Drives</h2>

      {NOTICES.map((item, i) => (
        <div key={i} style={styles.row}>
          <div>
            <div style={styles.rowTitle}>{item.title}</div>
            <div style={styles.rowMeta}>{item.meta}</div>
          </div>
          <button style={styles.darkBtn}>View Details</button>
        </div>
      ))}
    </div>
  );
}

function ActivitiesTab() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📄 Activity & Hours Submissions</h2>

      {ACTIVITIES.map((item, i) => (
        <div key={i} style={styles.row}>
          <div>
            <div style={styles.rowTitle}>{item.title}</div>
            <div style={styles.rowMeta}>{item.meta}</div>
          </div>
          <span
            style={{
              ...styles.badge,
              backgroundColor: item.status === 'Pending' ? '#f5a524' : '#0f6b3f',
              color: item.status === 'Pending' ? BRAND_NAVY : '#ffffff'
            }}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function GoalsTab() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>📊 Track Volunteer Goals</h2>

      {GOAL_TRACKER.map((item, i) => {
        const pct = Math.min(100, Math.round((item.completed / item.target) * 100));
        const onTrack = pct >= 70;

        return (
          <div key={i} style={styles.attendanceRow}>
            <div style={styles.attendanceHead}>
              <span style={styles.rowTitle}>{item.activity}</span>
              <span style={{ fontWeight: 700, color: onTrack ? '#0f6b3f' : '#e07a1f' }}>
                {pct}%
              </span>
            </div>

            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${pct}%`,
                  backgroundColor: onTrack ? '#16995a' : '#e07a1f'
                }}
              />
            </div>

            <div style={styles.rowMeta}>
              {item.completed} / {item.target} target achieved
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProfileTab() {
  return (
    <div>
      <h2 style={styles.sectionTitle}>👤 Volunteer Profile</h2>

      <div style={styles.profileGrid}>
        <ProfileField label="Name" value={PROFILE.name} />
        <ProfileField label="Organization" value={PROFILE.organization} />
        <ProfileField label="Role" value={PROFILE.role} />
        <ProfileField label="Status" value={PROFILE.status} />
      </div>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div style={styles.profileField}>
      <div style={styles.profileLabel}>{label}</div>
      <div style={styles.profileValue}>{value}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: '850px',
    margin: '30px auto',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
  },
  header: {
    backgroundColor: BRAND_NAVY,
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  headerTitle: {
    color: ACCENT_GREEN,
    margin: 0,
    fontSize: '22px',
    letterSpacing: '0.5px'
  },
  headerSubtitle: {
    color: '#ffffff',
    margin: '4px 0 0 0',
    fontSize: '13px',
    opacity: 0.9
  },
  backBtn: {
    backgroundColor: ACCENT_GREEN,
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    fontWeight: 700,
    fontSize: '13px',
    cursor: 'pointer'
  },
  tabRow: {
    display: 'flex',
    backgroundColor: '#e3f5ea',
    overflowX: 'auto'
  },
  tabBtn: {
    flex: 1,
    minWidth: '140px',
    padding: '14px 10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#0f6b3f',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    borderBottom: '3px solid transparent'
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    color: BRAND_NAVY,
    borderBottom: `3px solid ${ACCENT_GREEN}`,
    fontWeight: 700
  },
  content: {
    backgroundColor: '#ffffff',
    padding: '26px'
  },
  sectionTitle: {
    color: BRAND_NAVY,
    fontSize: '18px',
    marginBottom: '18px'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    borderBottom: '1px solid #eef1f5',
    gap: '12px'
  },
  rowTitle: {
    fontWeight: 700,
    color: '#101828',
    fontSize: '14.5px'
  },
  rowMeta: {
    fontSize: '12.5px',
    color: '#667085',
    marginTop: '4px'
  },
  darkBtn: {
    backgroundColor: BRAND_NAVY,
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '9px 16px',
    fontSize: '12.5px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  badge: {
    padding: '7px 14px',
    borderRadius: '6px',
    fontSize: '12.5px',
    fontWeight: 700,
    whiteSpace: 'nowrap'
  },
  attendanceRow: {
    padding: '14px 0',
    borderBottom: '1px solid #eef1f5'
  },
  attendanceHead: {
    display: 'flex',
    justify.content: 'space-between',
    marginBottom: '8px'
  },
  progressTrack: {
    height: '8px',
    borderRadius: '4px',
    backgroundColor: '#eaecf0',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px'
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px'
  },
  profileField: {
    backgroundColor: LIGHT_BG,
    borderRadius: '8px',
    padding: '14px 16px',
    borderLeft: `4px solid ${ACCENT_GREEN}`
  },
  profileLabel: {
    fontSize: '11.5px',
    color: '#667085',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    marginBottom: '4px'
  },
  profileValue: {
    fontSize: '14px',
    color: BRAND_NAVY,
    fontWeight: 600
  }
};
