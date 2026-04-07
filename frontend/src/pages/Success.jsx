import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Success() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate payment verification
    const timer = setTimeout(() => {
      setStatus(session_id ? 'success' : 'error');
    }, 1500);
    return () => clearTimeout(timer);
  }, [session_id]);

  return (
    <div className="content" style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card animate-fade-in" style={{ maxWidth: '420px', width: '100%', padding: '40px', textAlign: 'center' }}>
        {status === 'loading' && (
          <div>
            <div style={{ width: '48px', height: '48px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Verifying Payment...</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ width: '64px', height: '64px', background: 'rgba(200,255,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={32} style={{ color: 'var(--accent)' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Payment Successful!</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>Your contract has been fully funded. The freelancer has been notified.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              Return to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ width: '64px', height: '64px', background: 'rgba(255,71,87,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Verification Failed</h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>We couldn't verify your payment. If you were charged, please contact support.</p>
            <button onClick={() => navigate('/')} className="btn btn-ghost" style={{ width: '100%', padding: '12px' }}>
              Go Back
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
