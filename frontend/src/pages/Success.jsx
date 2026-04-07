import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import '../index.css';

export default function Success() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    if (!session_id) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ session_id })
        });
        
        if (response.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        setStatus('error');
      }
    };
    verify();
  }, [session_id]);

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="max-w-md w-full bg-[#111111] p-8 rounded-2xl border border-white/10 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#b0fb5d] animate-spin" />
            <h2 className="text-xl font-bold text-white">Verifying Payment...</h2>
            <p className="text-gray-400 text-sm">Please do not close this window.</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-[#b0fb5d]/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[#b0fb5d]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
            <p className="text-gray-400 text-sm">Your contract has been fully funded. The freelancer has been notified.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-3 bg-[#b0fb5d] text-black font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Verification Failed</h2>
            <p className="text-gray-400 text-sm">We couldn't verify your payment. If you were charged, please contact support.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 w-full px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
