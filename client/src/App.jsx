import { useState } from 'react';
import AuthModule from './components/AuthModule';
import CarePortal from './components/CarePortal';

function App() {
  const [view, setView] = useState('auth'); // 'auth' or 'portal'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f9fa', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setView('auth')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: view === 'auth' ? '#0f6b3f' : '#e4e7ec',
            color: view === 'auth' ? '#fff' : '#101828',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Auth Module Component
        </button>
        <button
          onClick={() => setView('portal')}
          style={{
            padding: '8px 16px',
            backgroundColor: view === 'portal' ? '#0f6b3f' : '#e4e7ec',
            color: view === 'portal' ? '#fff' : '#101828',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Care Portal Dashboard
        </button>
      </div>

      {view === 'auth' ? <AuthModule /> : <CarePortal />}
    </div>
  );
}

export default App;
