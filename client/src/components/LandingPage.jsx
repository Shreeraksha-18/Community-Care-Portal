import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passStrength, setPassStrength] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeSidebar(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  const openSidebar = (mode) => {
    setAuthMode(mode);
    setSidebarOpen(true);
    setErrorMsg('');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const handlePassInput = (val) => {
    let score = 0;
    if (val.length >= 6) score = 1;
    if (val.length >= 8 && /[A-Z]/.test(val)) score = 2;
    if (val.length >= 8 && /[0-9]/.test(val)) score = 3;
    if (val.length >= 10 && /[^A-Za-z0-9]/.test(val)) score = 4;
    setPassStrength(score);
  };

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, [field]: val }));
    if (field === 'password') handlePassInput(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    try {
      let res;
      if (authMode === 'signin') {
        res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
      } else {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName || 'User',
            email: formData.email,
            password: formData.password,
            role,
            phone: formData.phone
          })
        });
      }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Authentication failed');
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      const userRole = data.data.role || role;
      if (userRole === 'donor') navigate('/donor');
      else if (userRole === 'admin') navigate('/admin');
      else navigate('/volunteer');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthLabel = passStrength <= 1 ? 'Weak' : passStrength <= 2 ? 'Medium' : 'Strong';

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className={navScrolled ? 'nav scrolled' : 'nav'} id="nav">
        <div className="nav-inner">
          <a href="#" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="28" height="28">
                <rect x="1" y="1" width="30" height="30" rx="9" fill="currentColor" />
                <path d="M16 22.5c-4.4-2.7-7.5-5.6-7.5-9.3a5 5 0 0 1 7.5-4.3 5 5 0 0 1 7.5 4.3c0 3.7-3.1 6.6-7.5 9.3Z" fill="#fff" />
              </svg>
            </span>
            Community Care Portal
          </a>

          <nav className={mobileNavOpen ? 'nav-links open' : 'nav-links'} id="navLinks">
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#volunteer">Volunteer</a>
            <a href="#impact">Impact</a>
          </nav>

          <div className="nav-actions">
            <button
              className="nav-signin"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}
              onClick={() => openSidebar('signin')}
            >
              Sign in
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openSidebar('signup')}
            >
              Get Started
            </button>
          </div>

          <button
            className={mobileNavOpen ? 'nav-toggle open' : 'nav-toggle'}
            id="navToggle"
            aria-label="Toggle menu"
            onClick={() => setMobileNavOpen(o => !o)}
          >
            <span></span>
          </button>
        </div>
      </header>

      <main>
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="badge">
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <path d="M8 1 9.8 5.6 14.8 6 11 9.2l1.1 5-4.1-2.5L4 14.2l1.1-5L1.2 6l5-.4Z" fill="currentColor" />
                </svg>
                Trusted by 500+ NGOs worldwide
              </span>
              <h1>One Platform for<br /><span className="text-accent">Every Good Cause</span></h1>
              <p className="hero-sub">
                Manage volunteers, coordinate events, track donations, and measure your impact —
                all from a single, transparent platform built for NGOs.
              </p>
              <div className="hero-cta">
                <button className="btn btn-primary btn-lg" onClick={() => openSidebar('signup')}>
                  Get Started
                </button>
              </div>
              <div className="hero-proof">
                <div className="avatar-stack">
                  <span className="avatar a1"></span>
                  <span className="avatar a2"></span>
                  <span className="avatar a3"></span>
                  <span className="avatar a4"></span>
                </div>
                <p>Join 12,000+ volunteers already using the platform</p>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-photo">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
                  alt="Volunteers packing donation boxes together"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS ===== */}
        <section className="stats">
          <div className="stats-inner">
            <div className="stat">
              <span className="stat-num">12,400+</span>
              <span className="stat-label">Registered Volunteers</span>
            </div>
            <div className="stat">
              <span className="stat-num">840+</span>
              <span className="stat-label">Events Organized</span>
            </div>
            <div className="stat">
              <span className="stat-num">₹2.3 Cr+</span>
              <span className="stat-label">Donations Processed</span>
            </div>
            <div className="stat">
              <span className="stat-num">200+</span>
              <span className="stat-label">Partner NGOs</span>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section className="features" id="about">
          <div className="section-head">
            <p className="eyebrow">Platform features</p>
            <h2>Everything your NGO needs</h2>
            <p className="section-sub">Replace scattered spreadsheets and WhatsApp groups with a purpose-built tool that keeps your entire operation in sync.</p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Volunteer Management</h3>
              <p>Register and track volunteers, assign roles, and maintain complete attendance history, all in one place.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Event Coordination</h3>
              <p>Plan, publish, and manage community events. Automate registrations and send reminders automatically.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </div>
              <h3>Donation Tracking</h3>
              <p>Run fundraising campaigns, accept payments securely, and issue instant digital receipts to every donor.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Beneficiary Records</h3>
              <p>Maintain confidential, access-controlled records of the individuals and families your NGO supports.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Smart Notifications</h3>
              <p>Keep volunteers and donors in the loop with automated emails and in-app alerts for every milestone.</p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M4 20V10m6 10V4m6 16v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Reports &amp; Analytics</h3>
              <p>Visualize impact with real-time dashboards covering volunteer hours, funds raised, and much more.</p>
            </article>
          </div>
        </section>

        {/* ===== EVENTS ===== */}
        <section className="events" id="events">
          <div className="events-head">
            <div>
              <p className="eyebrow">Upcoming events</p>
              <h2>Make a difference this month</h2>
            </div>
            <button
              className="view-all"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
              onClick={() => openSidebar('signup')}
            >
              View all events →
            </button>
          </div>

          <div className="event-grid">
            <article className="event-card">
              <div className="event-photo photo-1">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80" alt="City Food Drive" className="event-bg-img" />
                <span className="event-tag">Community</span>
                <span className="event-spots">12 spots left</span>
              </div>
              <div className="event-body">
                <h3>City Food Drive</h3>
                <p className="event-meta">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {' '}July 12, 2026
                </p>
                <p className="event-meta">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {' '}City Center, Mumbai
                </p>
                <button className="btn btn-primary btn-block" onClick={() => openSidebar('signup')}>Register Now</button>
              </div>
            </article>

            <article className="event-card">
              <div className="event-photo photo-2">
                <img src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80" alt="Coastal Cleanup Campaign" className="event-bg-img" />
                <span className="event-tag">Environment</span>
                <span className="event-spots">18 spots left</span>
              </div>
              <div className="event-body">
                <h3>Coastal Cleanup Campaign</h3>
                <p className="event-meta">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {' '}July 19, 2026
                </p>
                <p className="event-meta">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {' '}Juhu Beach, Mumbai
                </p>
                <button className="btn btn-primary btn-block" onClick={() => openSidebar('signup')}>Register Now</button>
              </div>
            </article>

            <article className="event-card">
              <div className="event-photo photo-3">
                <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80" alt="School Supplies Distribution" className="event-bg-img" />
                <span className="event-tag">Education</span>
                <span className="event-spots">30 spots left</span>
              </div>
              <div className="event-body">
                <h3>School Supplies Distribution</h3>
                <p className="event-meta">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {' '}July 26, 2026
                </p>
                <p className="event-meta">
                  <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {' '}Government School, Andheri
                </p>
                <button className="btn btn-primary btn-block" onClick={() => openSidebar('signup')}>Register Now</button>
              </div>
            </article>
          </div>
        </section>

        {/* ===== ROLES ===== */}
        <section className="roles" id="volunteer">
          <div className="section-head">
            <p className="eyebrow">Built for everyone</p>
            <h2>Three roles, one unified platform</h2>
          </div>

          <div className="role-grid">
            <div className="role-card">
              <div className="role-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Volunteer</h3>
              <ul className="role-list">
                <li>Sign up &amp; complete your profile</li>
                <li>Browse and register for events</li>
                <li>Log hours and track your impact</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z" fill="none" stroke="#fff" strokeWidth="1.8" />
                </svg>
              </div>
              <h3>Donor</h3>
              <ul className="role-list">
                <li>Explore active campaigns</li>
                <li>Donate securely online</li>
                <li>Receive instant tax receipts</li>
              </ul>
            </div>

            <div className="role-card">
              <div className="role-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="#fff" strokeWidth="1.8" />
                  <path d="M7 9h10M7 13h10M7 17h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Admin</h3>
              <ul className="role-list">
                <li>Manage volunteers &amp; events</li>
                <li>Monitor donations &amp; fundraising</li>
                <li>Generate reports &amp; insights</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="testimonials" id="impact">
          <div className="section-head">
            <p className="eyebrow">Testimonials</p>
            <h2>Trusted by changemakers</h2>
          </div>

          <div className="testimonial-grid">
            <article className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="quote">"Switching to Community Care Portal transformed how we manage volunteers. Everything is in one place — no more scattered spreadsheets or missed updates."</p>
              <div className="testimonial-person">
                <div className="t-avatar-default" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--green-100)', color: 'var(--green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <strong>Priya Sharma</strong>
                  <span>Program Manager, Seva NGO</span>
                </div>
              </div>
            </article>

            <article className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="quote">"Our donation figures became fully transparent right after we started using the automated donation tracking feature."</p>
              <div className="testimonial-person">
                <div className="t-avatar-default" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--green-100)', color: 'var(--green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <strong>Rahul Verma</strong>
                  <span>Founder, Roshan Trust</span>
                </div>
              </div>
            </article>

            <article className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="quote">"The event registration module alone saves our team hours of manual work every single week. Highly recommended for any NGO."</p>
              <div className="testimonial-person">
                <div className="t-avatar-default" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--green-100)', color: 'var(--green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <strong>Ishaan Kapoor</strong>
                  <span>Volunteer Coordinator, HelpAge</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="cta-wrap">
          <div className="cta">
            <div className="cta-copy">
              <h2>Ready to amplify your impact?</h2>
              <p>Join hundreds of NGOs already using Community Care Portal to coordinate faster and serve more people.</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-white btn-lg" onClick={() => openSidebar('signup')}>Start for Free</button>
              <button
                className="cta-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                onClick={() => openSidebar('signup')}
              >
                Talk to us
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="brand brand-footer">
                <span className="brand-mark" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="26" height="26">
                    <rect x="1" y="1" width="30" height="30" rx="9" fill="currentColor" />
                    <path d="M16 22.5c-4.4-2.7-7.5-5.6-7.5-9.3a5 5 0 0 1 7.5-4.3 5 5 0 0 1 7.5 4.3c0 3.7-3.1 6.6-7.5 9.3Z" fill="#0b1220" />
                  </svg>
                </span>
                Community Care
              </a>
              <p>An all-in-one platform empowering NGOs to manage volunteers, coordinate causes, and amplify change.</p>
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <a href="#">Volunteer Hub</a>
              <a href="#">Events</a>
              <a href="#">Donations</a>
              <a href="#">Beneficiaries</a>
              <a href="#">Analytics</a>
            </div>

            <div className="footer-col">
              <h4>Organization</h4>
              <a href="#">About Us</a>
              <a href="#">Mission</a>
              <a href="#">Partner NGOs</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Security</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Community Care Portal. All rights reserved.</span>
            <div className="footer-social" aria-hidden="true">
              <span className="social-dot">in</span>
              <span className="social-dot">tw</span>
              <span className="social-dot">ig</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== SIDEBAR OVERLAY ===== */}
      <div
        className={sidebarOpen ? 'sidebar-overlay active' : 'sidebar-overlay'}
        onClick={closeSidebar}
      />

      {/* ===== AUTH SIDEBAR DRAWER ===== */}
      <aside
        className={sidebarOpen ? 'auth-sidebar active' : 'auth-sidebar'}
        aria-label="Account Registration Sidebar"
      >
        <button className="sidebar-close" aria-label="Close sidebar" onClick={closeSidebar}>✕</button>

        <div className="auth-header">
          <div className="auth-brand-badge">
            <svg viewBox="0 0 32 32" width="22" height="22">
              <rect x="1" y="1" width="30" height="30" rx="9" fill="currentColor" />
              <path d="M16 22.5c-4.4-2.7-7.5-5.6-7.5-9.3a5 5 0 0 1 7.5-4.3 5 5 0 0 1 7.5 4.3c0 3.7-3.1 6.6-7.5 9.3Z" fill="#fff" />
            </svg>
            Community Care
          </div>
          <h2>{authMode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
          <p>{authMode === 'signin' ? 'Sign in to your Community Care account' : 'Join thousands making a difference today'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role Selector — signup only */}
          {authMode === 'signup' && (
            <div className="role-section">
              <div className="role-section-label">I WANT TO JOIN AS</div>
              <div className="role-grid-select" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div
                  className={role === 'volunteer' ? 'role-card-opt active' : 'role-card-opt'}
                  onClick={() => setRole('volunteer')}
                >
                  <div className="role-icon-wrap">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h4>Volunteer</h4>
                  <p>Give time</p>
                  <div className="role-radio-dot"></div>
                </div>

                <div
                  className={role === 'donor' ? 'role-card-opt active' : 'role-card-opt'}
                  onClick={() => setRole('donor')}
                >
                  <div className="role-icon-wrap">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 21s-7-4.35-9.5-8.5C.7 8.6 3 5 6.5 5 9 5 11 6.8 12 8c1-1.2 3-3 5.5-3 3.5 0 5.8 3.6 4 7.5C19 16.65 12 21 12 21Z" />
                    </svg>
                  </div>
                  <h4>Donor</h4>
                  <p>Fund causes</p>
                  <div className="role-radio-dot"></div>
                </div>

                <div
                  className={role === 'admin' ? 'role-card-opt active' : 'role-card-opt'}
                  onClick={() => setRole('admin')}
                >
                  <div className="role-icon-wrap">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h4>Admin</h4>
                  <p>Manage all</p>
                  <div className="role-radio-dot"></div>
                </div>
              </div>
            </div>
          )}

          {/* Name Row — signup only */}
          {authMode === 'signup' && (
            <div className="auth-form-row signup-only-field">
              <div className="auth-form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="auth-input"
                  placeholder="Priya"
                  value={formData.firstName}
                  onChange={handleChange('firstName')}
                  required
                />
              </div>
              <div className="auth-form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="auth-input"
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="auth-form-group">
            <label htmlFor="emailAddr">Email Address</label>
            <div className="input-wrap">
              <span className="input-prefix-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>
              <input
                type="email"
                id="emailAddr"
                className="auth-input has-icon"
                placeholder="priya@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                required
              />
            </div>
          </div>

          {/* Phone — signup only */}
          {authMode === 'signup' && (
            <div className="auth-form-group signup-only-field">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrap">
                <span className="input-prefix-code">+91</span>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="auth-input has-code"
                  placeholder="98765 43210"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="auth-form-group">
            <label htmlFor="passInput">Password</label>
            <div className="input-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                id="passInput"
                className="auth-input has-toggle"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange('password')}
                required
              />
              <button
                type="button"
                className="pass-toggle-btn"
                aria-label="Toggle password visibility"
                onClick={() => setShowPass(s => !s)}
              >
                {showPass ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password — signup only */}
          {authMode === 'signup' && (
            <div className="auth-form-group signup-only-field">
              <label htmlFor="confirmPassInput">Confirm Password</label>
              <div className="input-wrap">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  id="confirmPassInput"
                  className="auth-input has-toggle"
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                />
                <button
                  type="button"
                  className="pass-toggle-btn"
                  aria-label="Toggle confirm password visibility"
                  onClick={() => setShowConfirmPass(s => !s)}
                >
                  {showConfirmPass ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Password Strength Meter — signup only */}
          {authMode === 'signup' && (
            <div className="strength-meter signup-only-field">
              <div className="strength-header">
                <span>Password strength</span>
                <span className="strength-text">{strengthLabel}</span>
              </div>
              <div className="strength-bars">
                <div className={passStrength >= 1 ? 'strength-bar active' : 'strength-bar'}></div>
                <div className={passStrength >= 2 ? 'strength-bar active' : 'strength-bar'}></div>
                <div className={passStrength >= 3 ? 'strength-bar active' : 'strength-bar'}></div>
                <div className={passStrength >= 4 ? 'strength-bar active' : 'strength-bar'}></div>
              </div>
            </div>
          )}

          {/* Terms — signup only */}
          {authMode === 'signup' && (
            <div className="terms-agreement signup-only-field">
              <input type="checkbox" id="termsCheck" defaultChecked required />
              <label htmlFor="termsCheck">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of Community Care
              </label>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#dc2626',
              fontSize: '14px',
              marginBottom: '12px'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>{authMode === 'signin' ? 'or sign in with' : 'or sign up with'}</span>
        </div>

        {/* Switch Footer */}
        <div className="auth-switch-footer">
          <span>{authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}</span>
          <span
            className="auth-switch-btn"
            onClick={() => { setAuthMode(m => m === 'signup' ? 'signin' : 'signup'); setErrorMsg(''); }}
            style={{ cursor: 'pointer' }}
          >
            {authMode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </aside>
    </>
  );
}
