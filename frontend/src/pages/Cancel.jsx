import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="content" style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '40px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'rgba(255,71,87,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <XCircle size={32} style={{ color: 'var(--red)' }} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Payment Cancelled</h2>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>You have cancelled the checkout process. No charges were made.</p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost"
          style={{ width: '100%', padding: '12px' }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
